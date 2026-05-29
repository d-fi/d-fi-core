import PQueue from 'p-queue';
import {upc2deezer} from './deezer';
import {getSpotifyAnonymousTokenInfo, spotifyGet, spotifyGetPages} from './spotify-api';
import {spotifyTrackToDeezerTrack} from './spotify-match';
import {getSpotifyPartnerPlaylist} from './spotify-partner';
import type {albumType, playlistInfo, trackType} from '../types';
import type {
  spotifyAlbumRef,
  spotifyPlaylist,
  spotifyPlaylistTrackItem,
  spotifyResourceType,
  spotifyTrack,
  tokensType,
} from './spotify-types';

/**
 * Limit process concurrency
 */
const queue = new PQueue({concurrency: 25});

/**
 * Set spotify token anonymously from an embed page. This replaces Spotify's old
 * get_access_token endpoint, which is now commonly blocked.
 */
export const setSpotifyAnonymousToken = async (
  resourceType: spotifyResourceType = 'track',
  id = '7FIWs0pqAYbP91WWM0vlTQ',
): Promise<tokensType> => {
  return await getSpotifyAnonymousTokenInfo(resourceType, id);
};

/**
 * Convert spotify songs to deezer
 * @param {String} id Spotify track id
 * @returns {trackType}
 */
export const track2deezer = async (id: string): Promise<trackType> => {
  const track = await spotifyGet<spotifyTrack>('tracks/' + id);
  return await spotifyTrackToDeezerTrack(track);
};

/**
 * Convert spotify albums to deezer
 * @param {String} id Spotify album id
 */
export const album2deezer = async (id: string): Promise<[albumType, trackType[]]> => {
  const album = await spotifyGet<spotifyAlbumRef>('albums/' + id);
  return await upc2deezer(album.name, album.external_ids?.upc);
};

/**
 * Convert playlist to deezer
 * @param {String} id Spotify playlist id
 */
export const playlist2Deezer = async (
  id: string,
  onError?: (item: spotifyTrack, index: number, err: Error) => void,
): Promise<[playlistInfo, trackType[]]> => {
  let body: spotifyPlaylist | undefined;
  let page: {items: spotifyTrack[]; total: number} | undefined;
  let playlistErr: Error | undefined;
  let trackErr: Error | undefined;

  try {
    body = await getSpotifyPlaylist(id);
  } catch (err: any) {
    playlistErr = err;
  }

  if (body) {
    try {
      page = await getSpotifyPlaylistTracks(id);
    } catch (err: any) {
      trackErr = err;
    }
  }

  if (!body || !page) {
    try {
      const partner = await getSpotifyPartnerPlaylist(id);
      const tracks = await spotifyPlaylistTracksToDeezer(partner.tracks, onError);
      return [spotifyPlaylistInfoToDeezer(partner.playlist, partner.playlist.tracks.total), tracks];
    } catch (partnerErr: any) {
      const primaryErr = playlistErr || trackErr;
      if (primaryErr) {
        throw new Error(primaryErr.message + '; spotify partner fallback failed: ' + partnerErr.message);
      }
      throw partnerErr;
    }
  }

  const tracks = await spotifyPlaylistTracksToDeezer(page.items, onError);
  return [spotifyPlaylistInfoToDeezer(body, page.total), tracks];
};

/**
 * Convert artist songs to deezer. Maximum of 10 tracks.
 * @param {String} id Spotify artist id
 */
export const artist2Deezer = async (
  id: string,
  onError?: (item: spotifyTrack, index: number, err: Error) => void,
): Promise<trackType[]> => {
  const {tracks: items} = await spotifyGet<{tracks: spotifyTrack[]}>('artists/' + id + '/top-tracks?market=US');
  return await spotifyTracksToDeezer(items, onError);
};

const getSpotifyPlaylistTracks = async (id: string): Promise<{items: spotifyTrack[]; total: number}> => {
  const path =
    'playlists/' +
    id +
    '/tracks?limit=100&fields=total,next,items(track(id,name,duration_ms,explicit,external_ids,artists(id,name,type),album(id,name,album_type,release_date,images,artists(id,name,type)),type,uri))';
  const page = await spotifyGetPages<spotifyPlaylistTrackItem>(path);
  return {
    total: page.total,
    items: page.items.flatMap((item) => (item.track && item.track.id ? [item.track] : [])),
  };
};

const getSpotifyPlaylist = async (id: string): Promise<spotifyPlaylist> => {
  return await spotifyGet<spotifyPlaylist>(
    'playlists/' + id + '?fields=id,name,description,public,collaborative,images,owner,tracks.total,type,uri',
  );
};

const spotifyPlaylistInfoToDeezer = (body: spotifyPlaylist, total: number): playlistInfo => {
  const dateCreated = new Date().toISOString();
  return {
    PLAYLIST_ID: body.id,
    DESCRIPTION: body.description,
    PARENT_USERNAME: body.owner.display_name || body.owner.id,
    PARENT_USER_ID: body.owner.id,
    PICTURE_TYPE: 'cover',
    PLAYLIST_PICTURE: body.images[0]?.url || '',
    TITLE: body.name,
    TYPE: '0',
    STATUS: '0',
    USER_ID: body.owner.id,
    DATE_ADD: dateCreated,
    DATE_MOD: dateCreated,
    DATE_CREATE: dateCreated,
    NB_SONG: total,
    NB_FAN: 0,
    CHECKSUM: body.id,
    HAS_ARTIST_LINKED: false,
    IS_SPONSORED: false,
    IS_EDITO: false,
    __TYPE__: 'playlist',
  } as playlistInfo;
};

const spotifyTracksToDeezer = async (
  items: spotifyTrack[],
  onError?: (item: spotifyTrack, index: number, err: Error) => void,
): Promise<trackType[]> => {
  const tracks: Array<trackType | undefined> = [];
  await queue.addAll(
    items.map((item, index) => {
      return async () => {
        try {
          tracks[index] = await spotifyTrackToDeezerTrack(item);
        } catch (err: any) {
          if (onError) {
            onError(item, index, err);
          }
        }
      };
    }),
  );
  return tracks.filter((track): track is trackType => Boolean(track));
};

const spotifyPlaylistTracksToDeezer = async (
  items: spotifyTrack[],
  onError?: (item: spotifyTrack, index: number, err: Error) => void,
): Promise<trackType[]> => {
  const tracks = await spotifyTracksToDeezer(items, onError);
  tracks.forEach((track, index) => {
    track.TRACK_POSITION = index + 1;
  });
  return tracks;
};
