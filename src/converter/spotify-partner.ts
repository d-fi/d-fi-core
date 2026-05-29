import axios from 'axios';
import {getSpotifyAnonymousToken, spotifyBrowserUserAgent} from './spotify-api';
import type {spotifyAlbumRef, spotifyArtist, spotifyImage, spotifyPlaylist, spotifyTrack} from './spotify-types';

const spotifyPartnerQueryURL = 'https://api-partner.spotify.com/pathfinder/v1/query';
const spotifyPlaylistQuery = 'queryPlaylist';
const spotifyPlaylistQuerySHA = '908a5597b4d0af0489a9ad6a2d41bc3b416ff47c0884016d92bbd6822d0eb6d8';
const spotifyPartnerPageLimit = 1000;

type spotifyPartnerPlaylistResponse = {
  data: {
    playlistV2: {
      id: string;
      name: string;
      description: string;
      uri: string;
      followers: number;
      images: {
        items: Array<{
          sources: spotifyImage[];
        }>;
      };
      ownerV2: {
        data: {
          name: string;
          uri: string;
          username: string;
        };
      };
      content: {
        items: Array<{
          itemV2: {
            data: spotifyPartnerTrack;
          };
        }>;
        pagingInfo: {
          nextOffset?: number | null;
        };
        totalCount: number;
      };
    };
  };
};

type spotifyPartnerTrack = {
  uri: string;
  name: string;
  albumOfTrack: spotifyPartnerAlbum;
  artists: spotifyPartnerArtists;
  duration: {
    totalMilliseconds: number;
  };
  contentRating: {
    label: string;
  };
};

type spotifyPartnerAlbum = {
  uri: string;
  name: string;
  coverArt: {
    sources: spotifyImage[];
  };
};

type spotifyPartnerArtists = {
  items: Array<{
    uri: string;
    profile: {
      name: string;
    };
  }>;
};

export const getSpotifyPartnerPlaylist = async (
  id: string,
): Promise<{playlist: spotifyPlaylist; tracks: spotifyTrack[]}> => {
  let offset = 0;
  let total = 0;
  let playlist: spotifyPlaylist | undefined;
  const tracks: spotifyTrack[] = [];

  let hasNextPage = true;
  while (hasNextPage) {
    const page = await getSpotifyPartnerPlaylistPage(id, spotifyPartnerPageLimit, offset);
    const body = page.data.playlistV2;
    if (!body.id) {
      throw new Error('spotify partner playlist ' + id + ' not found');
    }
    if (offset === 0) {
      playlist = spotifyPartnerPlaylistToSpotifyPlaylist(page);
      total = body.content.totalCount;
      playlist.tracks.total = total;
    }

    for (const item of body.content.items) {
      const track = spotifyPartnerTrackToSpotifyTrack(item.itemV2.data);
      if (track.id && track.name) {
        tracks.push(track);
      }
    }

    const nextOffset = body.content.pagingInfo.nextOffset;
    if (nextOffset !== undefined && nextOffset !== null && nextOffset > offset) {
      offset = nextOffset;
    } else {
      hasNextPage = false;
    }
  }

  if (!playlist) {
    throw new Error('spotify partner playlist ' + id + ' not found');
  }

  return {playlist, tracks};
};

const getSpotifyPartnerPlaylistPage = async (
  id: string,
  limit: number,
  offset: number,
): Promise<spotifyPartnerPlaylistResponse> => {
  const token = await getSpotifyAnonymousToken('playlist', id);
  const params = new URLSearchParams({
    operationName: spotifyPlaylistQuery,
    variables: JSON.stringify({
      uri: 'spotify:playlist:' + id,
      limit,
      offset,
    }),
    extensions: JSON.stringify({
      persistedQuery: {
        version: 1,
        sha256Hash: spotifyPlaylistQuerySHA,
      },
    }),
  });

  try {
    const {data} = await axios.get<spotifyPartnerPlaylistResponse>(spotifyPartnerQueryURL + '?' + params.toString(), {
      timeout: 15000,
      headers: {
        Accept: 'application/json',
        'App-Platform': 'WebPlayer',
        Authorization: 'Bearer ' + token,
        'Spotify-App-Version': '1.2.62.268.gcb6cd226',
        'User-Agent': spotifyBrowserUserAgent,
      },
    });
    return data;
  } catch (err: any) {
    if (err.response?.status === 429) {
      const retryAfter = err.response?.headers?.['retry-after'];
      throw new Error('spotify partner API rate limited' + (retryAfter ? `: retry after ${retryAfter} seconds` : ''));
    }
    if (err.response?.status) {
      throw new Error('spotify partner API error: ' + err.response.status + ' ' + err.response.statusText);
    }
    throw err;
  }
};

const spotifyPartnerPlaylistToSpotifyPlaylist = (page: spotifyPartnerPlaylistResponse): spotifyPlaylist => {
  const body = page.data.playlistV2;
  const ownerID = spotifyIDFromURI(body.ownerV2.data.uri) || body.ownerV2.data.username;
  return {
    id: body.id,
    name: body.name,
    description: body.description,
    images: body.images.items[0]?.sources || [],
    owner: {
      id: ownerID,
      display_name: body.ownerV2.data.name,
      type: 'user',
    },
    tracks: {
      total: body.content.totalCount,
    },
    type: 'playlist',
    uri: body.uri,
  };
};

const spotifyPartnerTrackToSpotifyTrack = (track: spotifyPartnerTrack): spotifyTrack => {
  const artists: spotifyArtist[] = track.artists.items.flatMap((item) => {
    if (!item.profile.name) {
      return [];
    }
    return [
      {
        id: spotifyIDFromURI(item.uri),
        name: item.profile.name,
        type: 'artist',
      },
    ];
  });

  const album: spotifyAlbumRef = {
    id: spotifyIDFromURI(track.albumOfTrack.uri),
    name: track.albumOfTrack.name,
    images: track.albumOfTrack.coverArt.sources,
    artists,
    type: 'album',
    uri: track.albumOfTrack.uri,
  };

  return {
    id: spotifyIDFromURI(track.uri),
    name: track.name,
    duration_ms: track.duration.totalMilliseconds,
    explicit: track.contentRating.label.toLowerCase() === 'explicit',
    artists,
    album,
    type: 'track',
    uri: track.uri,
  };
};

const spotifyIDFromURI = (uri: string): string => {
  const parts = uri.split(':');
  return parts[parts.length - 1] || '';
};
