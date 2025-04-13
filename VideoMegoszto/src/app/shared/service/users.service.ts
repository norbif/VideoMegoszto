import { Injectable } from '@angular/core';
import { User } from '../models/user';
import userek from '../../../../public/jsons/userek.json';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    this.users = userek.map(user => ({
      _id: user._id,
      felhasznalonev: user.felhasznalonev,
      email: user.email,
      jelszoHash: user.jelszoHash,
      profilkepUrl: user.profilkepUrl,
      regisztracioDatuma: new Date(user.regisztracioDatuma),
      feltoltottVideok: user.feltoltottVideok || [],
      kedveltVideok: user.kedveltVideok || [],
      lejatszasiListak: user.lejatszasiListak || []
    }));
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user._id === id);
  }

  getUsersByIds(ids: number[]): User[] {
    return this.users.filter(user => ids.includes(user._id));
  }
}
