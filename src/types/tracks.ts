import type {artistType} from './artist';

interface mediaType {
  TYPE: 'preview';
  HREF: string; // 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3';
}

interface lyricsSync {
  lrc_timestamp: string; //'[00:03.58]',
  milliseconds: string; // '3580',
  duration: string; // '8660',
  line: string; // "Hey brother! There's an endless road to rediscover"
}

export interface lyricsType {
  LYRICS_ID?: string; // '2310758',
  LYRICS_SYNC_JSON?: lyricsSync[];
  LYRICS_TEXT: string;
  LYRICS_COPYRIGHTS?: string;
  LYRICS_WRITERS?: string;
}

interface songType {
  ALB_ID: string; // '302127'
  ALB_TITLE: string; // 'Discovery'
  ALB_PICTURE: string; // '2e018122cb56986277102d2041a592c8'
  ARTISTS: artistType[];
  ART_ID: '27';
  ART_NAME: 'Daft Punk';
  ARTIST_IS_DUMMY: boolean; // false
  ART_PICTURE: string; //'f2bc007e9133c946ac3c3907ddc5d2ea'
  DATE_START: string; // '0000-00-00'
  DISK_NUMBER?: string; // '1'
  DURATION: string; // '224'
  EXPLICIT_TRACK_CONTENT: {
    EXPLICIT_LYRICS_STATUS: number; // 0
    EXPLICIT_COVER_STATUS: number; // 0
  };
  ISRC: string; // 'GBDUW0000059'
  LYRICS_ID: number; // 2780622
  LYRICS?: lyricsType;
  EXPLICIT_LYRICS?: string;
  RANK: string; // '787708'
  SMARTRADIO: string; // 0
  SNG_ID: string; // '3135556'
  SNG_TITLE: string; // 'Harder, Better, Faster, Stronger'
  SNG_CONTRIBUTORS: {
    main_artist: string[]; //['Daft Punk']
    author?: string[]; // ['Edwin Birdsong', 'Guy-Manuel de Homem-Christo', 'Thomas Bangalter']
    composer?: string[];
    musicpublisher?: string[];
    producer?: string[];
    publisher: string[];
    engineer?: string[];
    writer?: string[];
    mixer?: string[];
  };
  STATUS: number; // 3
  S_MOD: number; // 0
  S_PREMIUM: number; // 0
  TRACK_NUMBER: number; // '4'
  URL_REWRITING: string; // 'daft-punk'
  VERSION: string; // ''
  MD5_ORIGIN: string; // '51afcde9f56a132096c0496cc95eb24b'
  FILESIZE_AAC_64: '0';
  FILESIZE_MP3_64: string; // '1798059'
  FILESIZE_MP3_128: string; // '3596119'
  FILESIZE_MP3_256: '0';
  FILESIZE_MP3_320: '0';
  FILESIZE_MP4_RA1: '0';
  FILESIZE_MP4_RA2: '0';
  FILESIZE_MP4_RA3: '0';
  FILESIZE_FLAC: '0';
  FILESIZE: string; //'3596119'
  GAIN: string; // '-12.4'
  MEDIA_VERSION: string; // '8'
  TRACK_TOKEN: string; // 'AAAAAWAzlaRgNK7kyEh8dI3tpyObkIpy15hgDXr4GGiFTJakRmh5F7rMVf6-cYTWZNUIq4TLZj6x68mFstAqp9bml_eUzbfFbvIkpmx_hhDRZJhqLsHe-aBRZ9VdHEBr7LYSE3qKpmpTdDp6Odkrw3f-pNQW'
  TRACK_TOKEN_EXPIRE: number; // 1614065380
  MEDIA: [mediaType];
  RIGHTS: {
    STREAM_ADS_AVAILABLE?: boolean;
    STREAM_ADS?: string; // '2000-01-01'
    STREAM_SUB_AVAILABLE?: boolean; // true,
    STREAM_SUB?: string; // '2000-01-01'
  };
  PROVIDER_ID: string; // '3'
  __TYPE__: 'song';
}

export interface trackType extends songType {
  FALLBACK?: songType;
  TRACK_POSITION?: number;
}
