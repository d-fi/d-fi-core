import axios from './lib/request';
import FastLRU from './lib/fast-lru';
import type {
  albumType,
  trackType,
  lyricsType,
  albumTracksType,
  playlistInfo,
  playlistTracksType,
  artistInfoType,
  discographyType,
  profileType,
  searchType,
  trackTypePublicApi,
  albumTypePublicApi,
} from './types';

// expire cache in 60 minutes
const lru = new FastLRU({
  maxSize: 1000,
  ttl: 60 * 60000,
});

/**
 * Make post requests to deezer api
 * @param {Object} body post body
 * @param {String} method request method
 */
export const request = async (body: object, method: string) => {
  const cacheKey = method + ':' + Object.entries(body).join(':');
  const cache = lru.get(cacheKey);
  if (cache) {
    return cache;
  }

  const {
    data: {error, results},
  } = await axios.post('/gateway.php', body, {params: {method}});

  if (Object.keys(results).length > 0) {
    lru.set(cacheKey, results);
    return results;
  }

  const errorMessage = Object.entries(error).join(', ');
  throw new Error(errorMessage);
};

/**
 * Make post requests to deezer public api
 * @param {Object} body post body
 * @param {String} method request method
 */
export const requestPublicApi = async (slug: string) => {
  const cache = lru.get(slug);
  if (cache) {
    return cache;
  }

  const {data} = await axios.get('https://api.deezer.com' + slug);

  if (data.error) {
    const errorMessage = Object.entries(data.error).join(', ');
    throw new Error(errorMessage);
  }

  lru.set(slug, data);
  return data;
};

/**
 * @param {String} sng_id song id
 */
export const getTrackInfoPublicApi = (sng_id: string): Promise<trackTypePublicApi> =>
  requestPublicApi('/track/' + sng_id);

/**
 * @param {String} alb_id album id
 */
export const getAlbumInfoPublicApi = (alb_id: string): Promise<albumTypePublicApi> =>
  requestPublicApi('/album/' + alb_id);

/**
 * @param {String} sng_id song id
 */
export const getTrackInfo = (sng_id: string): Promise<trackType> => request({sng_id}, 'song.getData');

/**
 * @param {String} sng_id song id
 */
export const getLyrics = (sng_id: string): Promise<lyricsType> => request({sng_id}, 'song.getLyrics');

/**
 * @param {String} alb_id album id
 */
export const getAlbumInfo = (alb_id: string): Promise<albumType> => request({alb_id}, 'album.getData');

/**
 * @param {String} alb_id user id
 */
export const getAlbumTracks = async (alb_id: string): Promise<albumTracksType> =>
  request({alb_id, lang: 'us', nb: -1}, 'song.getListByAlbum');

/**
 * @param {String} playlist_id playlist id
 */
export const getPlaylistInfo = (playlist_id: string): Promise<playlistInfo> =>
  request({playlist_id, lang: 'en'}, 'playlist.getData');

/**
 * @param {String} playlist_id playlist id
 */
export const getPlaylistTracks = async (playlist_id: string): Promise<playlistTracksType> => {
  const playlistTracks: playlistTracksType = await request(
    {playlist_id, lang: 'en', nb: -1, start: 0, tab: 0, tags: true, header: true},
    'playlist.getSongs',
  );
  playlistTracks.data = playlistTracks.data.map((track, index) => {
    track.TRACK_POSITION = index + 1;
    return track;
  });
  return playlistTracks;
};

/**
 * @param {String} art_id artist id
 */
export const getArtistInfo = (art_id: string): Promise<artistInfoType> =>
  request({art_id, filter_role_id: [0], lang: 'en', tab: 0, nb: -1, start: 0}, 'artist.getData');

/**
 * @param {String} art_id artist id
 * @param {String} nb number of total song to fetch
 */
export const getDiscography = (art_id: string, nb = 500): Promise<discographyType> =>
  request({art_id, filter_role_id: [0], lang: 'en', nb, nb_songs: -1, start: 0}, 'album.getDiscography');

/**
 * @param {String} user_id user id
 */
export const getProfile = (user_id: string): Promise<profileType> =>
  request({user_id, tab: 'loved', nb: -1}, 'mobile.pageUser');

/**
 * @param {String} artist artist name
 * @param {String} song song name
 */
export const searchAlternative = (artist: string, song: string): Promise<searchType> =>
  request(
    {
      query: `artist:'${artist}' track:'${song}'`,
      types: ['TRACK'],
      nb: 10,
    },
    'mobile_suggest',
  );

type searchTypesProp = 'ALBUM' | 'ARTIST' | 'TRACK' | 'PLAYLIST' | 'RADIO' | 'SHOW' | 'USER' | 'LIVESTREAM' | 'CHANNEL';
/**
 * @param {String} query search query
 * @param {Array} types search types
 * @param {String} nb number of items to fetch
 */
export const searchMusic = (query: string, types: searchTypesProp[] = ['TRACK'], nb = 15): Promise<searchType> =>
  request({query, nb, types}, 'mobile_suggest');
