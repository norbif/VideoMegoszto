export interface Comment {
    id?: string;  // Firestore document ID
    videoId: string;  // Reference to video
    szerzoId: string; // Reference to user
    szoveg: string;
    datum: Date;
    kedvelesekSzama: number;
    nemKedvelesekSzama: number;
    valaszok?: string[]; // Reference to reply comments
}