import test from 'ava';
import * as api from '../../src';

// Harder, Better, Faster, Stronger by Daft Punk
const SNG_TITLE = 'Harder, Better, Faster, Stronger';
const ISRC = 'GBDUW0000059';

// Discovery by Daft Punk
const ALB_TITLE = 'Discovery';
const UPC = '724384960650';

test.serial('GET TRACK ISRC', async (t) => {
  const response = await api.isrc2deezer(SNG_TITLE, ISRC);

  t.is(response.SNG_TITLE, SNG_TITLE);
  t.is(response.ISRC, ISRC);
  t.is(response.MD5_ORIGIN, '51afcde9f56a132096c0496cc95eb24b');
  t.is(response.__TYPE__, 'song');
});

test.serial('GET ALBUM UPC', async (t) => {
  const [album, tracks] = await api.upc2deezer(ALB_TITLE, UPC);

  t.is(album.ALB_TITLE, ALB_TITLE);
  t.is(album.UPC, UPC);
  t.is(album.__TYPE__, 'album');

  t.is(Number(album.NUMBER_TRACK), tracks.length);
});
