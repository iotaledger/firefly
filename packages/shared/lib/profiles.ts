import { persistent } from 'shared/lib/helpers'

interface Profile {
    name: string;
    id: string;
    active: boolean;
}

export const profiles = persistent<Profile[]>('profiles', []);
