/**
 * Fast LRU & TTL cache
 * @param  {Integer} options.max		- Max entries in the cache. @default Infinity
 * @param  {Integer} options.ttl		- Timeout before removing entries. @default Infinity
 */
class FastLRU {
  _max: number;
  _ttl: number;
  _cache: Map<any, any>;
  _meta: {
    [key: string]: any;
  };
  constructor({maxSize = Infinity, ttl = 0}) {
    // Default options
    this._max = maxSize;
    this._ttl = ttl;
    this._cache = new Map();

    // Metadata for entries
    this._meta = {};
  }

  /**
   * Add new entry
   */
  set(key: string, value: any, ttl: number = this._ttl) {
    // Execution time
    const time = Date.now();

    // Remvove least recently used elements if exceeds max bytes
    if (this._cache.size >= this._max) {
      const items = Object.values(this._meta);
      if (this._ttl > 0) {
        for (const item of items) {
          if (item.expire < time) {
            this.delete(item.key);
          }
        }
      }

      if (this._cache.size >= this._max) {
        const least = items.sort((a, b) => a.hits - b.hits)[0];
        this.delete(least.key);
      }
    }

    // Override if key already set
    this._cache.set(key, value);
    this._meta[key] = {
      key,
      hits: 0,
      expire: time + ttl,
    };
  }

  /**
   * Get entry
   */
  get(key: string) {
    if (this._cache.has(key)) {
      const item = this._cache.get(key);
      if (this._ttl > 0) {
        const time = Date.now();
        if (this._meta[key].expire < time) {
          this.delete(key);
          return undefined;
        }
      }

      this._meta[key].hits++;
      return item;
    }
  }

  /**
   * Get without hitting hits
   */
  peek(key: string) {
    return this._cache.get(key);
  }

  /**
   * Remove entry
   */
  delete(key: string) {
    delete this._meta[key];
    this._cache.delete(key);
  }

  /**
   * Remove all entries
   */
  clear() {
    this._cache.clear();
    this._meta = {};
  }

  /**
   * Check has entry
   */
  has(key: string) {
    return this._cache.has(key);
  }

  /**
   * Get all kies
   * @returns {Iterator} Iterator on all kies
   */
  keys() {
    return this._cache.keys();
  }

  /**
   * Iterate over values
   */
  values() {
    return this._cache.values();
  }

  /**
   * Iterate over entries
   */
  entries() {
    return this._cache.entries();
  }

  /**
   * For each
   */
  forEach(cb: any) {
    return this._cache.forEach(cb);
  }

  /**
   * Entries total size
   */
  get size() {
    return this._cache.size;
  }
}

export default FastLRU;
