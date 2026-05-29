import {ConcurrencyQueue} from '../lib/concurrency-queue';
import {searchMusic} from '../api';
import {isrc2deezer} from './deezer';
import type {trackType} from '../types';
import type {spotifyTrack} from './spotify-types';

const spotifyMatchSearchLimit = 10;
const spotifyMatchMinScore = 88;
const spotifyMatchMinTitle = 85;
const spotifyMatchMinArtist = 80;
const spotifyMatchMaxDuration = 5;
const spotifyMatchMinLead = 5;

type spotifyMatchInput = {
  title: string;
  artists: string[];
  album: string;
  durationSec: number;
};

type spotifyMatchScore = {
  total: number;
  title: number;
  artist: number;
  primaryArtist: number;
  album: number;
  duration: number;
  durationDiff: number;
  conflict: boolean;
};

const searchQueue = new ConcurrencyQueue({concurrency: 25});

export const spotifyTrackToDeezerTrack = async (track: spotifyTrack): Promise<trackType> => {
  const isrc = track.external_ids?.isrc;
  if (isrc) {
    try {
      return await isrc2deezer(track.name, isrc);
    } catch (err) {
      // Fall back to metadata matching below when Deezer no longer resolves the ISRC.
    }
  }
  return await spotifyMetadataToDeezer({
    title: track.name,
    album: track.album?.name || '',
    durationSec: Math.round(track.duration_ms / 1000),
    artists: track.artists.map((artist) => artist.name).filter(Boolean),
  });
};

const spotifyMetadataToDeezer = async (input: spotifyMatchInput): Promise<trackType> => {
  const candidates = await searchSpotifyDeezerCandidates(input);
  if (candidates.length === 0) {
    throw new Error(`no deezer candidates for spotify track "${input.title}"`);
  }

  let best: trackType | null = null;
  let bestScore: spotifyMatchScore | null = null;
  let secondBest = 0;

  for (const candidate of candidates) {
    const score = scoreSpotifyDeezerCandidate(input, candidate);
    if (score.conflict) {
      continue;
    }
    if (!bestScore || score.total > bestScore.total) {
      if (bestScore) {
        secondBest = bestScore.total;
      }
      best = candidate;
      bestScore = score;
      continue;
    }
    if (score.total > secondBest) {
      secondBest = score.total;
    }
  }

  if (!best || !bestScore) {
    throw new Error(`no safe deezer match for spotify track "${input.title}"`);
  }
  if (
    bestScore.total < spotifyMatchMinScore ||
    bestScore.title < spotifyMatchMinTitle ||
    bestScore.artist < spotifyMatchMinArtist ||
    bestScore.durationDiff > spotifyMatchMaxDuration
  ) {
    throw new Error(
      `weak deezer match for spotify track "${input.title}": score=${bestScore.total} title=${bestScore.title} artist=${bestScore.artist} duration_diff=${bestScore.durationDiff}s`,
    );
  }
  if (secondBest > 0 && bestScore.total < 95 && bestScore.total - secondBest < spotifyMatchMinLead) {
    throw new Error(
      `ambiguous deezer match for spotify track "${input.title}": best=${bestScore.total} second=${secondBest}`,
    );
  }

  return best;
};

const searchSpotifyDeezerCandidates = async (input: spotifyMatchInput): Promise<trackType[]> => {
  const results = await Promise.all(
    spotifyMatchQueries(input).map((query) =>
      searchQueue.add(async () => {
        const search = await searchMusic(query, ['TRACK'], spotifyMatchSearchLimit);
        return search.TRACK.data;
      }),
    ),
  );

  const seen = new Set<string>();
  const candidates: trackType[] = [];
  for (const tracks of results) {
    for (const track of tracks || []) {
      if (!track.SNG_ID || seen.has(track.SNG_ID)) {
        continue;
      }
      seen.add(track.SNG_ID);
      candidates.push(track);
    }
  }
  return candidates;
};

