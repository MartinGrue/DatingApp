import { User } from './user';

export interface Photo {
    id: number;
    url: string;
    destription: string;
    dateAdded: Date;
    isMain: boolean;
    user: User;
    userId: number;
}
