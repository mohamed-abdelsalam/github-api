import * as _ from 'lodash';
import {AxiosRequestConfig} from 'axios';

export class RestConnectionConfig implements AxiosRequestConfig {
    baseURL: string;
    timeout: number;

    constructor(init?: Partial<RestConnectionConfig>) {
        _.assign(this, init);
    }
}
