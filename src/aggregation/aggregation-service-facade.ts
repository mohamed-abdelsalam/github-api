import * as _ from 'lodash';
import Logger from 'bunyan';

import {AggregationService} from './aggregation-service';
import {RestAggregationService} from './impl';
import {RepositoryInfo} from './model';
import {Query} from './query';
import {RedisCache} from './cache/redis-cache';

import {
    RedisConnectionConfig,
    RestConnectionConfig
} from './utils';

export class AggregationServiceFacade extends AggregationService {
    readonly logger: Logger;
    private restAggregationService: RestAggregationService;
    private redisCacheService: RedisCache;
    readonly redisCacheIsEnabled: boolean;
    readonly restConnectionConfig: RestConnectionConfig;
    readonly redisConnectionConfig: RedisConnectionConfig;

    constructor(init: Partial<AggregationServiceFacade>) {
        super();
        _.assign(this, init);
        this.restAggregationService = new RestAggregationService({
            restConnection: this.restConnectionConfig,
            logger: this.logger
        });
        if (this.redisCacheIsEnabled) {
            this.redisCacheService = new RedisCache({
                redisConnectionConfig: this.redisConnectionConfig
            })
        }
    }

    async query(query: Query): Promise<Array<RepositoryInfo>> {
        if (this.redisCacheIsEnabled) {
            let results = await this.redisCacheService.getQueryResults(query);
            if (results.length === 0) {
                results = await this.restAggregationService.query(query);
            }
            await this.redisCacheService.storeQueryResults(query, results);
            return results;
        } else {
            return await this.restAggregationService.query(query);
        }
    }
}
