import * as _ from 'lodash';
import Logger from 'bunyan';
import moment from 'moment';
import autoBind from 'auto-bind';

import {
    AggregationServiceFacade,
    GetTopNRepositoriesByLanguageCreatedAfterTimeQuery,
    GetTopNRepositoriesCreatedAfterTimeQuery,
    Query
} from '../aggregation';

export enum Routes {
    GetTopRepositories = '/getTopRepositories'
}

export class RoutesHandler {
    readonly logger: Logger;
    readonly aggregationService: AggregationServiceFacade;

    constructor(init?: Partial<RoutesHandler>) {
        _.assign(this, init);
        autoBind(this);
    }

    async getTopRepositoriesHandler(req, res): Promise<void> {
        let query: Query;
        const createdAfter = _.get(req.query, 'createdAfter', '2020-01-01').toString();
        const nbrOfRepositoriesToGet = Number(_.get(req.query, 'nbrOfRepositoriesToGet', 10));
        if (_.has(req.query, 'language')) {
            query = new GetTopNRepositoriesByLanguageCreatedAfterTimeQuery({
                nbrOfRepositoriesToGet: nbrOfRepositoriesToGet,
                createdAfter: new Date(createdAfter),
                language: _.get(req.query, 'language').toString()
            });
        } else {
            query = new GetTopNRepositoriesCreatedAfterTimeQuery({
                nbrOfRepositoriesToGet: nbrOfRepositoriesToGet,
                createdAfter: new Date(createdAfter)
            });
        }
        const output = await this.aggregationService.query(query);
        res.send(_.slice(output, 0, nbrOfRepositoriesToGet));
    }

    async getTopRepositoriesValidator(req, res, next) {
        const errorMessages: Array<string> = [];
        const createdAfter = _.get(req.query, 'createdAfter', null);
        if (createdAfter === null || !moment(createdAfter, 'YYYY-MM-DD', true).isValid()) {
            errorMessages.push(`Invalid value for param createdAfter=${
                createdAfter}. createdAfter is a required parameter, should be in format of YYYY-MM-DD`);
        }
        const nbrOfRepositoriesToGet = _.get(req.query, 'nbrOfRepositoriesToGet', null);
        if (_.isNaN(nbrOfRepositoriesToGet) || _.isNaN(Number(nbrOfRepositoriesToGet))) {
            errorMessages.push(`Invalid value for param nbrOfRepositoriesToGet=${
                nbrOfRepositoriesToGet}. nbrOfRepositoriesToGet is required parameter and should be integer > 0`);
        }
        if (_.keys(req.query).length > 3) {
            errorMessages.push(`too many values in the query parameter ${
                JSON.stringify(req.query)
            }. Example can be /getTopRepositories?nbrOfRepositoriesToGet=5&createdAfter=2014-12-04&language=javascript`);
        }
        if (errorMessages.length === 0) {
            next();
        } else {
            return res.send(400, {
                status: 400,
                result: errorMessages.join('\n')
            });
        }

    }
}
