import {beforeAll, expect, test} from 'bun:test';
import {tidal} from '../../src';
import {initDeezerTestApi} from '../helpers';

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
const PLAYLIST_TITLE = 'Top 50 - Global';
const PLAYLIST_ID = 'c289197b-72cd-43df-b039-66b24a595879';

beforeAll(async () => {
  await initDeezerTestApi();
});

test('GET TRACK INFO', async () => {
  const response = await tidal.getTrack(SNG_ID);

  expect(response.id.toString()).toBe(SNG_ID);
  expect(response.title).toBe(SNG_TITLE);
  expect(response.isrc).toBe(ISRC);
});

test('GET TRACK --> DEEZER', async () => {
  const track = await tidal.track2deezer(SNG_ID);

  expect(track.SNG_ID).toBe('118190298');
  expect(track.ISRC).toBe(ISRC);
  expect(track.MD5_ORIGIN).toBe('28045ff090360486d41c4a1cc5929a96');
  expect(track.__TYPE__).toBe('song');
});

test('GET ALBUM INFO', async () => {
  const response = await tidal.getAlbum(ALB_ID);

  expect(response.id.toString()).toBe(ALB_ID);
  expect(response.title).toBe(ALB_TITLE);
  expect(response.upc).toBe(UPC);
});

test('GET ALBUM --> DEEZER', async () => {
  const [album, tracks] = await tidal.album2deezer(ALB_ID);

  expect(album.ALB_ID).toBe('12279688');
  expect(album.UPC).toBe(UPC.slice(2));
  expect(album.__TYPE__).toBe('album');
  expect(tracks.length).toBe(16);
});

test('GET ALBUM TRACKS', async () => {
  const response = await tidal.getAlbumTracks(ALB_ID);

  expect(response.items.length).toBe(response.totalNumberOfItems);
  expect(response.totalNumberOfItems).toBe(16);
});

test('GET ARTIST ALBUMS', async () => {
  const response = await tidal.getArtistAlbums(ART_ID);

  expect(response.totalNumberOfItems >= response.items.length).toBe(true);
  expect(response.totalNumberOfItems > 30).toBe(true);
});

test('GET ARTIST TOP TRACKS', async () => {
  const response = await tidal.getArtistAlbums(ART_ID);

  expect(response.totalNumberOfItems >= response.items.length).toBe(true);
  expect(response.totalNumberOfItems > 30).toBe(true);
});

test('GET PLAYLIST INFO', async () => {
  const response = await tidal.getPlaylist(PLAYLIST_ID);

  expect(response.title).toBe(PLAYLIST_TITLE);
  expect(response.type).toBe('USER');
});

test('GET PLAYLIST TRACKS', async () => {
  const response = await tidal.getPlaylistTracks(PLAYLIST_ID);

  expect(response.items.length).toBe(response.totalNumberOfItems);
  expect(response.items.length > 0).toBe(true);
});

if (process.env.CI) {
  test('GET ARTISTS TO DEEZER TRACKS', async () => {
    const response = await tidal.artist2Deezer(ART_ID);

    expect(response.length > 250).toBe(true);
  });

  test('GET PLAYLIST TO DEEZER TRACKS', async () => {
    const response = await tidal.getPlaylistTracks(PLAYLIST_ID);

    expect(response.items.length).toBe(response.totalNumberOfItems);
    expect(response.totalNumberOfItems > 0).toBe(true);
  });
}
