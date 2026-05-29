import {beforeAll, expect, test} from 'bun:test';
import {parseInfo} from '../../src';
import {initDeezerTestApi} from '../helpers';

beforeAll(async () => {
  await initDeezerTestApi();
});

// Tracks
test('PARSE DEEZER TRACK', async () => {
  const url = 'https://www.deezer.com/en/track/3135556';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '3135556', type: 'track'});
  expect(response.linkinfo).toEqual({});
  expect(response.linktype).toBe('track');
  expect(response.tracks.length).toBe(1);
});

test('PARSE SPOTIFY TRACK', async () => {
  const url = 'https://open.spotify.com/track/3UmaczJpikHgJFyBTAJVoz?si=50a837f4ed354b16';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '3UmaczJpikHgJFyBTAJVoz', type: 'spotify-track'});
  expect(response.linkinfo).toEqual({});
  expect(response.linktype).toBe('track');
  expect(response.tracks.length).toBe(1);
});

test('PARSE TIDAL TRACK', async () => {
  const url = 'https://tidal.com/browse/track/56681099';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '56681099', type: 'tidal-track'});
  expect(response.linkinfo).toEqual({});
  expect(response.linktype).toBe('track');
  expect(response.tracks.length).toBe(1);
});

// Albums
test('PARSE DEEZER ALBUM', async () => {
  const url = 'https://www.deezer.com/en/album/6575789';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '6575789', type: 'album'});
  expect(Object.keys(response.linkinfo).includes('ALB_TITLE')).toBe(true);
  expect(response.linktype).toBe('album');
  expect(response.tracks.length).toBe(13);
});

test('PARSE SPOTIFY ALBUM', async () => {
  const url = 'https://open.spotify.com/album/6t7956yu5zYf5A829XRiHC';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '6t7956yu5zYf5A829XRiHC', type: 'spotify-album'});
  expect(Object.keys(response.linkinfo).includes('ALB_TITLE')).toBe(true);
  expect(response.linktype).toBe('album');
  expect(response.tracks.length).toBe(18);
});

test('PARSE TIDAL ALBUM', async () => {
  const url = 'https://tidal.com/browse/album/56681092';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '56681092', type: 'tidal-album'});
  expect(Object.keys(response.linkinfo).includes('ALB_TITLE')).toBe(true);
  expect(response.linktype).toBe('album');
  expect(response.tracks.length).toBe(16);
});

// Playlists
test('PARSE DEEZER PLAYLISTS', async () => {
  const url = 'https://www.deezer.com/en/playlist/4523119944';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '4523119944', type: 'playlist'});
  expect(Object.keys(response.linkinfo).includes('TITLE')).toBe(true);
  expect(response.linktype).toBe('playlist');
  expect(response.tracks.length).toBe(3);
});

if (process.env.CI) {
  test('PARSE SPOTIFY PLAYLISTS', async () => {
    const url = 'https://open.spotify.com/playlist/37i9dQZF1DX1clOuib1KtQ';
    const response = await parseInfo(url);

    expect(response.info).toEqual({id: '37i9dQZF1DX1clOuib1KtQ', type: 'spotify-playlist'});
    expect(Object.keys(response.linkinfo).includes('TITLE')).toBe(true);
    expect(response.linktype).toBe('playlist');
    expect(response.tracks.length > 50).toBe(true);
  });

  test('PARSE TIDAL PLAYLISTS', async () => {
    const url = 'https://tidal.com/playlist/c289197b-72cd-43df-b039-66b24a595879';
    const response = await parseInfo(url);

    expect(response.info).toEqual({id: 'c289197b-72cd-43df-b039-66b24a595879', type: 'tidal-playlist'});
    expect(Object.keys(response.linkinfo).includes('TITLE')).toBe(true);
    expect(response.linktype).toBe('playlist');
    expect(response.tracks.length > 0).toBe(true);
  });
}

// Artists
test('PARSE DEEZER ARTIST', async () => {
  const url = 'https://www.deezer.com/us/artist/13';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '13', type: 'artist'});
  expect(response.linktype).toBe('artist');
  expect(response.tracks.length > 400).toBe(true);
});

test('PARSE SPOTIFY ARTIST', async () => {
  const url = 'https://open.spotify.com/artist/5WUlDfRSoLAfcVSX1WnrxN?si=6c99fb147fe848ee';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '5WUlDfRSoLAfcVSX1WnrxN', type: 'spotify-artist'});
  expect(response.linktype).toBe('artist');
  expect(response.tracks.length > 5).toBe(true);
});

test('PARSE TIDAL ARTIST', async () => {
  const url = 'https://tidal.com/browse/artist/3529376';
  const response = await parseInfo(url);

  expect(response.info).toEqual({id: '3529376', type: 'tidal-artist'});
  expect(response.linktype).toBe('artist');
  expect(response.tracks.length > 5).toBe(true);
});

if (!process.env.CI) {
  test('PARSE YOUTUBE TRACK', async () => {
    const url = 'https://www.youtube.com/watch?v=4NRXx6U8ABQ';
    const response = await parseInfo(url);

    expect(response.info).toEqual({id: '4NRXx6U8ABQ', type: 'youtube-track'});
    expect(response.linkinfo).toEqual({});
    expect(response.linktype).toBe('track');
    expect(response.tracks.length).toBe(1);
  });
}

// Fail Tests
test('SHOULD FAIL STRING', async () => {
  const str = 'hello there';
  try {
    await parseInfo(str);
    expect.unreachable();
  } catch (err: any) {
    expect(err.message).toBe('Unknown URL: ' + str);
  }
});

test('SHOULD FAIL URL', async () => {
  const url = 'https://example.com/browse/track/56681099';
  try {
    await parseInfo(url);
    expect.unreachable();
  } catch (err: any) {
    expect(err.message).toBe('Unknown URL: ' + url);
  }
});
