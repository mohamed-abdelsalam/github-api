import axios from 'axios';
import Logger from 'bunyan';
import MockAdapter from 'axios-mock-adapter';

import {RestAggregationService} from '../../../../src/aggregation/impl';
import {GetTopNRepositoriesByLanguageCreatedAfterTimeQuery} from '../../../../src/aggregation';

describe('Rest aggregation unit test', () => {
    const axiosInstance = axios.create({
        baseURL: 'hello.web',
        timeout: 1000
    });
    const axiosMock = new MockAdapter(axiosInstance);
    axiosMock.onGet('hello.web/search/repositories?q=stars:>1+language:javascript+created:>2020-01-01&per_page=100&sort=stars&order=desc')
        .reply(200, require('../../fixture/impl/rest-api-response.json'));

    const restAggregationService = new RestAggregationService({
        axiosInstance: axiosInstance,
        logger: new Logger({
            name: 'unit-test'
        })
    });
    it('should call the correct api', async () => {
        const query = new GetTopNRepositoriesByLanguageCreatedAfterTimeQuery({
            language: 'javascript',
            createdAfter: new Date('2020-01-01'),
            nbrOfRepositoriesToGet: 100
        });

        const response = await restAggregationService.query(query);
        expect(response.length).toEqual(100);
    })
})

