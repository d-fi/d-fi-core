import {getLyricsMusixmatch} from './musixmatchLyrics';
import {getLyrics} from '../api';
import type {lyricsType, trackType} from '../types';

const getTrackLyricsWeb = async (track: trackType): Promise<lyricsType | null> => {
  try {
    const LYRICS_TEXT = await getLyricsMusixmatch(`${track.ART_NAME} - ${track.SNG_TITLE}`);
    return {LYRICS_TEXT};
  } catch (err) {
    return null;
  }
};

export const getTrackLyrics = async (track: trackType): Promise<lyricsType | null> => {
  if (track.LYRICS_ID > 0) {
    try {
      return await getLyrics(track.SNG_ID);
    } catch (err) {
      return await getTrackLyricsWeb(track);
    }
  }

  return await getTrackLyricsWeb(track);
};
