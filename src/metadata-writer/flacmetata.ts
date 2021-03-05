// @ts-ignore
import Metaflac from '../lib/metaflac-js';
import type {albumTypePublicApi, trackType} from '../types';

export const writeMetadataFlac = (
  buffer: Buffer,
  track: trackType,
  album: albumTypePublicApi,
  dimension: number,
  cover?: Buffer | null,
): Buffer => {
  const flac = new Metaflac(buffer);
  const RELEASE_YEAR = album.release_date.split('-')[0];

  const artists = track.ART_NAME.split(
    new RegExp(' featuring | feat. | Ft. | ft. | vs | vs. | x | - |, ', 'g'),
  ).map((a) => a.trim());

  flac.setTag('TITLE=' + track.SNG_TITLE);
  flac.setTag('ALBUM=' + track.ALB_TITLE);
  flac.setTag('GENRE=' + album.genres.data[0].name);
  flac.setTag('RELEASETYPE=' + album.record_type);
  flac.setTag('ARTIST=' + artists.join(', '));
  flac.setTag('ALBUMARTIST=' + album.artist.name);
  flac.setTag('TRACKNUMBER=' + track.TRACK_NUMBER);

  if (track.DISK_NUMBER) {
    flac.setTag('DISCNUMBER=' + track.DISK_NUMBER);
  }

  flac.setTag('ISRC=' + track.ISRC);
  flac.setTag('BARCODE=' + album.upc);
  flac.setTag('LABEL=' + album.label);
  flac.setTag('LENGTH=' + track.DURATION);
  flac.setTag('MEDIA=Digital Media');
  flac.setTag('TRACKNUMBER=' + track.TRACK_NUMBER);
  flac.setTag('YEAR=' + RELEASE_YEAR);
  flac.setTag('DATE=' + album.release_date);

  if (track.LYRICS) {
    flac.setTag('LYRICS=' + track.LYRICS.LYRICS_TEXT);
  }
  if (track.EXPLICIT_LYRICS) {
    flac.setTag('EXPLICIT=' + track.EXPLICIT_LYRICS);
  }

  if (track.SNG_CONTRIBUTORS) {
    flac.setTag(`COPYRIGHT=${RELEASE_YEAR} ${track.SNG_CONTRIBUTORS.main_artist[0]}`);
    if (track.SNG_CONTRIBUTORS.publisher) {
      flac.setTag('ORGANIZATION=' + track.SNG_CONTRIBUTORS.publisher.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.composer) {
      flac.setTag('COMPOSER=' + track.SNG_CONTRIBUTORS.composer.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.publisher) {
      flac.setTag('ORGANIZATION=' + track.SNG_CONTRIBUTORS.publisher.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.producer) {
      flac.setTag('PRODUCER=' + track.SNG_CONTRIBUTORS.producer.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.engineer) {
      flac.setTag('ENGINEER=' + track.SNG_CONTRIBUTORS.engineer.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.writer) {
      flac.setTag('WRITER=' + track.SNG_CONTRIBUTORS.writer.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.author) {
      flac.setTag('AUTHOR=' + track.SNG_CONTRIBUTORS.author.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.mixer) {
      flac.setTag('MIXER=' + track.SNG_CONTRIBUTORS.mixer.join(', '));
    }
  }

  if (cover) {
    flac.importPicture(cover, dimension, 'image/jpeg');
  }

  flac.setTag('SOURCE=Deezer');
  flac.setTag('SOURCEID=' + track.SNG_ID);

  return flac.getBuffer();
};
