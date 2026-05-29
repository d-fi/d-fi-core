import {beforeAll, expect, test} from 'bun:test';
import * as api from '../../src';
import {initDeezerTestApi} from '../helpers';

// Harder, Better, Faster, Stronger by Daft Punk
const SNG_TITLE = 'Harder, Better, Faster, Stronger';
const ISRC = 'GBDUW0000059';

// Discovery by Daft Punk
const ALB_TITLE = 'Discovery';
const UPC = '724384960650';

beforeAll(async () => {
  await initDeezerTestApi();
});

test.serial('GET TRACK ISRC', async () => {
  const response = await api.isrc2deezer(SNG_TITLE, ISRC);

  expect(response.SNG_TITLE).toBe(SNG_TITLE);
  expect(response.ISRC).toBe(ISRC);
  expect(response.MD5_ORIGIN).toBe('51afcde9f56a132096c0496cc95eb24b');
  expect(response.__TYPE__).toBe('song');
});

test.serial('GET ALBUM UPC', async () => {
  const [album, tracks] = await api.upc2deezer(ALB_TITLE, UPC);

  expect(album.ALB_TITLE).toBe(ALB_TITLE);
  expect(album.UPC).toBe(UPC);
  expect(album.__TYPE__).toBe('album');

  expect(Number(album.NUMBER_TRACK)).toBe(tracks.length);
});
