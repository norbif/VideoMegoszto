import { Comment } from "./comment";
import { User } from "./user";

export enum VideoLathatosag {
    Nyilvanos = 'public',
    NemListazott = 'unlisted',
    Privat = 'private'
}

export interface Video {
    id?: string;  // Firestore document ID
    cim: string;
    leiras?: string;
    url: string;
    thumbnailUrl?: string;
    feltoltoId: string;
    feltoltesDatuma: Date;
    hosszMasodpercben: number;
    megtekintesekSzama: number;
    lathatosag: VideoLathatosag;
    kedvelesekSzama: number;
    nemKedvelesekSzama: number;
    hozzaszolasok: string[];  // Comment document IDs
}

