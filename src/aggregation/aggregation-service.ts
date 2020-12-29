import {RepositoryInfo} from './model';

import {Query} from './query';

export abstract class AggregationService {
    protected constructor() {
    }

    public abstract query(query: Query): Promise<Array<RepositoryInfo>>;
}
