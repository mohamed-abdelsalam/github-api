const config = {
    REST_API_ENDPOINT: process.env.REST_API_ENDPOINT,
    REST_TIMEOUT: Number(process.env.REST_TIMEOUT),

    REDIS_CACHE_IS_ENABLED: process.env.REDIS_CACHE_IS_ENABLED === 'true',
    REDIS_CACHE_HOST: process.env.REDIS_CACHE_HOST,
    REDIS_CACHE_PORT: Number(process.env.REDIS_CACHE_PORT),
    REDIS_CACHE_TTL_MS: Number(process.env.REDIS_CACHE_TTL_MS),

    SERVING_PORT: Number(process.env.SERVING_PORT),
    VERSION: require('../package.json').version
};

export default config;
