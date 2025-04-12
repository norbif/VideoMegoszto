export interface User {
    _id: number; 
    felhasznalonev: string; 
    email: string; 
    jelszoHash: string;
    profilkepUrl?: string; 
    regisztracioDatuma: Date; 
    feltoltottVideok: number[]; 
    kedveltVideok?: number[]; 
    lejatszasiListak?: number[];
}
