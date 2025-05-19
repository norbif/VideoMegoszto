export interface User {
    id?: string;  // Firestore document ID
    felhasznalonev: string;
    email: string;
    profilkepUrl?: string;
    regisztracioDatuma: Date;
    feltoltottVideok: string[];  // Video document IDs
    kedveltVideok: string[];    // Video document IDs
    lejatszasiListak: string[]; // Playlist document IDs
}
