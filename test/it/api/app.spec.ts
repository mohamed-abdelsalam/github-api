import axios from 'axios';

describe('Api integration-test', () => {
    const axiosClient = axios.create({
        baseURL: `http://localhost:3005`,
        timeout: 6000
    });

    it('should call the api and get response', async () => {
        const response =
            await axiosClient.get('/getTopRepositories?nbrOfRepositoriesToGet=5&createdAfter=2020-11-01&language=java');
        expect(response.data.length).toEqual(5);
    });

    it('should fail with invalid createdAfter', async () => {
        try {
            await axiosClient
                .get('/getTopRepositories?nbrOfRepositoriesToGet=5&createdAfter=2020-119-01&language=java');
        } catch (e) {
            expect(e.response.data.status).toEqual(400);
            expect(e.response.data.result)
                .toEqual('Invalid value for param createdAfter=2020-119-01. createdAfter is a required parameter, should be in format of YYYY-MM-DD');
        }
    });
})

