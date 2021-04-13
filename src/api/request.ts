import axios from '../lib/request';
import lru from './cache';

/**
 * Make POST requests to deezer api
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
 * Make GET requests to deezer public api
 * @param {String} method request method
 * @param {Object} params request parameters
 */
export const requestGet = async (method: string, params?: object) => {
  const cacheKey = `${method}:${params ? Object.entries(params).join(':') : 'get_request'}`;
  const cache = lru.get(cacheKey);
  if (cache) {
    return cache;
  }

  const {
    data: {error, results},
  } = await axios.get('/gateway.php', {params: {method, ...params}});

  if (Object.keys(results).length > 0) {
    lru.set(cacheKey, results);
    return results;
  }

  const errorMessage = Object.entries(error).join(', ');
  throw new Error(errorMessage);
};

/**
 * Make GET requests to deezer public api
 * @param {String} slug endpoint
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
