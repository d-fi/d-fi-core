interface localesType {
  [key: string]: {
    name: string;
  };
}

interface artistType {
  ART_ID: string; // '27'
  ROLE_ID: string; // '0'
  ARTISTS_SONGS_ORDER: string; // '0'
  ART_NAME: string; // 'Daft Punk'
  ARTIST_IS_DUMMY: boolean; // false
  ART_PICTURE: string; // 'f2bc007e9133c946ac3c3907ddc5d2ea'
  RANK: string; // '836071'
  LOCALES?: localesType;
  __TYPE__: 'artist';
}

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
  data: songType[];
  count: number;
  total: number;
  filtered_count: number;
  filtered_items?: number[];
  next?: number;
}

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

export interface playlistTracksType extends albumTracksType {
  checksum: string;
}

export interface artistInfoType {
  ART_ID: string; // "293585",
  ART_NAME: string; // "Avicii",
  ARTIST_IS_DUMMY: boolean;
  ART_PICTURE: string; // "82e214b0cb39316f4a12a082fded54f6",
  FACEBOOK?: string; // "https://www.facebook.com/avicii?fref=ts",
  NB_FAN: number; // 7140516,
  TWITTER?: string; // "https://twitter.com/Avicii",
  __TYPE__: 'artist';
}

export interface discographyType extends albumTracksType {
  cache_version: number; // 2,
  art_id: number; // 293585,
  start: number; // 0,
  nb: number; // 2
}

export interface profileType {
  IS_FOLLOW: boolean;
  NB_ARTISTS: number;
  NB_FOLLOWERS: number;
  NB_FOLLOWINGS: number;
  NB_MP3S: number;
  TOP_TRACK: albumTracksType;
  USER: {
    USER_ID: string; // '2064440442'
    BLOG_NAME: string; // 'sayem314'
    SEX?: string; // ''
    COUNTRY: string; // 'BD'
    USER_PICTURE?: string; // ''
    COUNTRY_NAME: string; // 'Bangladesh'
    PRIVATE: boolean;
    DISPLAY_NAME: string; // 'sayem314'
    __TYPE__: 'user';
  };
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
  ALBUM: albumTracksType;
  ARTIST: albumTracksType;
  TRACK: albumTracksType;
  PLAYLIST: albumTracksType;
  RADIO: albumTracksType;
  SHOW: albumTracksType;
  USER: albumTracksType;
  LIVESTREAM: albumTracksType;
  CHANNEL: albumTracksType;
}
