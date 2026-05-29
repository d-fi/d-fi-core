import {beforeAll, expect, test} from 'bun:test';
import {youtube} from '../../src';
import {initDeezerTestApi} from '../helpers';

// The Weeknd - I Feel It Coming ft. Daft Punk (Official Video)
const VALID_VIDEO = 'qFLhGq0060w';

// youtube-dl test video "'/\ä↭𝕐
const INVALID_VIDEO = 'BaW_jenozKc';
const isCi = Boolean(process.env.CI);

beforeAll(async () => {
  await initDeezerTestApi();
});

test.skipIf(isCi)('GET TRACK INFO', async () => {
  const response = await youtube.track2deezer(VALID_VIDEO);

  expect(response.SNG_ID).toBe('136889434');
  expect(response.SNG_TITLE).toBe('I Feel It Coming');
  expect(response.ALB_TITLE).toBe('Starboy');
  expect(response.ISRC).toBe('USUG11601012');
});

test.skipIf(isCi)('FAIL INVALID VIDEO', async () => {
  try {
    await youtube.track2deezer(INVALID_VIDEO);
    expect.unreachable();
  } catch (err: any) {
    expect(err.message.includes('No track found for youtube video ' + INVALID_VIDEO)).toBe(true);
  }
});
