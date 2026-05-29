import {beforeAll, expect, test} from 'bun:test';
import {spotify} from '../../src';
import {initDeezerTestApi} from '../helpers';

const SNG_ID = '7FIWs0pqAYbP91WWM0vlTQ';
const ALB_ID = '6t7956yu5zYf5A829XRiHC';
const PLAYLIST_TITLE = 'Top 50 - Global';
const PLAYLIST_ID = '37i9dQZEVXbMDoHDwVN2tF';
const ARTIST_ID = '7dGJo4pcD2V6oG8kP0tJRR';

beforeAll(async () => {
  await initDeezerTestApi();
});

test.serial('SET ANONYMOUS TOKEN', async () => {
  const response = await spotify.setSpotifyAnonymousToken();

  expect(response.accessToken).toBeTruthy();
  expect(response.isAnonymous).toBe(true);
});

test('GET TRACK INFO', async () => {
  const track = await spotify.track2deezer(SNG_ID);

  expect(track.SNG_ID).toBe('854914322');
  expect(track.ISRC).toBe('USUM72000788');
  expect(track.MD5_ORIGIN).toBe('6f542518431052368a1c48d14c10d37e');
  expect(track.__TYPE__).toBe('song');
});

test('GET ALBUM INFO', async () => {
  const [album, tracks] = await spotify.album2deezer(ALB_ID);

  expect(album.ALB_ID).toBe('125748');
  expect(album.UPC).toBe('606949062927');
  expect(album.__TYPE__).toBe('album');
  expect(tracks.length).toBe(18);
});

test('GET ARTIST TO DEEZER TRACKS', async () => {
  const tracks = await spotify.artist2Deezer(ARTIST_ID);

  expect(tracks.length).toBe(10);
});

if (process.env.CI) {
  test('GET PLAYLIST TO DEEZER TRACKS', async () => {
    const [playlist, tracks] = await spotify.playlist2Deezer(PLAYLIST_ID);

    expect(playlist.TITLE).toBe(PLAYLIST_TITLE);
    expect(tracks.length > 0).toBe(true);
  });
}
