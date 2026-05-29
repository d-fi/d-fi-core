import axios from 'axios';
import delay from 'delay';
import type {spotifyList, spotifyResourceType, tokensType} from './spotify-types';

const spotifyAPIBaseURL = 'https://api.spotify.com/v1/';
const spotifyBrowserUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

let spotifyToken = '';
let spotifyTokenKey = '';
let spotifyTokenExpiry = 0;

export const spotifyGet = async <T>(path: string): Promise<T> => {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await spotifyGetOnce<T>(path);
    } catch (err: any) {
      lastErr = err;
      const status = err.response?.status;
      if (status === 429) {
        const retryAfter = err.response?.headers?.['retry-after'];
        throw new Error('spotify API rate limited' + (retryAfter ? `: retry after ${retryAfter} seconds` : ''));
      }
      if (status === 401 && attempt === 0) {
        resetSpotifyToken();
        continue;
      }
      const retry = status === 502 || status === 503 || status === 504 || !status;
      if (!retry) {
        throw err;
      }
      await delay((attempt + 1) * 500);
    }
  }
  throw lastErr;
};

export const spotifyGetPages = async <T>(path: string): Promise<{items: T[]; total: number}> => {
  const items: T[] = [];
  let total = 0;
  let nextURL: string | null = spotifyAPIBaseURL + path;

  while (nextURL) {
    const apiPath: string = nextURL.startsWith(spotifyAPIBaseURL) ? nextURL.slice(spotifyAPIBaseURL.length) : nextURL;
    const page: spotifyList<T> = await spotifyGet<spotifyList<T>>(apiPath);
    if (total === 0) {
      total = page.total;
    }
    items.push(...page.items);
    nextURL = page.next;
  }

  return {items, total};
};

export const getSpotifyAnonymousToken = async (resourceType: spotifyResourceType, id: string): Promise<tokensType> => {
  const key = resourceType + ':' + id;
  if (spotifyToken && spotifyTokenKey === key && Date.now() < spotifyTokenExpiry - 60_000) {
    return {
      clientId: '',
      accessToken: spotifyToken,
      accessTokenExpirationTimestampMs: spotifyTokenExpiry,
      isAnonymous: true,
    };
  }

  const embedURL = `https://open.spotify.com/embed/${encodeURIComponent(resourceType)}/${encodeURIComponent(
    id,
  )}?utm_source=oembed`;
  const {data} = await axios.get<string>(embedURL, {
    timeout: 15000,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': spotifyBrowserUserAgent,
    },
  });

  const tokenMatch = data.match(/"accessToken":"([^"]+)"/);
  if (!tokenMatch) {
    throw new Error('spotify access token not found');
  }
  const expiryMatch = data.match(/"accessTokenExpirationTimestampMs":(\d+)/);
  const expiry = expiryMatch ? Number(expiryMatch[1]) : Date.now() + 30 * 60 * 1000;

  spotifyToken = tokenMatch[1];
  spotifyTokenKey = key;
  spotifyTokenExpiry = expiry;

  return {
    clientId: '',
    accessToken: spotifyToken,
    accessTokenExpirationTimestampMs: spotifyTokenExpiry,
    isAnonymous: true,
  };
};

const spotifyGetOnce = async <T>(path: string): Promise<T> => {
  const [resourceType, resourceID] = spotifyTokenResource(path);
  const token = await getSpotifyAnonymousToken(resourceType, resourceID);
  const {data} = await axios.get<T>(spotifyAPIBaseURL + path, {
    timeout: 15000,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token.accessToken,
      'User-Agent': spotifyBrowserUserAgent,
    },
  });
  return data;
};

const resetSpotifyToken = (): void => {
  spotifyToken = '';
  spotifyTokenKey = '';
  spotifyTokenExpiry = 0;
};

const spotifyTokenResource = (path: string): [spotifyResourceType, string] => {
  const trimmed = path.replace(spotifyAPIBaseURL, '').split('?')[0];
  const parts = trimmed.replace(/^\/+|\/+$/g, '').split('/');
  if (parts.length < 2 || !parts[1]) {
    throw new Error('unsupported spotify API path: ' + path);
  }

  switch (parts[0]) {
    case 'tracks':
      return ['track', parts[1]];
    case 'albums':
      return ['album', parts[1]];
    case 'playlists':
      return ['playlist', parts[1]];
    case 'artists':
      return ['artist', parts[1]];
    default:
      throw new Error('unsupported spotify API path: ' + path);
  }
};
