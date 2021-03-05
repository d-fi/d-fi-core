import type {artistType} from './artist';
import type {trackType, contributorsPublicApi} from './tracks';

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

interface trackDataPublicApi {
  id: number; // 3135556
  readable: boolean;
  title: string; // 'Harder, Better, Faster, Stronger'
  title_short: string; // 'Harder, Better, Faster, Stronger'
  title_version?: string; // ''
  link: 'https://www.deezer.com/track/3135556';
  duration: number; // 224
  rank: number; // 956167
  explicit_lyrics: boolean;
  explicit_content_lyrics: number; // 0
  explicit_content_cover: number; // 0
  preview: string; // 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3'
  md5_image: string; // '2e018122cb56986277102d2041a592c8'
  artist: {
    id: number; // 27
    name: number; // 'Daft Punk'
    tracklist: string; // 'https://api.deezer.com/artist/27/top?limit=50'
    type: 'artist';
  };
  type: 'track';
}

interface genreTypePublicApi {
  id: number; // 113
  name: string; // 'Dance'
  picture: string; // 'https://api.deezer.com/genre/113/image'
  type: 'genre';
}

export interface albumTypePublicApi {
  id: number; // 302127'
  title: 'Discovery';
  upc: string; // '724384960650'
  link: string; // 'https://www.deezer.com/album/302127'
  share: string; // 'https://www.deezer.com/album/302127?utm_source=deezer&utm_content=album-302127&utm_term=0_1614940071&utm_medium=web'
  cover: string; // 'https://api.deezer.com/album/302127/image'
  cover_small: string; // 'https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg'
  cover_medium: string; // 'https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/250x250-000000-80-0-0.jpg'
  cover_big: string; // 'https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/500x500-000000-80-0-0.jpg'
  cover_xl: string; // 'https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/1000x1000-000000-80-0-0.jpg'
  md5_image: string; // '2e018122cb56986277102d2041a592c8'
  genre_id: number; // 113;
  genres: {
    data: genreTypePublicApi[];
  };
  label: string; // 'Parlophone (France)'
  nb_tracks: number; // 14;
  duration: number; // 3660;
  fans: number; // 229369
  rating: number; // 0
  release_date: string; // '2001-03-07'
  record_type: string; // 'album'
  available: boolean;
  tracklist: string; // 'https://api.deezer.com/album/302127/tracks'
  explicit_lyrics: boolean;
  explicit_content_lyrics: number; // 7
  explicit_content_cover: number; // 0
  contributors: contributorsPublicApi[];
  artist: contributorsPublicApi;
  type: 'album';
  tracks: {
    data: trackDataPublicApi[];
  };
}
