import type {albumType, albumTypeMinimal} from './album';
import type {artistInfoTypeMinimal, artistType} from './artist';
import type {playlistInfo, playlistInfoMinimal} from './playlist';
import type {trackType} from './tracks';
import type {channelSearchType} from './channel';

interface searchTypeCommon {
  count: number;
  total: number;
  filtered_count: number;
  filtered_items: number[];
  next: number;
}

interface albumSearchType extends searchTypeCommon {
  data: albumTypeMinimal[];
}

interface artistSearchType extends searchTypeCommon {
  data: artistInfoTypeMinimal[];
}

interface playlistSearchType extends searchTypeCommon {
  data: playlistInfoMinimal[];
}

interface trackSearchType extends searchTypeCommon {
  data: trackType[];
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
  ARTIST: artistSearchType;
  TRACK: trackSearchType;
  PLAYLIST: playlistSearchType;
  RADIO: trackSearchType;
  SHOW: trackSearchType;
  USER: trackSearchType;
  LIVESTREAM: trackSearchType;
  CHANNEL: channelSearchType;
}
