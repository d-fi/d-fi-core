import axios from 'axios';
import {searchAlternative, searchMusic} from '../api';
import type {trackType} from '../types';

type youtubeMetadata = {
  title: string;
  artist: string;
};

const youtubeBrowserUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

const getTrack = async (id: string): Promise<trackType | undefined> => {
  const {title, artist} = await fetchYouTubeMetadata(id);

  if (title && artist) {
    const {TRACK} = await searchAlternative(artist, title, 1);
    if (TRACK.data[0]) {
      return TRACK.data[0];
    }
  }

  const query = sanitizeYouTubeTitle(title) || sanitizeYouTubeTitle(artist);
  if (!query) {
    return undefined;
  }

  const {TRACK} = await searchMusic(query, ['TRACK'], 20);
  const queryLower = query.toLowerCase();
  const artistMatch = TRACK.data.find((track) => queryLower.includes(track.ART_NAME.toLowerCase()));
  return artistMatch || TRACK.data[0];
};

const fetchYouTubeMetadata = async (id: string): Promise<youtubeMetadata> => {
  const oembed = await fetchYouTubeOEmbed(id);
  if (oembed.title || oembed.artist) {
    return oembed;
  }

  const {data} = await axios.get<string>(`https://www.youtube.com/watch?v=${id}&hl=en`, {
    timeout: 15000,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': youtubeBrowserUserAgent,
    },
  });

  let title = '';
  let artist = '';

  const playerJSON = extractJSONAssignment(data, 'ytInitialPlayerResponse');
  if (playerJSON) {
    try {
      const player = JSON.parse(playerJSON);
      title = stringAt(player, 'videoDetails', 'title');
      artist = stringAt(player, 'videoDetails', 'author');
    } catch (err) {}
  }

  if (!title) {
    title = extractMetaContent(data, 'title');
  }

  const initialJSON = extractJSONAssignment(data, 'ytInitialData');
  if (initialJSON) {
    try {
      const initial = JSON.parse(initialJSON);
      title = findMetadataRow(initial, 'Song') || title;
      artist = findMetadataRow(initial, 'Artist') || artist;
    } catch (err) {}
  }

  return {
    title: unescapeHTML(title),
    artist: unescapeHTML(artist),
  };
};

const fetchYouTubeOEmbed = async (id: string): Promise<youtubeMetadata> => {
  try {
    const {data} = await axios.get<{title?: string; author_name?: string}>(
      'https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=' + id,
      {timeout: 15000},
    );
    return {
      title: unescapeHTML(data.title || ''),
      artist: unescapeHTML(data.author_name || ''),
    };
  } catch (err) {
    return {
      title: '',
      artist: '',
    };
  }
};

const extractJSONAssignment = (body: string, name: string): string => {
  const markers = ['var ' + name + ' =', `window["${name}"] =`, `window['${name}'] =`, name + ' ='];
  let index = -1;
  for (const marker of markers) {
    index = body.indexOf(marker);
    if (index !== -1) {
      break;
    }
  }
  if (index === -1) {
    return '';
  }

  const start = body.indexOf('{', index);
  if (start === -1) {
    return '';
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < body.length; index += 1) {
    const char = body[index];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return body.slice(start, index + 1);
      }
    }
  }

  return '';
};

const extractMetaContent = (body: string, name: string): string => {
  const match = body.match(new RegExp(`<meta\\s+name="${escapeRegExp(name)}"\\s+content="([^"]*)"`, 'i'));
  return match ? unescapeHTML(match[1]) : '';
};

const findMetadataRow = (value: unknown, title: string): string => {
  if (Array.isArray(value)) {
    for (const child of value) {
      const found = findMetadataRow(child, title);
      if (found) {
        return found;
      }
    }
    return '';
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const row = record.metadataRowRenderer;
    if (row && typeof row === 'object') {
      const rowRecord = row as Record<string, unknown>;
      if (stringAt(rowRecord, 'title', 'simpleText') === title) {
        return metadataRowContent(rowRecord);
      }
    }

    for (const child of Object.values(record)) {
      const found = findMetadataRow(child, title);
      if (found) {
        return found;
      }
    }
  }

  return '';
};

const metadataRowContent = (row: Record<string, unknown>): string => {
  const contents = row.contents;
  if (!Array.isArray(contents)) {
    return '';
  }

  for (const content of contents) {
    if (!content || typeof content !== 'object') {
      continue;
    }
    const contentRecord = content as Record<string, unknown>;
    const simpleText = contentRecord.simpleText;
    if (typeof simpleText === 'string') {
      return simpleText;
    }
    const runs = contentRecord.runs;
    if (Array.isArray(runs) && runs[0] && typeof runs[0] === 'object') {
      const text = (runs[0] as Record<string, unknown>).text;
      if (typeof text === 'string') {
        return text;
      }
    }
  }

  return '';
};

const stringAt = (value: unknown, ...path: string[]): string => {
  let current = value;
  for (const key of path) {
    if (!current || typeof current !== 'object') {
      return '';
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : '';
};

const sanitizeYouTubeTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\(off.*?\)/gi, '')
    .replace(/ft\..*/i, '')
    .replace(/[,-.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const unescapeHTML = (value: string): string => {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Convert a youtube video to track by video id
 * @param {String} id - video id
 */
export const track2deezer = async (id: string) => {
  const track = await getTrack(id);
  if (track) {
    return track;
  }

  throw new Error('No track found for youtube video ' + id);
};