const spotifyMatchQueries = (input: spotifyMatchInput): string[] => {
  const primaryArtist = input.artists[0] || '';
  const allArtists = input.artists.join(' ');
  const cleanTitle = cleanSpotifySearchTitle(input.title);
  const raw = [
    `${input.title} ${primaryArtist}`,
    `${cleanTitle} ${primaryArtist}`,
    `${input.title} ${allArtists}`,
    `${cleanTitle} ${allArtists}`,
    `${input.title} ${primaryArtist} ${input.album}`,
    `${cleanTitle} ${primaryArtist} ${input.album}`,
  ].map((query) => query.trim());

  const seen = new Set<string>();
  return raw.filter((query) => {
    const key = normalizeForCompare(query);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const scoreSpotifyDeezerCandidate = (input: spotifyMatchInput, candidate: trackType): spotifyMatchScore => {
  const title = bestTitleScore(input.title, candidate);
  const artist = bestArtistScore(input.artists, candidate);
  const primaryArtist = primaryArtistScore(input.artists, candidate.ART_NAME);
  const album = similarityScore(normalizeForCompare(input.album), normalizeForCompare(candidate.ALB_TITLE));
  const durationDiff = Math.abs(input.durationSec - Number(candidate.DURATION));
  const duration = durationScore(durationDiff);
  let conflict = hasVersionConflict(input.title, candidate) || hasFeatureConflict(input, candidate);

  let total = Math.round(title * 0.4 + artist * 0.3 + album * 0.15 + duration * 0.15);
  if (!input.album) {
    total = Math.round(title * 0.45 + artist * 0.35 + duration * 0.2);
  }
  if (title >= 95 && artist >= 90 && durationDiff <= spotifyMatchMaxDuration) {
    total = Math.max(total, Math.round(title * 0.45 + artist * 0.35 + duration * 0.2));
  }
  if (durationDiff > 20 || title < 80 || artist < 70 || primaryArtist < spotifyMatchMinArtist) {
    conflict = true;
  }

  return {total, title, artist, primaryArtist, album, duration, durationDiff, conflict};
};

const bestTitleScore = (source: string, candidate: trackType): number => {
  let score = similarityScore(normalizeTitleBase(source), normalizeTitleBase(candidate.SNG_TITLE));
  if (candidate.VERSION) {
    score = Math.max(
      score,
      similarityScore(normalizeTitleBase(source), normalizeTitleBase(candidate.SNG_TITLE + ' ' + candidate.VERSION)),
    );
  }
  return score;
};

const bestArtistScore = (sourceArtists: string[], candidate: trackType): number => {
  const candidateArtists = [candidate.ART_NAME, ...candidate.ARTISTS.map((artist) => artist.ART_NAME).filter(Boolean)];
  let best = 0;
  for (const source of sourceArtists) {
    for (const candidateArtist of candidateArtists) {
      best = Math.max(best, artistSimilarityScore(source, candidateArtist));
    }
  }
  return best;
};

const primaryArtistScore = (sourceArtists: string[], candidatePrimaryArtist: string): number => {
  let best = 0;
  for (const source of sourceArtists) {
    best = Math.max(best, artistSimilarityScore(source, candidatePrimaryArtist));
  }
  return best;
};

const durationScore = (diff: number): number => {
  if (diff <= 2) return 100;
  if (diff <= 5) return 90;
  if (diff <= 10) return 70;
  if (diff <= 20) return 30;
  return 0;
};

const hasVersionConflict = (source: string, candidate: trackType): boolean => {
  const sourceTags = versionTags(source);
  const candidateTags = versionTags(candidate.SNG_TITLE + (candidate.VERSION ? ' ' + candidate.VERSION : ''));

  for (const tag of [
    'live',
    'remix',
    'acoustic',
    'instrumental',
    'karaoke',
    'cover',
    'tribute',
    'sped up',
    'slowed',
    'remaster',
    're-recorded',
    'year version',
  ]) {
    if ((candidateTags.has(tag) && !sourceTags.has(tag)) || (sourceTags.has(tag) && !candidateTags.has(tag))) {
      return true;
    }
  }
  return false;
};

const hasFeatureConflict = (input: spotifyMatchInput, candidate: trackType): boolean => {
  const candidateFeatures = featureNames(candidate.SNG_TITLE + (candidate.VERSION ? ' ' + candidate.VERSION : ''));
  if (candidateFeatures.size === 0) {
    return false;
  }

  const sourceArtists = normalizedArtistSet(input.artists);
  for (const feature of featureNames(input.title)) {
    sourceArtists.add(feature);
  }
  for (const feature of candidateFeatures) {
    if (!sourceArtists.has(feature)) {
      return true;
    }
  }
  return false;
};

const normalizeTitleBase = (value: string): string =>
  normalizeForCompare(removeVersionChunks(removeNonVersionTitleNoise(removeFeatureText(value))));

const normalizeArtistForCompare = (value: string): string => normalizeForCompare(value).replace(/^the /, '');

const artistSimilarityScore = (a: string, b: string): number => {
  let best = 0;
  for (const left of artistCompareVariants(a)) {
    for (const right of artistCompareVariants(b)) {
      best = Math.max(best, similarityScore(left, right));
    }
  }
  return best;
};

const artistCompareVariants = (value: string): string[] => {
  const raw = normalizeArtistForCompare(value);
  const decoded = normalizeArtistForCompare(value.replace(/\$/g, 's').replace(/!/g, 'i').replace(/@/g, 'a'));
  if (!raw || raw === decoded) {
    return [decoded];
  }
  return [raw, decoded];
};

const normalizedArtistSet = (artists: string[]): Set<string> => {
  const set = new Set<string>();
  for (const artist of artists) {
    for (const variant of artistCompareVariants(artist)) {
      if (variant) {
        set.add(variant);
      }
    }
  }
  return set;
};

const featureNames = (value: string): Set<string> => {
  const names = new Set<string>();
  for (const group of featureGroups(value)) {
    for (const name of splitFeatureGroup(group)) {
      const normalized = normalizeArtistForCompare(name);
      if (normalized) {
        names.add(normalized);
      }
      for (const variant of artistCompareVariants(name)) {
        if (variant) {
          names.add(variant);
        }
      }
    }
  }
  return names;
};

const featureGroups = (value: string): string[] => {
  const groups: string[] = [];
  const re = /(?:\(|\[)?\b(?:featuring|feat|ft)\.?\s+([^\])]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(value))) {
    groups.push(match[1]);
  }
  return groups;
};

const splitFeatureGroup = (value: string): string[] =>
  value
    .replace(/\s+remix\b.*$/i, '')
    .replace(/ & | and /gi, ',')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

const cleanSpotifySearchTitle = (value: string): string =>
  removeNonVersionTitleNoise(removeFeatureText(value)).replace(/\s+/g, ' ').trim();

const normalizeForCompare = (value: string): string => {
  const stripped = value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/&/g, ' and ');
  return stripped.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
};

const removeFeatureText = (value: string): string => value.replace(/\b(feat|featuring|ft)\.?\b.*/i, '');

const removeNonVersionTitleNoise = (value: string): string => {
  const withoutSuffix = value.replace(/\s+-\s+from\b.*$/i, '').replace(/\s+-\s+studio recording\b.*$/i, '');
  return withoutSuffix.replace(/\([^)]*\)|\[[^\]]*\]/g, (chunk) => {
    const normalized = normalizeForCompare(chunk);
    return ['with ', 'feat', 'featuring', ' from ', 'soundtrack', 'motion picture', 'series', 'movie'].some((marker) =>
      normalized.includes(marker),
    )
      ? ' '
      : chunk;
  });
};

