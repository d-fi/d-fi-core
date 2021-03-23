import test from 'ava';
import {spotify} from '../../src';

const PLAYLIST_TITLE = 'This Is Eminem';
const PLAYLIST_ID = '37i9dQZF1DX1clOuib1KtQ';
const ARTIST_ID = '7dGJo4pcD2V6oG8kP0tJRR';

test.serial('SET ANONYMOUS TOKEN', async (t) => {
  const response = await spotify.setSpotifyAnonymousToken();

  t.truthy(response.accessToken, 'string');
  t.true(response.isAnonymous);
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
