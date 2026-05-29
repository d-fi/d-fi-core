import {getLyrics} from '../api';
import type {lyricsType, trackType} from '../types';

export const getTrackLyrics = async (track: trackType): Promise<lyricsType | null> => {
  if (track.LYRICS_ID > 0) {
    try {
      return await getLyrics(track.SNG_ID);
    } catch (err) {
      return null;
    }
  }

  return null;
};