const removeVersionChunks = (value: string): string =>
  value.replace(/\([^)]*\)|\[[^\]]*\]| - [^-]+$/g, (chunk) => (versionTags(chunk).size > 0 ? ' ' : chunk));

const versionTags = (value: string): Set<string> => {
  const normalized = normalizeForCompare(value);
  const tags = new Set<string>();
  const checks: Record<string, string[]> = {
    live: ['live'],
    remix: ['remix'],
    acoustic: ['acoustic', 'unplugged'],
    instrumental: ['instrumental'],
    karaoke: ['karaoke'],
    cover: ['cover'],
    tribute: ['tribute'],
    'sped up': ['sped up', 'speed up'],
    slowed: ['slowed'],
    remaster: ['remaster', 'remastered', 're master', 're mastered'],
    're-recorded': ['re recorded', 'rerecorded'],
    'radio edit': ['radio edit'],
    extended: ['extended'],
  };
  for (const [tag, patterns] of Object.entries(checks)) {
    if (patterns.some((pattern) => normalized.includes(pattern))) {
      tags.add(tag);
    }
  }
  if (
    /(\([^)]*\b(?:19|20)\d{2}\b[^)]*\)|\[[^\]]*\b(?:19|20)\d{2}\b[^\]]*\]|\b(?:19|20)\d{2}\s+version\b|-\s*(?:19|20)\d{2}\s*$)/i.test(
      value,
    )
  ) {
    tags.add('year version');
  }
  return tags;
};

const similarityScore = (a: string, b: string): number => {
  if (!a || !b) {
    return 0;
  }
  if (a === b) {
    return 100;
  }
  return Math.max(levenshteinSimilarity(a, b), levenshteinSimilarity(sortTokens(a), sortTokens(b)));
};

const sortTokens = (value: string): string => value.split(/\s+/).filter(Boolean).sort().join(' ');

const levenshteinSimilarity = (a: string, b: string): number => {
  const maxLen = Math.max([...a].length, [...b].length);
  if (maxLen === 0) {
    return 100;
  }
  return Math.round((1 - levenshteinDistance([...a], [...b]) / maxLen) * 100);
};

const levenshteinDistance = (a: string[], b: string[]): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({length: b.length + 1}, (_, index) => index);
  let curr = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
};
