import * as _ from 'lodash';
import {ClientOpts} from 'redis';

export class RedisConnectionConfig implements ClientOpts {
    readonly port: number;
    readonly host: string;
    readonly cacheTTLMS: number;

    constructor(init?: Partial<RedisConnectionConfig>) {
        _.assign(this, init);
    }
}

