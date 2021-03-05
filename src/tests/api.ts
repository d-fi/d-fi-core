import test from 'ava';
import axios from 'axios';
import * as api from '../';
import {decryptDownload, getTrackDownloadUrl} from '../lib/decrypt';
import {downloadAlbumCover} from '../metadata-writer/abumCover';
import {getLyricsMusixmatch} from '../metadata-writer/musixmatchLyrics';

// Harder, Better, Faster, Stronger by Daft Punk
const SNG_ID = '3135556';

// Discovery by Daft Punk
const ALB_ID = '302127';

test.serial('GET TRACK INFO', async (t) => {
  const response = await api.getTrackInfo(SNG_ID);

  t.is(response.SNG_ID, SNG_ID);
  t.is(response.ISRC, 'GBDUW0000059');
  t.is(response.MD5_ORIGIN, '51afcde9f56a132096c0496cc95eb24b');
  t.is(response.__TYPE__, 'song');
});

test('GET TRACK INFO - PUBLIC API', async (t) => {
  const response = await api.getTrackInfoPublicApi(SNG_ID);

  t.is(response.id, Number(SNG_ID));
  t.is(response.isrc, 'GBDUW0000059');
  t.is(response.type, 'track');
});

test('GET TRACK COVER', async (t) => {
  const track = await api.getTrackInfo(SNG_ID);
  const cover = await downloadAlbumCover(track, 500);

  t.truthy(cover);
  t.true(Buffer.isBuffer(cover));
  t.is(cover ? cover.length : 0, 24646);
});

test('GET TRACK LYRICS', async (t) => {
  const response = await api.getLyrics(SNG_ID);

  t.is(response.LYRICS_ID, '2780622');
  t.is(response.LYRICS_TEXT.length, 1719);
});

test('GET MUSIXMATCH LYRICS', async (t) => {
  const track = await api.getTrackInfo(SNG_ID);
  const lyrics = await getLyricsMusixmatch(`${track.ART_NAME} - ${track.SNG_TITLE}`);

  t.truthy(lyrics);
  t.true(lyrics.length > 7000);
  t.true(lyrics.length < 8000);
});

test('GET ALBUM INFO', async (t) => {
  const response = await api.getAlbumInfo(ALB_ID);

  t.is(response.ALB_ID, ALB_ID);
  t.is(response.UPC, '724384960650');
  t.is(response.__TYPE__, 'album');
});

test('GET ALBUM TRACKS', async (t) => {
  const response = await api.getAlbumTracks(ALB_ID);

  t.is(response.count, 14);
  t.is(response.data.length, response.count);
});

test('GET PLAYLIST INFO', async (t) => {
  const PLAYLIST_ID = '4523119944';
  const response = await api.getPlaylistInfo(PLAYLIST_ID);

  t.truthy(response.NB_SONG > 0);
  t.is(response.PARENT_USERNAME, 'sayem314');
  t.is(response.__TYPE__, 'playlist');
});

test('GET PLAYLIST TRACKS', async (t) => {
  const PLAYLIST_ID = '4523119944';
  const response = await api.getPlaylistTracks(PLAYLIST_ID);

  t.truthy(response.count > 0);
  t.is(response.data.length, response.count);
});

test('GET ARTIST INFO', async (t) => {
  const ART_ID = '13';
  const response = await api.getArtistInfo(ART_ID);

  t.is(response.ART_NAME, 'Eminem');
  t.is(response.__TYPE__, 'artist');
});

test('GET ARTIST TRACKS', async (t) => {
  const ART_ID = '13';
  const response = await api.getDiscography(ART_ID, 10);

  t.is(response.count, 10);
  t.is(response.data.length, response.count);
});

test('GET USER PROFILE', async (t) => {
  const USER_ID = '2064440442';
  const response = await api.getProfile(USER_ID);

  t.is(response.USER.BLOG_NAME, 'sayem314');
  t.is(response.USER.__TYPE__, 'user');
});

test('GET TRACK ALTERNATIVE', async (t) => {
  const ARTIST = 'Eminem';
  const TRACK = 'The Real Slim Shady';
  const response = await api.searchAlternative(ARTIST, TRACK);

  t.is(response.QUERY, `artist:'${ARTIST.toLowerCase()}' track:'${TRACK.toLowerCase()}'`);
  t.is(response.TRACK.data.length, response.TRACK.count);
});

test('SEARCH TRACK, ALBUM & ARTIST', async (t) => {
  const QUERY = 'Eminem';
  const response = await api.searchMusic(QUERY, ['TRACK', 'ALBUM', 'ARTIST'], 1);

  t.is(response.QUERY, QUERY.toLowerCase());
  t.truthy(response.TRACK.count > 0);
  t.truthy(response.ALBUM.count > 0);
  t.truthy(response.ARTIST.count > 0);
});

if (process.env.CI) {
  test('DOWNLOAD TRACK128 & ADD METADATA', async (t) => {
    const track = await api.getTrackInfo(SNG_ID);
    const url = getTrackDownloadUrl(track, 1);
    const {data} = await axios.get(url, {responseType: 'arraybuffer'});

    t.truthy(data);
    t.true(Buffer.isBuffer(data));
    t.is(data.length, 3596119);

    const decryptedTrack = decryptDownload(data, track.SNG_ID);
    t.true(Buffer.isBuffer(decryptedTrack));
    t.is(decryptedTrack.length, 3596119);

    const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, 500);
    t.true(Buffer.isBuffer(trackWithMetadata));
    t.is(trackWithMetadata.length, 3628837);
  });

  test('DOWNLOAD TRACK320 & ADD METADATA', async (t) => {
    const track = await api.getTrackInfo(SNG_ID);
    const url = getTrackDownloadUrl(track, 3);
    const {data} = await axios.get(url, {responseType: 'arraybuffer'});

    t.truthy(data);
    t.true(Buffer.isBuffer(data));
    t.is(data.length, 8990301);

    const decryptedTrack = decryptDownload(data, track.SNG_ID);
    t.true(Buffer.isBuffer(decryptedTrack));
    t.is(decryptedTrack.length, 8990301);

    const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, 500);
    t.true(Buffer.isBuffer(trackWithMetadata));
    t.is(trackWithMetadata.length, 9023019);
  });

  test('DOWNLOAD TRACK1411 & ADD METADATA', async (t) => {
    const track = await api.getTrackInfo(SNG_ID);
    const url = getTrackDownloadUrl(track, 9);
    const {data} = await axios.get(url, {responseType: 'arraybuffer'});

    t.truthy(data);
    t.true(Buffer.isBuffer(data));
    t.is(data.length, 25418289);

    const decryptedTrack = decryptDownload(data, track.SNG_ID);
    t.true(Buffer.isBuffer(decryptedTrack));
    t.is(data.length, 25418289);

    const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, 500);
    t.true(Buffer.isBuffer(trackWithMetadata));
    t.is(trackWithMetadata.length, 25453167);
  });
}
