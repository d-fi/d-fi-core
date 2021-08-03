import axios from 'axios';
import {getSongFileName} from '../lib/decrypt';
import instance from '../lib/request';
import type {trackType} from '../types';

interface userData {
  license_token: string;
  can_stream_lossless: boolean;
  can_stream_hq: boolean;
}

class WrongLicense extends Error {
  constructor(format: string) {
    super();
    this.name = 'WrongLicense';
    this.message = `Your account can't stream ${format} tracks`;
  }
}

let user_data: userData | null = null;

const dzAuthenticate = async (): Promise<userData> => {
  const {data} = await instance.get('https://www.deezer.com/ajax/gw-light.php', {
    params: {
      method: 'deezer.getUserData',
      api_version: '1.0',
      api_token: 'null',
    },
  });
  user_data = {
    license_token: data.results.USER.OPTIONS.license_token,
    can_stream_lossless: data.results.USER.OPTIONS.web_lossless || data.results.USER.OPTIONS.mobile_loseless,
    can_stream_hq: data.results.USER.OPTIONS.web_hq || data.results.USER.OPTIONS.mobile_hq,
  };
  return user_data;
};

const getTrackUrlFromServer = async (track_token: string, format: string): Promise<string | null> => {
  const user = user_data ? user_data : await dzAuthenticate();
  if ((format === 'FLAC' && !user.can_stream_lossless) || (format === 'MP3_320' && !user.can_stream_hq)) {
    throw new WrongLicense(format);
  }

  const {data} = await instance.post('https://media.deezer.com/v1/get_url', {
    license_token: user.license_token,
    media: [
      {
        type: 'FULL',
        formats: [{format, cipher: 'BF_CBC_STRIPE'}],
      },
    ],
    track_tokens: [track_token],
  });

  if (data.data.length > 0) {
    if (data.data[0].errors) {
      throw new Error(Object.entries(data.data[0].errors[0]).join(', '));
    }
    return data.data[0].media.length > 0 ? data.data[0].media[0].sources[0].url : null;
  }
  return null;
};

/**
 * @param track Track info json returned from `getTrackInfo`
 * @param quality 1 = 128kbps, 3 = 320kbps and 9 = flac (around 1411kbps)
 */
export const getTrackDownloadUrl = async (track: trackType, quality: number): Promise<{trackUrl: string, isEncrypted: boolean, fileSize: number}> => {
  let formatName: string;
  switch (quality) {
    case 9:
      formatName = 'FLAC';
      break;
    case 3:
      formatName = 'MP3_320';
      break;
    case 1:
      formatName = 'MP3_128';
      break;
    default:
      throw new Error(`Unknown quality ${quality}`);
  }

  // Get URL with the official API
  try {
    const url = await getTrackUrlFromServer(track.TRACK_TOKEN, formatName);
    if (url) {
      const fileSize = await testUrl(url);
      if (fileSize > 0) {
        return {
          trackUrl: url,
          isEncrypted: url.includes('/mobile/') || url.includes('/media/'),
          fileSize: fileSize,
        };
      }
    }
  } catch (err) {
    if (err instanceof WrongLicense) {
      throw new Error(`Your account can't stream ${formatName} tracks`);
    } else {
      throw err;
    }
  }

  // Fallback to the old method
  const filename = getSongFileName(track, quality); // encrypted file name
  const url = `https://e-cdns-proxy-${track.MD5_ORIGIN[0]}.dzcdn.net/mobile/1/${filename}`;
  const fileSize = await testUrl(url);
  if (fileSize > 0) {
    return {
      trackUrl: url,
      isEncrypted: url.includes('/mobile/') || url.includes('/media/'),
      fileSize: fileSize,
    };
  }
  throw new Error(`Forbidden to access ${url}`);
};

const testUrl = async (url: string): Promise<number> => {
  try {
    let response = await axios.head(url);
    return Number(response.headers['content-length']);
  } catch (err) {
    return 0;
  }
};
