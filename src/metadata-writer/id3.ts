// @ts-ignore
import id3Writer from 'browser-id3-writer';
import type {albumTypePublicApi, trackType} from '../types';

export const writeMetadataMp3 = (
  buffer: Buffer,
  track: trackType,
  album: albumTypePublicApi | null,
  cover?: Buffer | null,
): Buffer => {
  const writer = new id3Writer(buffer);
  const RELEASE_DATES = album && album.release_date.split('-');

  writer
    .setFrame('TIT2', track.SNG_TITLE)
    .setFrame('TALB', track.ALB_TITLE)
    .setFrame(
      'TPE1',
      track.ARTISTS.map((a) => a.ART_NAME),
    )
    .setFrame('TLEN', Number(track.DURATION) * 1000)
    .setFrame('TSRC', track.ISRC);

  if (album) {
    if (album.genres.data.length > 0) {
      writer.setFrame(
        'TCON',
        album.genres.data.map((g) => g.name),
      );
    }
    if (RELEASE_DATES) {
      writer.setFrame('TYER', RELEASE_DATES[0]).setFrame('TDAT', RELEASE_DATES[2] + RELEASE_DATES[1]);
    }
    writer
      .setFrame('TPE2', album.artist.name)
      .setFrame('TXXX', {
        description: 'RELEASETYPE',
        value: album.record_type,
      })
      .setFrame('TXXX', {
        description: 'BARCODE',
        value: album.upc,
      })
      .setFrame('TXXX', {
        description: 'LABEL',
        value: album.label,
      })
      .setFrame('TXXX', {
        description: 'COMPILATION',
        value: album.artist.name.match(/various/i) ? '1' : '0',
      });
  }

  writer
    .setFrame('TMED', 'Digital Media')
    .setFrame('TXXX', {
      description: 'SOURCE',
      value: 'Deezer',
    })
    .setFrame('TXXX', {
      description: 'SOURCEID',
      value: track.SNG_ID,
    });

  if (track.DISK_NUMBER) {
    const TRACK_NUMBER = track.TRACK_NUMBER.toLocaleString('en-US', {minimumIntegerDigits: 2});
    writer.setFrame('TPOS', track.DISK_NUMBER).setFrame(
      'TRCK',
      album
        ? `${TRACK_NUMBER}/${album.nb_tracks.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
          })}`
        : TRACK_NUMBER,
    );
  }

  if (track.SNG_CONTRIBUTORS && !Array.isArray(track.SNG_CONTRIBUTORS)) {
    if (track.SNG_CONTRIBUTORS.main_artist) {
      writer.setFrame('TCOP', `${RELEASE_DATES ? RELEASE_DATES[0] + ' ' : ''}${track.SNG_CONTRIBUTORS.main_artist[0]}`);
    }
    if (track.SNG_CONTRIBUTORS.publisher) {
      writer.setFrame('TPUB', track.SNG_CONTRIBUTORS.publisher.join(', '));
    }
    if (track.SNG_CONTRIBUTORS.composer) {
      writer.setFrame('TCOM', track.SNG_CONTRIBUTORS.composer);
    }

    if (track.SNG_CONTRIBUTORS.writer) {
      writer.setFrame('TXXX', {
        description: 'LYRICIST',
        value: track.SNG_CONTRIBUTORS.writer.join(', '),
      });
    }
    if (track.SNG_CONTRIBUTORS.author) {
      writer.setFrame('TXXX', {
        description: 'AUTHOR',
        value: track.SNG_CONTRIBUTORS.author.join(', '),
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
  if (track.EXPLICIT_LYRICS) {
    writer.setFrame('TXXX', {
      description: 'EXPLICIT',
      value: track.EXPLICIT_LYRICS,
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
