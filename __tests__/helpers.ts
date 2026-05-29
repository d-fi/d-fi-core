import {initDeezerApi} from '../src';

export const initDeezerTestApi = async (): Promise<void> => {
  if (process.env.HIFI_ARL) {
    await initDeezerApi(process.env.HIFI_ARL);
  }
};
