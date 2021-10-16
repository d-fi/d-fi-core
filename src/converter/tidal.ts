import axios from 'axios';
import PQueue from 'p-queue';
import {isrc2deezer, upc2deezer} from './deezer';
import type {playlistInfo, trackType} from '../types';

interface commonType {
  id: number;
  title: string;
  duration: number;
  premiumStreamingOnly: boolean;
  trackNumber: number;
  copyright: string;
  url: string;
  explicit: boolean;
  audioQuality: string;
  artist: {
    id: number;
    name: string;
    type: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
  };
}

interface tidalTrackType extends commonType {
  isrc: string;
  editable: boolean;
  audioQuality: string;
  album: {
    id: number;
    title: string;
    cover: string;
  };
}

interface tidalAlbumType extends commonType {
  cover: string;
  videoCover: null | string;
  upc: string;
  audioQuality: string;
}

interface tidalPlaylistType {
  uuid: string;
  title: string;
  numberOfTracks: number;
  numberOfVideos: number;
  creator: {
    id: number;
  };
  description: string;
  duration: number;
  lastUpdated: string;
  created: string;
  type: string;
  publicPlaylist: boolean;
  url: string;
  image: string;
}

interface listType {
  limit: number;
  offset: number;
  totalNumberOfItems: number;
}

interface tidalArtistTopTracksType extends listType {
  items: tidalTrackType[];
}

interface tidalAlbumsTracksType extends listType {
  items: tidalAlbumType[];
}

interface tidalPlaylistTracksType extends listType {
  items: tidalTrackType[];
}

const client = axios.create({
  baseURL: 'https://api.tidal.com/v1/',
  timeout: 15000,
  headers: {
    'user-agent': 'TIDAL/3704 CFNetwork/1220.1 Darwin/20.3.0',
    'x-tidal-token': 'i4ZDjcyhed7Mu47q',
  },
  params: {limit: 500, countryCode: 'US'},
});

const queue = new PQueue({concurrency: 25});

/**
 * Get a track by its id
 * @param string} id - track id
 * @example tidal.getTrack('64975224')
 */
export const getTrack = async (id: string): Promise<tidalTrackType> => {
  const {data} = await client.get<tidalTrackType>(`tracks/${id}`);
  return data;
};

/**
 * Convert a tidal track to deezer
 * @param {string} id - track id
 */
export const track2deezer = async (id: string) => {
  const track = await getTrack(id);
  return await isrc2deezer(track.title, track.isrc);
};

/**
 * Get an album by its id
 * @param {string} id - album id
 * @example tidal.getAlbum('80216363')
 */
export const getAlbum = async (id: string): Promise<tidalAlbumType> => {
  const {data} = await client.get<tidalAlbumType>(`albums/${id}`);
  return data;
};

/**
 * Convert a tidal albums to deezer
 * @param {string} id - album id
 */
export const album2deezer = async (id: string) => {
  const album = await getAlbum(id);
  return await upc2deezer(album.title, album.upc);
};

/**
 * Get album tracks by album id
 * @param {string} id - album id
 * @example tidal.getAlbumTracks('80216363')
 */
export const getAlbumTracks = async (id: string): Promise<tidalAlbumsTracksType> => {
  const {data} = await client.get<tidalAlbumsTracksType>(`albums/${id}/tracks`);
  return data;
};

/**
 * Get artist albums by artist id
 * @param {string} id - artist id
 * @example tidal.getArtistAlbums('3575680')
 */
export const getArtistAlbums = async (id: string): Promise<tidalAlbumsTracksType> => {
  const {data} = await client.get<tidalAlbumsTracksType>(`artists/${id}/albums`);
  data.items = data.items.filter((item: any) => item.artist.id.toString() === id);
  return data;
};

/**
 * Get top tracks by artist
 * @param {string} id - artist id
 * @example tidal.getArtistTopTracks('3575680')
 */
export const getArtistTopTracks = async (id: string): Promise<tidalArtistTopTracksType> => {
  const {data} = await client.get<tidalArtistTopTracksType>(`artists/${id}/toptracks`);
  data.items = data.items.filter((item: any) => item.artist.id.toString() === id);
  return data;
};

