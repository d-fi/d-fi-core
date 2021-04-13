import axios from '../lib/request';
import {request, requestPublicApi} from './request';
import type {
  albumType,
  trackType,
  lyricsType,
  albumTracksType,
  playlistInfo,
  playlistTracksType,
  playlistChannelType,
  channelSearchType,
  artistInfoType,
  discographyType,
  profileType,
  searchType,
  trackTypePublicApi,
  albumTypePublicApi,
  userType,
} from '../types';

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
 * @param {String} nb number of items to fetch
 */
export const searchAlternative = (artist: string, song: string, nb = 10): Promise<searchType> =>
  request(
    {
      query: `artist:'${artist}' track:'${song}'`,
      types: ['TRACK'],
      nb,
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

/**
 * Get details about current user
 */
export const getUser = async (): Promise<userType> => {
  const {
    data: {error, results},
  } = await axios.get('/gateway.php', {params: {method: 'user_getInfo'}});

  if (Object.keys(results).length > 0) {
    return results;
  }

  const errorMessage = Object.entries(error).join(', ');
  throw new Error(errorMessage);
};

/**
 * Get list of channles
 */
export const getChannelList = async (): Promise<channelSearchType> => request({}, 'search_getChannels');

/**
 * Get details about a playlist channel
 * Return homepage if name is undefined
 */
export const getPlaylistChannel = async (name?: string): Promise<playlistChannelType> => {
  const gateway_input = {
    page: name ? 'channels/' + name : 'home',
    version: '2.3',
    support: {
      'long-card-horizontal-grid': ['album', 'playlist', 'radio', 'show', 'livestream'],
      ads: [],
      message: ['conversion', 'informative', 'call_onboarding'],
      highlight: ['generic', 'album', 'artist', 'playlist', 'radio', 'livestream', 'app'],
      'deeplink-list': ['generic', 'deeplink'],
      grid: [
        'generic',
        'album',
        'artist',
        'playlist',
        'radio',
        'channel',
        'show',
        'livestream',
        'page',
        'smarttracklist',
        'flow',
        'video-link',
      ],
      slideshow: [
        'album',
        'artist',
        'playlist',
        'radio',
        'show',
        'livestream',
        'channel',
        'video-link',
        'external-link',
      ],
      'large-card': [
        'generic',
        'album',
        'artist',
        'playlist',
        'radio',
        'show',
        'livestream',
        'external-link',
        'video-link',
      ],
      'item-highlight': ['radio', 'app'],
      'small-horizontal-grid': ['album', 'artist', 'playlist', 'radio', 'channel', 'show', 'livestream'],
      'grid-preview-two': [
        'generic',
        'album',
        'artist',
        'playlist',
        'radio',
        'channel',
        'show',
        'livestream',
        'page',
        'smarttracklist',
        'flow',
        'video-link',
      ],
      list: ['generic', 'album', 'artist', 'playlist', 'radio', 'show', 'video-link', 'channel', 'episode'],
      'grid-preview-one': [
        'generic',
        'album',
        'artist',
        'playlist',
        'radio',
        'channel',
        'show',
        'livestream',
        'page',
        'smarttracklist',
        'flow',
        'video-link',
      ],
      'horizontal-grid': [
        'generic',
        'album',
        'artist',
        'playlist',
        'radio',
        'channel',
        'show',
        'livestream',
        'video-link',
        'smarttracklist',
        'flow',
      ],
    },
    lang: 'en',
    timezone_offset: '6',
  };
  const {
    data: {error, results},
  } = await axios.get('/gateway.php', {params: {method: 'app_page_get', gateway_input}});

  if (Object.keys(results).length > 0) {
    return results;
  }

  const errorMessage = Object.entries(error).join(', ');
  throw new Error(errorMessage);
};
