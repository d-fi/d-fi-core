import axios from '../lib/request';
import lru from './cache';

const hasResults = (results: unknown): boolean => {
  return Boolean(results && typeof results === 'object' && Object.keys(results).length > 0);
};

const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return String(error || 'Empty API response');
  }

  return Object.entries(error).join(', ');
};

const convertToQueryParams = (params: Record<string, any>): Record<string, string> => {
  const queryParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    queryParams[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  return queryParams;
};

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
  } = await axios.post<any>('/gateway.php', body, {params: {method}});

  if (hasResults(results)) {
    lru.set(cacheKey, results);
    return results;
  }

  throw new Error(getErrorMessage(error));
};

/**
 * Make POST requests to deezer api
 * @param {Object} body post body
 * @param {String} method request method
 */
export const requestLight = async (body: object, method: string) => {
  const cacheKey = method + ':' + Object.entries(body).join(':');
  const cache = lru.get(cacheKey);
  if (cache) {
    return cache;
  }

  const {
    data: {error, results},
  } = await axios.post<any>('https://www.deezer.com/ajax/gw-light.php', body, {
    params: {method, api_version: '1.0'},
  });
  if (hasResults(results)) {
    lru.set(cacheKey, results);
    return results;
  }

  throw new Error(getErrorMessage(error));
};

/**
 * Make GET requests to deezer public api
 * @param {String} method request method
 * @param {Object} params request parameters
 */
export const requestGet = async (method: string, params: Record<string, any> = {}, key = 'get_request') => {
  const cacheKey = method + key;
  const cache = lru.get(cacheKey);
  if (cache) {
    return cache;
  }

  const {
    data: {error, results},
  } = await axios.get<any>('/gateway.php', {params: {method, ...convertToQueryParams(params)}});

  if (hasResults(results)) {
    lru.set(cacheKey, results);
    return results;
  }

  throw new Error(getErrorMessage(error));
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

  const {data} = await axios.get<any>('https://api.deezer.com' + slug);

  if (data.error) {
    const errorMessage = Object.entries(data.error).join(', ');
    throw new Error(errorMessage);
  }

  lru.set(slug, data);
  return data;
};