/**
 * Get a playlist by its uuid
 * @param {string} uuid - playlist uuid
 * @example tidal.getPlaylist('1c5d01ed-4f05-40c4-bd28-0f73099e9648')
 */
export const getPlaylist = async (uuid: string): Promise<tidalPlaylistType> => {
  const {data} = await client.get<tidalPlaylistType>(`playlists/${uuid}`);
  return data;
};

/**
 * Get playlist tracks by playlist uuid
 * @param {string} uuid - playlist uuid
 * @example tidal.getPlaylistTracks('1c5d01ed-4f05-40c4-bd28-0f73099e9648')
 */
export const getPlaylistTracks = async (uuid: string): Promise<tidalPlaylistTracksType> => {
  const {data} = await client.get<tidalPlaylistTracksType>(`playlists/${uuid}/tracks`);
  return data;
};

/**
 * Get valid urls to album art
 * @param {string} uuid - album art uuid (can be found as cover property in album object)
 * @example tidal.albumArtToUrl('9a56f482-e9cf-46c3-bb21-82710e7854d4')
 * @returns {Object}
 */
export const albumArtToUrl = (uuid: string) => {
  const baseUrl = `https://resources.tidal.com/images/${uuid.replace(/-/g, '/')}`;
  return {
    sm: `${baseUrl}/160x160.jpg`,
    md: `${baseUrl}/320x320.jpg`,
    lg: `${baseUrl}/640x640.jpg`,
    xl: `${baseUrl}/1280x1280.jpg`,
  };
};

/**
 * Find tidal artists tracks on deezer
 * @param {string} id - artist id
 * @example tidal.artist2Deezer('3575680')
 */
export const artist2Deezer = async (
  id: string,
  onError?: (item: tidalTrackType, index: number, err: Error) => void,
): Promise<trackType[]> => {
  const {items} = await getArtistTopTracks(id);
  const tracks: trackType[] = [];

  await queue.addAll(
    items.map((item, index) => {
      return async () => {
        try {
          const track = await isrc2deezer(item.title, item.isrc);
          // console.log(signale.success(`Track #${index}: ${item.name}`));
          tracks.push(track);
        } catch (err: any) {
          if (onError) {
            onError(item, index, err);
          }
        }
      };
    }),
  );

  return tracks;
};

/**
 * Find same set of playlist tracks on deezer
 * @param {string} uuid - playlist uuid
 * @example tidal.playlist2Deezer('1c5d01ed-4f05-40c4-bd28-0f73099e9648')
 */
export const playlist2Deezer = async (
  uuid: string,
  onError?: (item: tidalTrackType, index: number, err: Error) => void,
): Promise<[playlistInfo, trackType[]]> => {
  const body = await getPlaylist(uuid);
  const {items} = await getPlaylistTracks(uuid);
  const tracks: trackType[] = [];

  await queue.addAll(
    items.map((item, index) => {
      return async () => {
        try {
          const track = await isrc2deezer(item.title, item.isrc);
          // console.log(signale.success(`Track #${index}: ${item.track.name}`));
          track.TRACK_POSITION = index + 1;
          tracks.push(track);
        } catch (err: any) {
          if (onError) {
            onError(item, index, err);
          }
        }
      };
    }),
  );

  const userId = body.creator.id.toString();
  const playlistInfoData: playlistInfo = {
    PLAYLIST_ID: body.uuid,
    PARENT_USERNAME: userId,
    PARENT_USER_ID: userId,
    PICTURE_TYPE: 'cover',
    PLAYLIST_PICTURE: body.image,
    TITLE: body.title,
    TYPE: '0',
    STATUS: '0',
    USER_ID: userId,
    DATE_ADD: body.created,
    DATE_MOD: body.lastUpdated,
    DATE_CREATE: body.created,
    NB_SONG: body.numberOfTracks,
    NB_FAN: 0,
    CHECKSUM: body.created,
    HAS_ARTIST_LINKED: false,
    IS_SPONSORED: false,
    IS_EDITO: false,
    __TYPE__: 'playlist',
  };

  return [playlistInfoData, tracks];
};
