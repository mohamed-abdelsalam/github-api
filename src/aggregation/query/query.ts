import * as _ from 'lodash';

export abstract class Query {
    readonly createdAfter: Date;

    protected constructor(init?: Partial<Query>) {
        _.assign(this, init)
    }

    abstract toRestQuery(): string;

    abstract toRedisKeyQuery(): string;

    abstract getRedisKeysInRange(start: Date, end: Date): Array<string>;
}
