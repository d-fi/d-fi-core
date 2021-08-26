import test from 'ava';
import {tidal} from '../../src';

// Work (feat. Drake)
const SNG_TITLE = 'Work';
const SNG_ID = '56681096';
const ISRC = 'QM5FT1600116';

// ANTI (Deluxe) (feat. SZA)
const ALB_TITLE = 'ANTI (Deluxe)';
const ALB_ID = '56681092';
const UPC = '00851365006554';

// Rihanna
const ART_ID = '10665';

// Playlists
const PLAYLIST_TITLE = 'Albums';
const PLAYLIST_ID = 'ed004d2b-b494-42be-8506-b1d23cd3bb80';

test('GET TRACK INFO', async (t) => {
  const response = await tidal.getTrack(SNG_ID);

  t.is(response.id.toString(), SNG_ID);
  t.is(response.title, SNG_TITLE);
  t.is(response.isrc, ISRC);
});

test('GET TRACK --> DEEZER', async (t) => {
  const track = await tidal.track2deezer(SNG_ID);

  t.is(track.SNG_ID, '118190298');
  t.is(track.ISRC, ISRC);
  t.is(track.MD5_ORIGIN, '28045ff090360486d41c4a1cc5929a96');
  t.is(track.__TYPE__, 'song');
});

test('GET ALBUM INFO', async (t) => {
  const response = await tidal.getAlbum(ALB_ID);

  t.is(response.id.toString(), ALB_ID);
  t.is(response.title, ALB_TITLE);
  t.is(response.upc, UPC);
});

test('GET ALBUM --> DEEZER', async (t) => {
  const [album, tracks] = await tidal.album2deezer(ALB_ID);

  t.is(album.ALB_ID, '12279688');
  t.is(album.UPC, UPC.slice(2));
  t.is(album.__TYPE__, 'album');
  t.is(tracks.length, 16);
});

test('GET ALBUM TRACKS', async (t) => {
  const response = await tidal.getAlbumTracks(ALB_ID);

  t.is(response.items.length, response.totalNumberOfItems);
  t.is(response.totalNumberOfItems, 16);
});

test('GET ARTIST ALBUMS', async (t) => {
  const response = await tidal.getArtistAlbums(ART_ID);

  t.true(response.totalNumberOfItems >= response.items.length);
  t.true(response.totalNumberOfItems > 30);
});

test('GET ARTIST TOP TRACKS', async (t) => {
  const response = await tidal.getArtistAlbums(ART_ID);

  t.true(response.totalNumberOfItems >= response.items.length);
  t.true(response.totalNumberOfItems > 30);
});

test('GET PLAYLIST INFO', async (t) => {
  const response = await tidal.getPlaylist(PLAYLIST_ID);

  t.is(response.title, PLAYLIST_TITLE);
  t.is(response.type, 'USER');
});

test('GET PLAYLIST TRACKS', async (t) => {
  const response = await tidal.getPlaylistTracks(PLAYLIST_ID);

  t.is(response.items.length, response.totalNumberOfItems);
  t.true(response.items.length > 50);
});

if (process.env.CI) {
  test('GET ARTISTS TO DEEZER TRACKS', async (t) => {
    const response = await tidal.artist2Deezer(ART_ID);

    t.true(response.length > 250);
  });

  test('GET PLAYLIST TO DEEZER TRACKS', async (t) => {
    const response = await tidal.getPlaylistTracks(PLAYLIST_ID);

    t.is(response.items.length, response.totalNumberOfItems);
    t.true(response.totalNumberOfItems > 150);
  });
}
