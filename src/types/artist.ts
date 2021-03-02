interface localesType {
  [key: string]: {
    name: string;
  };
}

export interface artistType {
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

export interface artistInfoTypeMinimal {
  ART_ID: string;
  ART_NAME: string;
  ART_PICTURE: string;
  NB_FAN: number;
  LOCALES: [];
  ARTIST_IS_DUMMY: boolean;
  __TYPE__: 'artist';
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
