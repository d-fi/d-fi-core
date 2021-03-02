import type {albumTracksType, albumType, albumTypeMinimal} from './album';
import type {artistType} from './artist';
import type {playlistInfo} from './playlist';
import type {trackType} from './tracks';

interface albumSearchType {
  data: albumTypeMinimal[];
  count: number;
  total: number;
  filtered_count: number;
  filtered_items: number[];
  next: number;
}

export interface discographyType {
  data: albumType[];
  count: number; // 109,
  total: number; // 109,
  cache_version: number; // 2,
  filtered_count: number; // 0,
  art_id: number; // 1424821,
  start: number; // 0,
  nb: number; // 500
}

export interface searchType {
  QUERY: string; //;
  FUZZINNESS: boolean;
  AUTOCORRECT: boolean;
  TOP_RESULT: [albumType | artistType | trackType | playlistInfo | artistType | unknown] | [];
  ORDER: [
    'TOP_RESULT',
    'TRACK',
    'PLAYLIST',
    'ALBUM',
    'ARTIST',
    'LIVESTREAM',
    'EPISODE',
    'SHOW',
    'CHANNEL',
    'RADIO',
    'USER',
    'LYRICS',
  ];
  ALBUM: albumSearchType;
  ARTIST: albumTracksType;
  TRACK: albumTracksType;
  PLAYLIST: albumTracksType;
  RADIO: albumTracksType;
  SHOW: albumTracksType;
  USER: albumTracksType;
  LIVESTREAM: albumTracksType;
  CHANNEL: albumTracksType;
}