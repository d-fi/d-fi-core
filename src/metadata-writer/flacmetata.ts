import Metaflac from '../lib/metaflac-js';
import type {albumTypePublicApi, trackType} from '../types';

export const writeMetadataFlac = (
  buffer: Buffer,
  track: trackType,
  album: albumTypePublicApi | null,
  dimension: number,
  cover?: Buffer | null,
): Buffer => {
  const flac = new Metaflac(buffer);
  const RELEASE_YEAR = album ? album.release_date.split('-')[0] : null;

  flac.setTag('TITLE=' + track.SNG_TITLE);
  flac.setTag('ALBUM=' + track.ALB_TITLE);
  flac.setTag('ARTIST=' + track.ARTISTS.map((a) => a.ART_NAME).join(', '));
  flac.setTag('TRACKNUMBER=' + track.TRACK_NUMBER.toLocaleString('en-US', {minimumIntegerDigits: 2}));

  if (album) {
    const TOTALTRACKS = album.nb_tracks.toLocaleString('en-US', {minimumIntegerDigits: 2});
    if (album.genres.data.length > 0) {
      for (const genre of album.genres.data) {
        flac.setTag('GENRE=' + genre.name);
      }
    }
    flac.setTag('TRACKTOTAL=' + TOTALTRACKS);
    flac.setTag('TOTALTRACKS=' + TOTALTRACKS);
    flac.setTag('RELEASETYPE=' + album.record_type);
    flac.setTag('ALBUMARTIST=' + album.artist.name);
    flac.setTag('BARCODE=' + album.upc);
    flac.setTag('LABEL=' + album.label);
    flac.setTag('DATE=' + album.release_date);
    flac.setTag('YEAR=' + RELEASE_YEAR);
    flac.setTag(`COMPILATION=${album.artist.name.match(/various/i) ? '1' : '0'}`);
  }

  if (track.DISK_NUMBER) {
    flac.setTag('DISCNUMBER=' + track.DISK_NUMBER);
  }

  flac.setTag('ISRC=' + track.ISRC);
  flac.setTag('LENGTH=' + track.DURATION);
  flac.setTag('MEDIA=Digital Media');

  if (track.LYRICS) {
    flac.setTag('LYRICS=' + track.LYRICS.LYRICS_TEXT);
  }
  if (track.EXPLICIT_LYRICS) {
    flac.setTag('EXPLICIT=' + track.EXPLICIT_LYRICS);
  }

  if (track.SNG_CONTRIBUTORS && !Array.isArray(track.SNG_CONTRIBUTORS)) {
    if (track.SNG_CONTRIBUTORS.main_artist) {
      flac.setTag(`COPYRIGHT=${RELEASE_YEAR ? RELEASE_YEAR + ' ' : ''}${track.SNG_CONTRIBUTORS.main_artist[0]}`);
    }
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
