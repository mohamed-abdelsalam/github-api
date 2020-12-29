import 'reflect-metadata';
import express, {Express} from 'express';
import Logger from 'bunyan';

import {
    AggregationServiceFacade,
    RedisConnectionConfig,
    RestConnectionConfig
} from '../aggregation';

import {Routes, RoutesHandler} from './routes-handler';

export default class App {
    readonly logger: Logger;
    readonly express: Express;
    readonly routesHandler: RoutesHandler;
    readonly servingPort: number;

    constructor({config}) {
        this.express = express();
        this.logger = Logger.createLogger({
            name: 'github-api',
            version: config.VERSION
        });

        this.routesHandler = new RoutesHandler({
            logger: this.logger,
            aggregationService: new AggregationServiceFacade({
                restConnectionConfig: new RestConnectionConfig({
                    baseURL: config.REST_API_ENDPOINT,
                    timeout: config.REST_TIMEOUT
                }),
                redisConnectionConfig: new RedisConnectionConfig({
                    host: config.REDIS_CACHE_HOST,
                    port: config.REDIS_CACHE_PORT,
                    cacheTTLMS: config.REDIS_CACHE_TTL_MS
                }),
                redisCacheIsEnabled: config.REDIS_CACHE_IS_ENABLED,
                logger: this.logger
            })
        });

        this.servingPort = config.SERVING_PORT;
    }

    configure(): void {
        this.express.get(Routes.GetTopRepositories, this.routesHandler.getTopRepositoriesValidator,
            this.routesHandler.getTopRepositoriesHandler);
    }

    start(): void {
        this.configure();
        this.express.listen(this.servingPort, () => {
            this.logger.info(`Service started at port: ${this.servingPort}`);
        });
    }
}
