import type {artistType} from './artist';
import type {trackType} from './tracks';

export interface albumTypeMinimal {
  ALB_ID: string;
  ALB_TITLE: string;
  ALB_PICTURE: string;
  ARTISTS: artistType[];
  AVAILABLE: boolean;
  VERSION: string; // ''
  ART_ID: string;
  ART_NAME: string;
  EXPLICIT_ALBUM_CONTENT: {
    EXPLICIT_LYRICS_STATUS: number; // 1
    EXPLICIT_COVER_STATUS: number; //2
  };
  PHYSICAL_RELEASE_DATE: string;
  TYPE: string; // '0'
  ARTIST_IS_DUMMY: boolean;
  NUMBER_TRACK: number; // '1';
  __TYPE__: 'album';
}

export interface albumType {
  ALB_CONTRIBUTORS: {
    main_artist: string[]; // ['Avicii']
  };
  ALB_ID: string; // '9188269'
  ALB_PICTURE: string; // '6e58a99f59a150e9b4aefbeb2d6fc856'
  EXPLICIT_ALBUM_CONTENT: {
    EXPLICIT_LYRICS_STATUS: number; // 0
    EXPLICIT_COVER_STATUS: number; // 0
  };
  ALB_TITLE: string; // 'The Days / Nights'
  ARTISTS: artistType[];
  ART_ID: string; // '293585'
  ART_NAME: string; // 'Avicii'
  ARTIST_IS_DUMMY: boolean;
  DIGITAL_RELEASE_DATE: string; //'2014-12-01'
  EXPLICIT_LYRICS?: string; // '0'
  NB_FAN: number; // 36285
  NUMBER_DISK: string; // '1'
  NUMBER_TRACK: string; // '4'
  PHYSICAL_RELEASE_DATE?: string; // '2014-01-01'
  PRODUCER_LINE: string; // '℗ 2014 Avicii Music AB'
  PROVIDER_ID: string; // '427'
  RANK: string; // '601128'
  RANK_ART: string; // '861905'
  STATUS: string; // '1'
  TYPE: string; // '1'
  UPC: string; // '602547151544'
  __TYPE__: 'album';
}

export interface albumTracksType {
  data: trackType[];
  count: number;
  total: number;
  filtered_count: number;
  filtered_items?: number[];
  next?: number;
}
