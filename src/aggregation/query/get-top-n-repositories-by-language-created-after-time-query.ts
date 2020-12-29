import * as _ from 'lodash';
import {Query} from './query';

export class GetTopNRepositoriesByLanguageCreatedAfterTimeQuery extends Query {
    readonly nbrOfRepositoriesToGet: number;
    readonly language: string;

    constructor(init?: Partial<GetTopNRepositoriesByLanguageCreatedAfterTimeQuery>) {
        super(init);
        _.assign(this, init);
    }

    toRedisKeyQuery(): string {
        return `GetTopNRepositoriesByLanguageCreatedAfterTimeQuery:${
            this.language
        }:${
            this.createdAfter.getFullYear()
        }:${
            this.createdAfter.toISOString().slice(0, 10)
        }`;
    }

    toRestQuery(): string {
        return `/search/repositories?q=stars:>1+language:${
            this.language
        }+created:>${
            this.createdAfter.toISOString().slice(0, 10)
        }&per_page=${
            100
        }&sort=stars&order=desc`;
    }

    getRedisKeysInRange(start: Date, end: Date): Array<string> {
        const output = [];
        while (start < end) {
            output.push(`GetTopNRepositoriesByLanguageCreatedAfterTimeQuery:${
                this.language
            }:${
                this.createdAfter.getFullYear()
            }:${
                start.toISOString().slice(0, 10)
            }`);
            start.setUTCDate(start.getUTCDate() + 1)
        }
        return output;
    }
}
