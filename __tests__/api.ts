import {beforeAll, expect, test} from 'bun:test';
import axios from 'axios';
import * as api from '../src';
import {decryptDownload} from '../src/lib/decrypt';
import {downloadAlbumCover} from '../src/metadata-writer/abumCover';
import {getTrackDownloadUrl} from '../src/lib/get-url';
import {initDeezerTestApi} from './helpers';

// Harder, Better, Faster, Stronger by Daft Punk
const SNG_ID = '3135556';

// Discovery by Daft Punk
const ALB_ID = '302127';

beforeAll(async () => {
  await initDeezerTestApi();
});

test.serial('GET USER INFO', async () => {
  // Now get user info
  const response = await api.getUser();

  expect(response.BLOG_NAME).toBeTruthy();
  expect(response.EMAIL).toBeTruthy();
  expect(response.USER_ID).toBeTruthy();
  expect(response.__TYPE__).toBe('user');
});

test('GET TRACK INFO', async () => {
  const response = await api.getTrackInfo(SNG_ID);

  expect(response.SNG_ID).toBe(SNG_ID);
  expect(response.ISRC).toBe('GBDUW0000059');
  expect(response.MD5_ORIGIN).toBe('000790eceb6cb6732d225c0585632b31');
  expect(response.__TYPE__).toBe('song');
});

test('GET TRACK INFO - PUBLIC API', async () => {
  const response = await api.getTrackInfoPublicApi(SNG_ID);

  expect(response.id).toBe(Number(SNG_ID));
  expect(response.isrc).toBe('GBDUW0000059');
  expect(response.type).toBe('track');
});

test('GET TRACK COVER', async () => {
  const track = await api.getTrackInfo(SNG_ID);
  const cover = (await downloadAlbumCover(track, 500)) as Buffer;

  expect(cover).toBeTruthy();
  expect(Buffer.isBuffer(cover)).toBe(true);
  expect(cover.length).toBeGreaterThan(0);
  expect(cover.subarray(0, 3).toString('hex')).toBe('ffd8ff');
});

test('GET TRACK LYRICS', async () => {
  const response = await api.getLyrics(SNG_ID);

  expect(response.LYRICS_ID).toBe('2780622');
  expect(response.LYRICS_TEXT.toLowerCase()).toContain('harder, better');
});

test('GET ALBUM INFO', async () => {
  const response = await api.getAlbumInfo(ALB_ID);

  expect(response.ALB_ID).toBe(ALB_ID);
  expect(response.UPC).toBe('724384960650');
  expect(response.__TYPE__).toBe('album');
});

test('GET ALBUM INFO - PUBLIC API', async () => {
  const response = await api.getAlbumInfoPublicApi(ALB_ID);

  expect(response.id).toBe(Number(ALB_ID));
  expect(response.upc).toBe('724384960650');
  expect(response.type).toBe('album');
});

test('GET ALBUM TRACKS', async () => {
  const response = await api.getAlbumTracks(ALB_ID);

  expect(response.count).toBe(14);
  expect(response.data.length).toBe(response.count);
});

test('GET PLAYLIST INFO', async () => {
  const PLAYLIST_ID = '4523119944';
  const response = await api.getPlaylistInfo(PLAYLIST_ID);

  expect(response.NB_SONG > 0).toBeTruthy();
  expect(response.PARENT_USERNAME).toBe('sayem314');
  expect(response.__TYPE__).toBe('playlist');
});

test('GET PLAYLIST TRACKS', async () => {
  const PLAYLIST_ID = '4523119944';
  const response = await api.getPlaylistTracks(PLAYLIST_ID);

  expect(response.count > 0).toBeTruthy();
  expect(response.data.length).toBe(response.count);
});

test('GET ARTIST INFO', async () => {
  const ART_ID = '13';
  const response = await api.getArtistInfo(ART_ID);

  expect(response.ART_NAME).toBe('Eminem');
  expect(response.__TYPE__).toBe('artist');
});

test('GET ARTIST TRACKS', async () => {
  const ART_ID = '13';
  const response = await api.getDiscography(ART_ID, 10);

  expect(response.count).toBe(10);
  expect(response.data.length).toBe(response.count);
});

test('GET USER PROFILE', async () => {
  const USER_ID = '2064440442';
  const response = await api.getProfile(USER_ID);

  expect(response.USER.BLOG_NAME).toBe('sayem314');
  expect(response.USER.__TYPE__).toBe('user');
});

test('GET TRACK ALTERNATIVE', async () => {
  const ARTIST = 'Eminem';
  const TRACK = 'The Real Slim Shady';
  const response = await api.searchAlternative(ARTIST, TRACK);

  expect(response.QUERY).toBe(`artist:'${ARTIST.toLowerCase()}' track:'${TRACK.toLowerCase()}'`);
  expect(response.TRACK.data.length).toBe(response.TRACK.count);
});

