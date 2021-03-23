import test from 'ava';
import {parseInfo} from '../../src';

// Tracks
test('PARSE DEEZER TRACK', async (t) => {
  const url = 'https://www.deezer.com/en/track/3135556';
  const response = await parseInfo(url);

  t.deepEqual(response.info, {id: '3135556', type: 'track'});
  t.deepEqual(response.linkinfo, {});
  t.is(response.linktype, 'track');
  t.is(response.tracks.length, 1);
});

test('PARSE SPOTIFY TRACK', async (t) => {
  const url = 'https://open.spotify.com/track/3UmaczJpikHgJFyBTAJVoz?si=50a837f4ed354b16';
  const response = await parseInfo(url);

  t.deepEqual(response.info, {id: '3UmaczJpikHgJFyBTAJVoz', type: 'spotify-track'});
  t.deepEqual(response.linkinfo, {});
  t.is(response.linktype, 'track');
  t.is(response.tracks.length, 1);
});

test('PARSE TIDAL TRACK', async (t) => {
  const url = 'https://tidal.com/browse/track/56681099';
  const response = await parseInfo(url);

  t.deepEqual(response.info, {id: '56681099', type: 'tidal-track'});
  t.deepEqual(response.linkinfo, {});
  t.is(response.linktype, 'track');
  t.is(response.tracks.length, 1);
});

// Albums
test('PARSE DEEZER ALBUM', async (t) => {
  const url = 'https://www.deezer.com/en/album/6575789';
  const response = await parseInfo(url);

  t.deepEqual(response.info, {id: '6575789', type: 'album'});
  t.true(Object.keys(response.linkinfo).includes('ALB_TITLE'));
  t.is(response.linktype, 'album');
  t.is(response.tracks.length, 13);
});

test('PARSE SPOTIFY ALBUM', async (t) => {
  const url = 'https://open.spotify.com/album/6t7956yu5zYf5A829XRiHC';
  const response = await parseInfo(url);

  t.deepEqual(response.info, {id: '6t7956yu5zYf5A829XRiHC', type: 'spotify-album'});
  t.true(Object.keys(response.linkinfo).includes('ALB_TITLE'));
  t.is(response.linktype, 'album');
  t.is(response.tracks.length, 18);
});

test('PARSE TIDAL ALBUM', async (t) => {
  const url = 'https://tidal.com/browse/album/56681092';
  const response = await parseInfo(url);

  t.deepEqual(response.info, {id: '56681092', type: 'tidal-album'});
  t.true(Object.keys(response.linkinfo).includes('ALB_TITLE'));
  t.is(response.linktype, 'album');
  t.is(response.tracks.length, 16);
});

// Playlists
test('PARSE DEEZER PLAYLISTS', async (t) => {
  const url = 'https://www.deezer.com/en/playlist/4523119944';
  const response = await parseInfo(url);

  t.deepEqual(response.info, {id: '4523119944', type: 'playlist'});
  t.true(Object.keys(response.linkinfo).includes('TITLE'));
  t.is(response.linktype, 'playlist');
  t.is(response.tracks.length, 3);
});

if (process.env.CI) {
  test('PARSE SPOTIFY PLAYLISTS', async (t) => {
    const url = 'https://open.spotify.com/playlist/37i9dQZF1DX1clOuib1KtQ';
    const response = await parseInfo(url);

    t.deepEqual(response.info, {id: '37i9dQZF1DX1clOuib1KtQ', type: 'spotify-playlist'});
    t.true(Object.keys(response.linkinfo).includes('TITLE'));
    t.is(response.linktype, 'playlist');
    t.true(response.tracks.length > 50);
  });

  test('PARSE TIDAL PLAYLISTS', async (t) => {
    const url = 'https://tidal.com/browse/playlist/ed004d2b-b494-42be-8506-b1d23cd3bb80';
    const response = await parseInfo(url);

    t.deepEqual(response.info, {id: 'ed004d2b-b494-42be-8506-b1d23cd3bb80', type: 'tidal-playlist'});
    t.true(Object.keys(response.linkinfo).includes('TITLE'));
    t.is(response.linktype, 'playlist');
    t.true(response.tracks.length > 150);
  });
}
