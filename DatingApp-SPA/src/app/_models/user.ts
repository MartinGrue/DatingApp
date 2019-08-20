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
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}
