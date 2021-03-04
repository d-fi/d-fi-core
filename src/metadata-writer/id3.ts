// @ts-ignore
import id3Writer from 'browser-id3-writer';
import type {trackType} from '../types';

export const writeMetadataMp3 = (buffer: Buffer, track: trackType, cover?: Buffer | null): Buffer => {
  const writer = new id3Writer(buffer);
  writer.setFrame('TIT2', track.SNG_TITLE).setFrame('TALB', track.ALB_TITLE);

  const artists = track.ART_NAME.split(
    new RegExp(' featuring | feat. | Ft. | ft. | vs | vs. | x | - |, ', 'g'),
  ).map((a) => a.trim());
  writer.setFrame('TPE2', artists).setFrame('TPE1', [artists.join(', ')]);

  writer
    .setFrame('TMED', 'Digital Media')
    .setFrame('TXXX', {
      description: 'Artists',
      value: artists.join(', '),
    })
    .setFrame('TXXX', {
      description: 'ISRC',
      value: track.ISRC,
    })
    .setFrame('TXXX', {
      description: 'SOURCE',
      value: 'Deezer',
    })
    .setFrame('TXXX', {
      description: 'SOURCEID',
      value: track.SNG_ID,
    });

  if (track.DISK_NUMBER) {
    writer.setFrame('TPOS', track.DISK_NUMBER).setFrame('TXXX', {
      description: 'DISCNUMBER',
      value: track.DISK_NUMBER,
    });
  }

  writer.setFrame('TXXX', {
    description: 'LENGTH',
    value: track.DURATION,
  });

  if (track.SNG_CONTRIBUTORS) {
    if (track.SNG_CONTRIBUTORS.composer) {
      writer.setFrame('TXXX', {
        description: 'COMPOSER',
        value: track.SNG_CONTRIBUTORS.composer.join(', '),
      });
    }
    if (track.SNG_CONTRIBUTORS.writer) {
      writer.setFrame('TXXX', {
        description: 'LYRICIST',
        value: track.SNG_CONTRIBUTORS.writer.join(', '),
      });
    }
    if (track.SNG_CONTRIBUTORS.mixer) {
      writer.setFrame('TXXX', {
        description: 'MIXARTIST',
        value: track.SNG_CONTRIBUTORS.mixer.join(', '),
      });
    }
    if (track.SNG_CONTRIBUTORS.producer && track.SNG_CONTRIBUTORS.engineer) {
      writer.setFrame('TXXX', {
        description: 'INVOLVEDPEOPLE',
        value: track.SNG_CONTRIBUTORS.producer.concat(track.SNG_CONTRIBUTORS.engineer).join(', '),
      });
    }
  }

  if (track.LYRICS) {
    writer.setFrame('USLT', {
      description: '',
      lyrics: track.LYRICS.LYRICS_TEXT,
    });
  }

  if (cover) {
    writer.setFrame('APIC', {
      type: 3,
      data: cover,
      description: '',
    });
  }

  writer.addTag();
  return Buffer.from(writer.arrayBuffer);
};
