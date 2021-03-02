import type {trackType} from './tracks';

export interface playlistInfo {
  PLAYLIST_ID: string; // '4523119944'
  DESCRIPTION?: string; // ''
  PARENT_USERNAME: string; // 'sayem314'
  PARENT_USER_PICTURE?: string; // ''
  PARENT_USER_ID: string; // '2064440442'
  PICTURE_TYPE: string; // 'cover'
  PLAYLIST_PICTURE: string; // 'e206dafb59a3d378d7ffacc989bc4e35'
  TITLE: string; // 'wtf playlist '
  TYPE: string; // '0'
  STATUS: string; // 0
  USER_ID: string; // '2064440442'
  DATE_ADD: string; // '2018-09-08 19:13:57'
  DATE_MOD: string; //'2018-09-08 19:14:11'
  DATE_CREATE: string; // '2018-05-31 00:01:05'
  NB_SONG: number; // 3
  NB_FAN: number; // 0
  CHECKSUM: string; // 'c185d123834444e3c8869e235dd6f0a6'
  HAS_ARTIST_LINKED: boolean;
  IS_SPONSORED: boolean;
  IS_EDITO: boolean;
  __TYPE__: 'playlist';
}

export interface playlistTracksType {
  data: trackType[];
  count: number;
  total: number;
  filtered_count: number;
  filtered_items?: number[];
  next?: number;
}
