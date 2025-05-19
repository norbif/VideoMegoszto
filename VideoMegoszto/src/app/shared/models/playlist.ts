export enum ListaLathatosag {
    Nyilvanos = 'public',
    Privat = 'private'
}

export interface Playlist {
    id?: string;  // Firestore document ID
    nev: string;
    leiras?: string;
    keszitoId: string;  // Reference to user
    videoIdk: string[]; // Video document IDs
    letrehozasDatuma: Date;
    utolsoModositasDatuma: Date;
    lathatosag: ListaLathatosag;
}
