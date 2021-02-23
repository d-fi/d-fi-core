import axios from 'axios';
import {parse} from 'node-html-parser';
import {randomUseragent} from './useragents';

const baseUrl = 'https://musixmatch.com';

const getUrlMusixmatch = async (query: string) => {
  const {data} = await axios.get(`${baseUrl}/search/${encodeURI(query)}/tracks`, {
    headers: {
      'User-Agent': randomUseragent(),
      referer: 'https://l.facebook.com/',
    },
  });

  // @ts-ignore
  const url = parse(data).querySelector('h2').childNodes[0].attributes.href.replace('/add', '');
  if (url.includes('/lyrics/')) {
    return url.startsWith('/lyrics/') ? baseUrl + url : url;
  }

  throw new Error('No song found!');
};

export const getLyricsMusixmatch = async (query: string): Promise<string> => {
  const url = await getUrlMusixmatch(query);
  const {data} = await axios.get(url, {
    headers: {
      'User-Agent': randomUseragent(),
      referer: baseUrl + '/',
    },
  });

  let lyrics = data.match(/("body":".*","language")/)[0];
  lyrics = lyrics.replace('"body":"', '').replace('","language"', '');

  return lyrics.split('\\n').join('\n');
};
