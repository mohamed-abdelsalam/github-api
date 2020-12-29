import * as _ from 'lodash';
import Logger from 'bunyan';
import axios, {AxiosInstance} from 'axios';
import {plainToClass} from 'class-transformer';

import {RestConnectionConfig} from '../utils';
import {AggregationService} from '../aggregation-service';
import {RepositoryInfo} from '../model';
import {Query} from '../query';

export class RestAggregationService extends AggregationService {
    readonly logger: Logger;
    readonly axiosInstance: AxiosInstance;
    readonly restConnection: RestConnectionConfig;

    constructor(init?: Partial<RestAggregationService>) {
        super();
        this.axiosInstance = init.axiosInstance || axios.create({
            baseURL: init.restConnection.baseURL,
            timeout: init.restConnection.timeout
        });
        this.logger = init.logger.child({
            component: 'rest-aggregation-service'
        });
    }

    async query(query: Query): Promise<Array<RepositoryInfo>> {
        this.logger.info({
            restQuery: query.toRestQuery()
        }, 'starting rest query');
        try {
            const response = await this.axiosInstance.get(query.toRestQuery());
            this.logger.info({
                responseLength: response.data.items.length,
                restQuery: query.toRestQuery(),
                resultsComplete: response.data.incomplete_results === false
            }, 'got response from rest api');

            return Promise.resolve(_.map(response.data.items, (item) => {
                return plainToClass(RepositoryInfo, item, {excludeExtraneousValues: true});
            }));
        } catch (err) {
            this.logger.error({
                restQuery: query.toRestQuery(),
            }, 'Error happened in gitHub api call');
            return [];
        }
    }
}
