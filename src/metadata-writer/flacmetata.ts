// @ts-ignore
import Metaflac from '../lib/metaflac-js';
import type {trackType} from '../types';

export const writeMetadataFlac = (
  buffer: Buffer,
  track: trackType,
  dimension: number,
  cover?: Buffer | null,
): Buffer => {
  const flac = new Metaflac(buffer);
  flac.setTag('TITLE=' + track.SNG_TITLE);
  flac.setTag('ALBUM=' + track.ALB_TITLE);

  const artists = track.ART_NAME.split(
    new RegExp(' featuring | feat. | Ft. | ft. | vs | vs. | x | - |, ', 'g'),
  ).map((a) => a.trim());
  flac.setTag('ARTIST=' + artists.join(', '));

  if (track.DISK_NUMBER) {
    flac.setTag('DISCNUMBER=' + track.DISK_NUMBER);
  }

  flac.setTag('LENGTH=' + track.DURATION);
  flac.setTag('ISRC=' + track.ISRC);
  flac.setTag('MEDIA=Digital Media');

  if (track.LYRICS) {
    flac.setTag('LYRICS=' + track.LYRICS.LYRICS_TEXT);
  }

  if (track.SNG_CONTRIBUTORS) {
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
