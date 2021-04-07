import FastLRU from '../lib/fast-lru';

// Expire cache in 60 minutes
const lru = new FastLRU({
  maxSize: 1000,
  ttl: 60 * 60000,
});

export default lru;
