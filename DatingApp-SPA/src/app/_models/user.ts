import { Photo } from './photo';

export interface User {
    id: number;
    username: string;
    gender: string;
    age: string;
    knowAs: string;
    created: Date;
    lastActive: Date;
    city: string;
    photoUrl: string;
    country: string;
    interest?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}
