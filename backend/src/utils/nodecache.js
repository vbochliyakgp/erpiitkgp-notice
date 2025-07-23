// utils/cache.js
const NodeCache = require("node-cache");

// Create different cache instances for different types of data
const caches = {
  notices: new NodeCache({ 
    stdTTL: 600, // 10 minutes
    checkperiod: 60, // Check for expired keys every 60 seconds
    maxKeys: 1000 // Limit cache size
  }),
  search: new NodeCache({ 
    stdTTL: 600, // 10 minutes
    checkperiod: 120,
    maxKeys: 500
  }),
  filters: new NodeCache({ 
    stdTTL: 1800, // 30 minutes (filters change less frequently)
    checkperiod: 300,
    maxKeys: 10
  })
};

// Helper function to generate cache keys
const generateCacheKey = (prefix, params) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        result[key] = params[key];
      }
      return result;
    }, {});
  
  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

// Cache wrapper function
const withCache = (cacheInstance, keyPrefix) => {
  return (asyncFunction) => {
    return async (req, res, next) => {
      try {
        // Generate cache key
        const cacheKey = generateCacheKey(keyPrefix, req.query);
        
        // Try to get from cache first
        const cachedResult = cacheInstance.get(cacheKey);
        if (cachedResult) {
          // console.log(`Cache hit for: ${cacheKey}`);
          return res.json(cachedResult);
        }
        
        // console.log(`Cache miss for: ${cacheKey}`);
        
        // If not in cache, execute the original function
        // But we need to intercept the response to cache it
        const originalJson = res.json;
        res.json = function(data) {
          // Cache the response data
          cacheInstance.set(cacheKey, data);
          // console.log(`Cached result for: ${cacheKey}`);
          
          // Call the original json method
          originalJson.call(this, data);
        };
        
        // Execute the original function
        await asyncFunction(req, res, next);
        
      } catch (error) {
        next(error);
      }
    };
  };
};

module.exports = {
  caches,
  generateCacheKey,
  withCache,
  // Manual cache clearing functions
  clearNoticesCache: () => caches.notices.flushAll(),
  clearSearchCache: () => caches.search.flushAll(),
  clearFiltersCache: () => caches.filters.flushAll(),
  clearAllCaches: () => {
    caches.notices.flushAll();
    caches.search.flushAll();
    caches.filters.flushAll();
  }
};
