import * as _ from 'lodash';
import {Query} from './query';

export class GetTopNRepositoriesCreatedAfterTimeQuery extends Query {
    readonly nbrOfRepositoriesToGet: number;

    constructor(init?: Partial<GetTopNRepositoriesCreatedAfterTimeQuery>) {
        super(init);
        _.assign(this, init);
    }

    toRedisKeyQuery(): string {
        return `GetTopNRepositoriesCreatedAfterTimeQuery:${
            this.createdAfter.getFullYear()
        }:${
            this.createdAfter.toISOString().slice(0, 10)
        }`;
    }

    toRestQuery(): string {
        return `/search/repositories?q=stars:>1+created:>${
            this.createdAfter.toISOString().slice(0, 10)
        }&per_page=${
            100
        }&sort=stars&order=desc`;
    }

    getRedisKeysInRange(start: Date, end: Date): Array<string> {
        const keys = [];
        while (start < end) {
            keys.push(`GetTopNRepositoriesCreatedAfterTimeQuery:${
                this.createdAfter.getFullYear()
            }:${
                start.toISOString().slice(0, 10)
            }`);
            start.setDate(start.getDate() + 1)
        }
        return keys;
    }
}
