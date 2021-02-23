import {downloadAlbumCover} from './abumCover';
import {getTrackLyrics} from './getTrackLyrics';
// @ts-ignore
import {writeMetadataMp3} from './id3';
import {writeMetadataFlac} from './flacmetata';
import type {trackType} from '../types';

/**
 * Add metdata to the mp3
 * @param {Buffer} trackBuffer decrypted track buffer
 * @param {Object} track json containing track infos
 * @param {Number} albumCoverSize album cover size in pixel
 */
export const addTrackTags = async (trackBuffer: Buffer, track: trackType, albumCoverSize = 1000): Promise<Buffer> => {
  const [cover, lyrics] = await Promise.all([downloadAlbumCover(track, albumCoverSize), getTrackLyrics(track)]);

  if (lyrics) {
    track.LYRICS = lyrics;
  }

  const isFlac = trackBuffer.slice(0, 4).toString('ascii') === 'fLaC';
  return isFlac
    ? writeMetadataFlac(trackBuffer, track, albumCoverSize, cover)
    : writeMetadataMp3(trackBuffer, track, cover);
};
