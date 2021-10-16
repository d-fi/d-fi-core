import axios from 'axios';
import delay from 'delay';

let user_arl =
  '7b76232e393c63abd3ba151c6e3f2e3d0a3bd272b268f0482c8f6c2ebcc170984c13800745a53d3e27baa88bc3922ef22c5342e4e1ea1353a00d9156930a4bf462884d53215289420031507d65295aab971e75d1611c77d13df34b5e491fb2be';

const instance = axios.create({
  baseURL: 'https://api.deezer.com/1.0',
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json; charset=UTF-8',
    'User-Agent': 'Deezer/8.32.0.2 (iOS; 14.4; Mobile; en; iPhone10_5)',
  },
  params: {
    version: '8.32.0',
    api_key: 'ZAIVAHCEISOHWAICUQUEXAEPICENGUAFAEZAIPHAELEEVAHPHUCUFONGUAPASUAY',
    output: 3,
    input: 3,
    buildId: 'ios12_universal',
    screenHeight: '480',
    screenWidth: '320',
    lang: 'en',
  },
});

export const initDeezerApi = async (arl: string): Promise<string> => {
  if (arl.length !== 192) {
    throw new Error(`Invalid arl. Length should be 192 characters. You have provided ${arl.length} characters.`);
  }
  user_arl = arl;
  const {data} = await instance.get<any>('https://www.deezer.com/ajax/gw-light.php', {
    params: {method: 'deezer.ping', api_version: '1.0', api_token: ''},
    headers: {cookie: 'arl=' + arl},
  });
  instance.defaults.params.sid = data.results.SESSION;
  return data.results.SESSION;
};

// Add a request interceptor
instance.interceptors.response.use(async (response: Record<string, any>) => {
  if (response.data.error && Object.keys(response.data.error).length > 0) {
    if (response.data.error.NEED_API_AUTH_REQUIRED) {
      await initDeezerApi(user_arl);
      return await instance(response.config);
    } else if (response.data.error.code === 4) {
      await delay.range(1000, 1500);
      return await instance(response.config);
    }
  }

  return response;
});

export default instance;
