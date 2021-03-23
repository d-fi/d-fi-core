import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import PQueue from 'p-queue';
import {isrc2deezer} from './deezer';
import type {playlistInfo, trackType} from '../types';

// type spotifyTypes = 'track' | 'episode' | 'album' | 'artist' | 'playlist' | 'show';

type tokensType = {
  clientId: string;
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: true;
};

const getOffset = (next: null | string): number => {
  if (next) {
    const o = next.split('&').find((p) => p.includes('offset='));
    return o ? Number(o.split('=')[1]) : 0;
  }

  return 0;
};

const queue = new PQueue({concurrency: 25});

export const spotifyApi = new SpotifyWebApi();

export const spotifyPlaylist2Deezer = async (
  id: string,
  onError?: (item: SpotifyApi.PlaylistTrackObject, index: number, err: Error) => void,
): Promise<[playlistInfo, trackType[]]> => {
  const {body} = await spotifyApi.getPlaylist(id);
  let items = body.tracks.items;
  let offset = getOffset(body.tracks.next);
  let tracks: trackType[] = [];

  while (offset !== 0) {
    const {body} = await spotifyApi.getPlaylistTracks(id, {limit: 100, offset: offset ? offset : 0});
    offset = getOffset(body.next);
    items = [...items, ...body.items];
  }

  await queue.addAll(
    items.map((item, index) => {
      return async () => {
        try {
          if (item.track) {
            const track = await isrc2deezer(item.track.name, item.track.external_ids.isrc);
            // console.log(signale.success(`Track #${index}: ${item.track.name}`));
            track.TRACK_POSITION = index + 1;
            tracks.push(track);
          }
        } catch (err) {
          if (onError) {
            onError(item, index, err);
          }
        }
      };
    }),
  );

  const dateCreated = new Date().toISOString();
  const playlistInfoData: playlistInfo = {
    PLAYLIST_ID: body.id,
    PARENT_USERNAME: body.owner.id,
    PARENT_USER_ID: body.owner.id,
    PICTURE_TYPE: 'cover',
    PLAYLIST_PICTURE: body.images[0].url,
    TITLE: body.name,
    TYPE: '0',
    STATUS: '0',
    USER_ID: body.owner.id,
    DATE_ADD: dateCreated,
    DATE_MOD: dateCreated,
    DATE_CREATE: dateCreated,
    NB_SONG: body.tracks.total,
    NB_FAN: 0,
    CHECKSUM: body.id,
    HAS_ARTIST_LINKED: false,
    IS_SPONSORED: false,
    IS_EDITO: false,
    __TYPE__: 'playlist',
  };

  return [playlistInfoData, tracks];
};

export const spotifyArtist2Deezer = async (
  id: string,
  onError?: (item: SpotifyApi.TrackObjectFull, index: number, err: Error) => void,
): Promise<trackType[]> => {
  // Artist tracks are limited to 10 items
  const {body} = await spotifyApi.getArtistTopTracks(id, 'GB');
  const tracks: trackType[] = [];

  await queue.addAll(
    body.tracks.map((item, index) => {
      return async () => {
        try {
          const track = await isrc2deezer(item.name, item.external_ids.isrc);
          // console.log(signale.success(`Track #${index}: ${item.name}`));
          tracks.push(track);
        } catch (err) {
          if (onError) {
            onError(item, index, err);
          }
        }
      };
    }),
  );

  return tracks;
};

export const setSpotifyAnonymousToken = async () => {
  const {data}: {data: tokensType} = await axios.get(
    'https://open.spotify.com/get_access_token?reason=transport&productType=embed',
  );
  spotifyApi.setAccessToken(data.accessToken);
};
