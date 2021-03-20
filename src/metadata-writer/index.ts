import {downloadAlbumCover} from './abumCover';
import {getTrackLyrics} from './getTrackLyrics';
import {writeMetadataMp3} from './id3';
import {writeMetadataFlac} from './flacmetata';
import {getAlbumInfoPublicApi} from '../api';
import type {trackType} from '../types';

const albumInfo = async (track: trackType) => {
  try {
    return await getAlbumInfoPublicApi(track.ALB_ID);
  } catch (err) {
    return null;
  }
};

/**
 * Add metdata to the mp3
 * @param {Buffer} trackBuffer decrypted track buffer
 * @param {Object} track json containing track infos
 * @param {Number} albumCoverSize album cover size in pixel
 */
export const addTrackTags = async (trackBuffer: Buffer, track: trackType, albumCoverSize = 1000): Promise<Buffer> => {
  const [cover, lyrics, album] = await Promise.all([
    downloadAlbumCover(track, albumCoverSize),
    getTrackLyrics(track),
    albumInfo(track),
  ]);

  if (lyrics) {
    track.LYRICS = lyrics;
  }

  if (track.ART_NAME.toLowerCase() === 'various') {
    track.ART_NAME = 'Various Artists';
  }
  if (album && album.record_type) {
    album.record_type =
      album.record_type === 'ep' ? 'EP' : album.record_type.charAt(0).toUpperCase() + album.record_type.slice(1);
  }

  const isFlac = trackBuffer.slice(0, 4).toString('ascii') === 'fLaC';
  return isFlac
    ? writeMetadataFlac(trackBuffer, track, album, albumCoverSize, cover)
    : writeMetadataMp3(trackBuffer, track, album, cover);
};
