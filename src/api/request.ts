import axios from '../lib/request';
import lru from './cache';

/**
 * Make post requests to deezer api
 * @param {Object} body post body
 * @param {String} method request method
 */
export const request = async (body: object, method: string) => {
  const cacheKey = method + ':' + Object.entries(body).join(':');
  const cache = lru.get(cacheKey);
  if (cache) {
    return cache;
  }

  const {
    data: {error, results},
  } = await axios.post('/gateway.php', body, {params: {method}});

  if (Object.keys(results).length > 0) {
    lru.set(cacheKey, results);
    return results;
  }

  const errorMessage = Object.entries(error).join(', ');
  throw new Error(errorMessage);
};

/**
 * Make post requests to deezer public api
 * @param {Object} body post body
 * @param {String} method request method
 */
export const requestPublicApi = async (slug: string) => {
  const cache = lru.get(slug);
  if (cache) {
    return cache;
  }

  const {data} = await axios.get('https://api.deezer.com' + slug);

  if (data.error) {
    const errorMessage = Object.entries(data.error).join(', ');
    throw new Error(errorMessage);
  }

  lru.set(slug, data);
  return data;
};
