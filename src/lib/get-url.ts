import axios from 'axios';
import {getSongFileName} from '../lib/decrypt';
import instance from '../lib/request';
import type {trackType} from '../types'

interface userData {
  license_token: string,
  can_stream_lossless: boolean,
  can_stream_hq: boolean,
}

class WrongLicense extends Error {
  constructor(format: string) {
    super()
    this.name = "WrongLicense"
    this.message = `Your account can't stream ${format} tracks`
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
  }
  return user_data;
};

const getTrackUrlFromServer = async (track_token: string, format: string): Promise<string | null> => {
  const user = user_data ? user_data : await dzAuthenticate();
  if (
    format === "FLAC" && !user.can_stream_lossless ||
    format === "MP3_320" && !user.can_stream_hq
  ) throw new WrongLicense(format);

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

  if (data.data.length) {
    if (data.data[0].errors) {
      throw new Error(`Deezer error: ${JSON.stringify(data)}`)
    }
    return data.data[0].media.length > 0 ? data.data[0].media[0].sources[0].url : null;
  }
  return null;
};

/**
 * @param track Track info json returned from `getTrackInfo`
 * @param quality 1 = 128kbps, 3 = 320kbps and 9 = flac (around 1411kbps)
 */
export const getTrackDownloadUrl = async (track: trackType, quality: number): Promise<string | null> => {
  let url: string | null = null;
  let wrongLicense;
  let formatName;
  if (quality === 9) {
    formatName = 'FLAC';
  } else if (quality === 3) {
    formatName = 'MP3_320';
  } else {
    formatName = 'MP3_128';
  }

  // Get URL with the official API
  try {
    url = await getTrackUrlFromServer(track.TRACK_TOKEN, formatName)
    if (url) {
      let isUrlOk = await testUrl(url)
      if (isUrlOk) return url;
    }
    url = null;
  } catch (e) {
    if (e instanceof WrongLicense) {
      wrongLicense = true;
    } else {
      throw e;
    }
    url = null;
  }
  // Fallback to the old method
  if (!url) {
    const cdn = track.MD5_ORIGIN[0]; // cdn destination
    const filename = getSongFileName(track, quality); // encrypted file name
    url = `https://e-cdns-proxy-${cdn}.dzcdn.net/mobile/1/${filename}`;
    let isUrlOk = await testUrl(url)
    if (isUrlOk) return url
    url = null
  }
  if (wrongLicense) throw new Error(`Your account can't stream ${formatName} tracks`);
  return url
}

const testUrl = async (url: string): Promise<boolean> => {
  try {
    let response = await axios.head(url);
    if (Number(response.headers["content-length"]) > 0) return true;
    return false;
  } catch (e) {
    return false;
  }
}
