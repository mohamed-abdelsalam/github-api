import * as _ from 'lodash';
import {classToPlain, plainToClass} from 'class-transformer';
import {RedisClient, createClient} from 'redis';

import {RedisConnectionConfig, RepositoryInfo, Query} from '../index';

export class RedisCache {
    readonly redisClient: RedisClient;
    readonly redisConnectionConfig: RedisConnectionConfig;

    constructor(init?: Partial<RedisCache>) {
        _.assign(this, init);
        this.redisClient = init.redisClient || createClient(this.redisConnectionConfig);
    }

    async storeQueryResults(query: Query, results: Array<RepositoryInfo>): Promise<boolean> {
        await this.runCacheOptimizer(query, results);
        return this.redisClient.set(query.toRedisKeyQuery(), JSON.stringify(_.map(results, (item) => {
                return classToPlain(item);
            })),
            'EX', this.redisConnectionConfig.cacheTTLMS);
    }

    async getQueryResults(query: Query): Promise<Array<RepositoryInfo>> {
        return new Promise((resolve, reject) => {
            this.redisClient.get(query.toRedisKeyQuery(), (error, value) => {
                if (error) {
                    reject(error);
                } else if (value) {
                    resolve(_.map(JSON.parse(value), (item) => {
                        return plainToClass(RepositoryInfo, item, {excludeExtraneousValues: true});
                    }));
                } else {
                    resolve([]);
                }
            });
        });
    }

    async runCacheOptimizer(query: Query, results: Array<RepositoryInfo>): Promise<Array<boolean>> {
        const start = new Date(query.createdAfter);
        const minDate: Date = new Date(_.minBy(results, 'created_at').created_at);
        const end: Date = new Date(`${minDate.toISOString().slice(0, 10)}T00:00:00`);

        const keys: Array<string> = query.getRedisKeysInRange(start, end);
        return Promise.all(_.map(keys, async (key) => {
            return this.redisClient.set(key, JSON.stringify(_.map(results, (item) => {
                    return classToPlain(item);
                })),
                'EX', this.redisConnectionConfig.cacheTTLMS);
        }))
    }
}