test('SEARCH TRACK, ALBUM & ARTIST', async () => {
  const QUERY = 'Eminem';
  const response = await api.searchMusic(QUERY, ['TRACK', 'ALBUM', 'ARTIST'], 1);

  expect(response.QUERY).toBe(QUERY);
  expect(response.TRACK.count > 0).toBeTruthy();
  expect(response.ALBUM.count > 0).toBeTruthy();
  expect(response.ARTIST.count > 0).toBeTruthy();
});

if (process.env.CI) {
  test('DOWNLOAD TRACK128 & ADD METADATA', async () => {
    const track = await api.getTrackInfo(SNG_ID);
    const trackData = await getTrackDownloadUrl(track, 1);
    if (!trackData) throw new Error('Selected track+quality are unavailable');
    const {data} = await axios.get<Buffer>(trackData.trackUrl, {responseType: 'arraybuffer'});

    expect(data).toBeTruthy();
    expect(Buffer.isBuffer(data)).toBe(true);
    expect(data.length).toBe(3596119);

    const decryptedTrack: Buffer = trackData.isEncrypted ? decryptDownload(data, track.SNG_ID) : data;
    expect(Buffer.isBuffer(decryptedTrack)).toBe(true);
    expect(decryptedTrack.length).toBe(3596119);

    const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, 500);
    expect(Buffer.isBuffer(trackWithMetadata)).toBe(true);
    expect(trackWithMetadata.length).toBe(3629133);
  });

  // test('TRACK128 WITHOUT ALBUM INFO', async () => {
  //   const track = await api.getTrackInfo('912254892');
  //   const trackData = await getTrackDownloadUrl(track, 1);
  //   if (!trackData) throw new Error("Selected track+quality are unavailable");
  //   const {data} = await axios.get(trackData.trackUrl, {responseType: 'arraybuffer'});

  //   expect(data).toBeTruthy();
  //   expect(Buffer.isBuffer(data)).toBe(true);
  //   expect(data.length).toBe(3262170);

  //   const decryptedTrack: Buffer = trackData.isEncrypted ? decryptDownload(data, track.SNG_ID) : data;
  //   expect(Buffer.isBuffer(decryptedTrack)).toBe(true);
  //   expect(decryptedTrack.length).toBe(3262170);

  //   if (!process.env.CI) {
  //     const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, 500);
  //     expect(Buffer.isBuffer(trackWithMetadata)).toBe(true);
  //     expect(trackWithMetadata.length === 3326050).toBe(true);
  //   }
  // });

  test('DOWNLOAD TRACK320 & ADD METADATA', async () => {
    const track = await api.getTrackInfo(SNG_ID);
    const trackData = await getTrackDownloadUrl(track, 3);
    if (!trackData) throw new Error('Selected track+quality are unavailable');
    const {data} = await axios.get<Buffer>(trackData.trackUrl, {responseType: 'arraybuffer'});

    expect(data).toBeTruthy();
    expect(Buffer.isBuffer(data)).toBe(true);
    expect(data.length).toBe(8990301);

    const decryptedTrack: Buffer = trackData.isEncrypted ? decryptDownload(data, track.SNG_ID) : data;
    expect(Buffer.isBuffer(decryptedTrack)).toBe(true);
    expect(decryptedTrack.length).toBe(8990301);

    const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, 500);
    expect(Buffer.isBuffer(trackWithMetadata)).toBe(true);
    expect(trackWithMetadata.length).toBe(9023315);
  });

  test('DOWNLOAD TRACK1411 & ADD METADATA', async () => {
    const track = await api.getTrackInfo(SNG_ID);
    const trackData = await getTrackDownloadUrl(track, 9);
    if (!trackData) throw new Error('Selected track+quality are unavailable');
    const {data} = await axios.get<Buffer>(trackData.trackUrl, {responseType: 'arraybuffer'});

    expect(data).toBeTruthy();
    expect(Buffer.isBuffer(data)).toBe(true);
    expect(data.length).toBe(25418289);

    const decryptedTrack: Buffer = trackData.isEncrypted ? decryptDownload(data, track.SNG_ID) : data;
    expect(Buffer.isBuffer(decryptedTrack)).toBe(true);
    expect(data.length).toBe(25418289);

    const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, 500);
    expect(Buffer.isBuffer(trackWithMetadata)).toBe(true);
    expect(trackWithMetadata.length).toBe(25453343);
  });
}

test('GET SHOW LIST', async () => {
  const show = await api.getShowInfo('338532', 10);
  expect(show.DATA.LABEL_ID).toBe('201952');
  expect(show.EPISODES.count).toBe(10);
  expect(Array.isArray(show.EPISODES.data)).toBe(true);
});

test('GET CHANNEL LIST', async () => {
  const channel = await api.getChannelList();
  expect(channel.count).toBe(channel.data.length);
  expect(Array.isArray(channel.data)).toBe(true);
});

test('GET PLAYLIST CHANNEL', async () => {
  const channel = await api.getPlaylistChannel('channels/dance');
  expect(Object.keys(channel)).toEqual(['version', 'page_id', 'ga', 'title', 'persistent', 'sections', 'expire']);
  expect(channel.title).toBeTruthy();
  expect(Array.isArray(channel.sections)).toBe(true);
});
