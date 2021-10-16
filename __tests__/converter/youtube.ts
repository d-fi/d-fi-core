import test from 'ava';
import {youtube} from '../../src';

// The Weeknd - I Feel It Coming ft. Daft Punk (Official Video)
const VALID_VIDEO = 'qFLhGq0060w';

// youtube-dl test video "'/\ä↭𝕐
const INVALID_VIDEO = 'BaW_jenozKc';

if (!process.env.CI) {
  test('GET TRACK INFO', async (t) => {
    const response = await youtube.track2deezer(VALID_VIDEO);

    t.is(response.SNG_ID, '136889434');
    t.is(response.SNG_TITLE, 'I Feel It Coming');
    t.is(response.ALB_TITLE, 'Starboy');
    t.is(response.ISRC, 'USUG11601012');
  });

  test('FAIL INVALID VIDEO', async (t) => {
    try {
      await youtube.track2deezer(INVALID_VIDEO);
      t.fail();
    } catch (err: any) {
      t.true(err.message.includes('No track found for youtube video ' + INVALID_VIDEO));
    }
  });
} else {
  test('SKIP YOUTUBE ON CI', async (t) => {
    t.pass();
  });
}
