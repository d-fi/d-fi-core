export type tokensType = {
  clientId: string;
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: true;
};

export type spotifyResourceType = 'track' | 'album' | 'artist' | 'playlist';

export type spotifyArtist = {
  id: string;
  name: string;
  type: string;
};

export type spotifyImage = {
  url: string;
  height?: number;
  width?: number;
};

export type spotifyAlbumRef = {
  id: string;
  name: string;
  album_type?: string;
  release_date?: string;
  images: spotifyImage[];
  artists: spotifyArtist[];
  external_ids?: Record<string, string>;
  total_tracks?: number;
  type: string;
  uri: string;
};

export type spotifyTrack = {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  artists: spotifyArtist[];
  album: spotifyAlbumRef;
  external_ids?: Record<string, string>;
  type: string;
  uri: string;
};

export type spotifyOwner = {
  id: string;
  display_name?: string;
  type: string;
};

export type spotifyPlaylist = {
  id: string;
  name: string;
  description?: string;
  public?: boolean;
  collaborative?: boolean;
  images: spotifyImage[];
  owner: spotifyOwner;
  tracks: {
    total: number;
  };
  type: string;
  uri: string;
};

export type spotifyList<T> = {
  items: T[];
  next: string | null;
  total: number;
};

export type spotifyPlaylistTrackItem = {
  track?: spotifyTrack | null;
};
