import axios from 'axios';
import FastLRU from '../lib/fast-lru';
import type {trackType} from '../types';

type coverSize = 56 | 250 | 500 | 1000 | 1500 | 1800 | number;

// expire cache in 30 minutes
const lru = new FastLRU({
  maxSize: 50,
  ttl: 30 * 60000,
});

/**
 *
 * @param {Object} track track info json from deezer api
 * @param {Number} albumCoverSize in pixel, between 56-1800
 */
export const downloadAlbumCover = async (track: trackType, albumCoverSize: coverSize): Promise<Buffer | null> => {
  if (!track.ALB_PICTURE) {
    return null;
  }

  const cache = lru.get(track.ALB_PICTURE + albumCoverSize);
  if (cache) {
    return cache;
  }

  try {
    const url = `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/${albumCoverSize}x${albumCoverSize}-000000-80-0-0.jpg`;
    const {data} = await axios.get<any>(url, {responseType: 'arraybuffer'});
    lru.set(track.ALB_PICTURE + albumCoverSize, data);
    return data;
  } catch (err) {
    return null;
  }
};
