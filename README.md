**GitHub api top repositories**

The purpose of this service is to serve the top [10, 50, 100] repositories on gitHub.

- **_Design_**
    - Service is writen in typeScript.
    - It runs light docker container.
    - It has an optional dependency on Redis for caching and performance optimization.
    - Asking for top n repository will check the cache, we have 2 options:
        - Data inside the cache, will serve it.
        - Data is not in the cache, will ping gitHub api. Store not only this data into Redis but also consider all days between the query date, and the minDate in the response to have the same results.

**Container Input parameters**

      - REST_API_ENDPOINT=https://api.github.com/
      - REST_TIMEOUT=4000
      - REDIS_CACHE_IS_ENABLED=true
      - REDIS_CACHE_HOST=redis
      - REDIS_CACHE_PORT=6379
      - REDIS_CACHE_TTL_MS=86400000
      - SERVING_PORT=3001

In order to use cache mode, you should have redis container running.

Example rest call

    http://localhost:3001/getTopRepositories?nbrOfRepositoriesToGet=5&createdAfter=2017-12-04&language=javascript
