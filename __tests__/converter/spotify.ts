import test from 'ava';
import {spotify} from '../../src';

const SNG_ID = '7FIWs0pqAYbP91WWM0vlTQ';
const ALB_ID = '6t7956yu5zYf5A829XRiHC';
const PLAYLIST_TITLE = 'This Is Eminem';
const PLAYLIST_ID = '37i9dQZF1DX1clOuib1KtQ';
const ARTIST_ID = '7dGJo4pcD2V6oG8kP0tJRR';

test.serial('SET ANONYMOUS TOKEN', async (t) => {
  const response = await spotify.setSpotifyAnonymousToken();

  t.truthy(response.accessToken, 'string');
  t.true(response.isAnonymous);
});

test('GET TRACK INFO', async (t) => {
  const track = await spotify.track2deezer(SNG_ID);

  t.is(track.SNG_ID, '854914322');
  t.is(track.ISRC, 'USUM72000788');
  t.is(track.MD5_ORIGIN, '6f542518431052368a1c48d14c10d37e');
  t.is(track.__TYPE__, 'song');
});

test('GET ALBUM INFO', async (t) => {
  const [album, tracks] = await spotify.album2deezer(ALB_ID);

  t.is(album.ALB_ID, '125748');
  t.is(album.UPC, '606949062927');
  t.is(album.__TYPE__, 'album');
  t.is(tracks.length, 18);
});

test('GET ARTIST TO DEEZER TRACKS', async (t) => {
  const tracks = await spotify.artist2Deezer(ARTIST_ID);

  t.is(tracks.length, 10);
});

if (process.env.CI) {
  test('GET PLAYLIST TO DEEZER TRACKS', async (t) => {
    const [playlist, tracks] = await spotify.playlist2Deezer(PLAYLIST_ID);

    t.is(playlist.TITLE, PLAYLIST_TITLE);
    t.true(tracks.length > 50);
  });
}
