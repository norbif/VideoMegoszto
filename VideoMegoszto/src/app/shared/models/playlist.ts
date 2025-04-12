export enum ListaLathatosag {
    Nyilvanos = 'public',
    Privat = 'private',
  }

export interface Playlist {
    _id: number;
    nev: string; 
    leiras?: string; 
    keszitoId: number;
    videoIdk: number[]; 
    letrehozasDatuma: Date;
    utolsoModositasDatuma: Date; 
    lathatosag: ListaLathatosag; 
}
