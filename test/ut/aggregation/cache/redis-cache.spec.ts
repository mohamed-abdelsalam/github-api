import {plainToClass} from 'class-transformer';
import * as Redis from 'redis-mock';

import {
    RepositoryInfo,
    GetTopNRepositoriesByLanguageCreatedAfterTimeQuery,
    GetTopNRepositoriesCreatedAfterTimeQuery,
    RedisCache,
    RedisConnectionConfig
} from '../../../../src/aggregation';

describe('Redis cache unit test', () => {
    let redisCacheService;
    const redisClient = new Redis.RedisClient({
        host: 'local',
        port: 134
    });

    beforeAll(() => {
        redisCacheService = new RedisCache({
            redisClient: redisClient,
            redisConnectionConfig: new RedisConnectionConfig({
                cacheTTLMS: 1000
            })
        });
    });

    it('should store query results', async () => {
        const query = new GetTopNRepositoriesByLanguageCreatedAfterTimeQuery({
            language: 'java',
            createdAfter: new Date('2020-01-01'),
            nbrOfRepositoriesToGet: 100
        });
        await redisCacheService.storeQueryResults(query, [plainToClass(RepositoryInfo, {
            name: 'repo',
            description: 'test repo',
            stargazers_count: 10000,
            url: 'https://hello.world',
            language: 'java',
            created_at: '2020-01-01'
        })]);
        const stored = await new Promise((resolve, rejects) => {
            redisClient.get('GetTopNRepositoriesByLanguageCreatedAfterTimeQuery:java:2020:2020-01-01', (error, val) => {
                resolve(val);
            });
        })
        expect(stored).toEqual("[{\"name\":\"repo\",\"description\":\"test repo\",\"stargazers_count\":10000,\"url\":\"https://hello.world\",\"language\":\"java\",\"created_at\":\"2020-01-01\"}]");
    });

    it('should get query results', async () => {
        const query = new GetTopNRepositoriesByLanguageCreatedAfterTimeQuery({
            language: 'java',
            createdAfter: new Date('2020-01-01'),
            nbrOfRepositoriesToGet: 100
        });
        await redisCacheService.storeQueryResults(query, [plainToClass(RepositoryInfo, {
            name: 'repo',
            description: 'test repo',
            stargazers_count: 10000,
            url: 'https://hello.world',
            language: 'java',
            created_at: '2020-01-01'
        })]);
        const results = await redisCacheService.getQueryResults(query);

        expect(results.length).toEqual(1);
        expect(results).toEqual([
            plainToClass(RepositoryInfo, {
                "created_at": "2020-01-01",
                "description": "test repo",
                "language": "java",
                "name": "repo",
                "stargazers_count": 10000,
                "url": "https://hello.world"
            })
        ]);
    });

    it('should return empty list', async () => {
        const query = new GetTopNRepositoriesByLanguageCreatedAfterTimeQuery({
            language: 'javascript',
            createdAfter: new Date('2020-02-01'),
            nbrOfRepositoriesToGet: 100
        });
        const results = await redisCacheService.getQueryResults(query);

        expect(results.length).toEqual(0);
    });

    it('should fail', async () => {
        const query = new GetTopNRepositoriesCreatedAfterTimeQuery({
            createdAfter: new Date('2020-02-01'),
            nbrOfRepositoriesToGet: 100
        });

        let tmp = redisClient.get;
        redisClient.get = () => {
            throw new Error('Redis error');
        }
        try {
            await redisCacheService.getQueryResults(query);
        } catch (error) {
            redisClient.get = tmp;
            expect(error.message).toEqual('Redis error');
            return;
        }
        redisClient.get = tmp;
        fail('should throw redis error');
    });
})
