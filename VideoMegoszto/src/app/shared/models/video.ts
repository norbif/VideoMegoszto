import { Comment } from "./comment";
import { User } from "./user";

export enum VideoLathatosag {
    Nyilvanos = 'public',
    NemListazott = 'unlisted',
    Privat = 'private',
  }

export interface Video {
    _id: number; 
    cim: string; 
    leiras?: string;
    url: string;
    thumbnailUrl?: string; 
    feltoltoId: User;
    feltoltesDatuma: Date; 
    hosszMasodpercben: number; 
    megtekintesekSzama: number; 
    cimkek?: string[]; 
    lathatosag: VideoLathatosag; 
    kedvelesekSzama: number; 
    nemKedvelesekSzama: number; 
    hozzaszolasok: number[]; 
}

