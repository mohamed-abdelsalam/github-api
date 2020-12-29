import {Expose} from 'class-transformer';

export class RepositoryInfo {
    @Expose() name: string;
    @Expose() description: string;
    @Expose() stargazers_count: number;
    @Expose() url: string;
    @Expose() language: string;
    @Expose() created_at: Date;
}
