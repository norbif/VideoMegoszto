import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, authState,UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;
  

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.currentUser = authState(this.auth).pipe(
      map(firebaseUser => firebaseUser ? {
        _id: parseInt(firebaseUser.uid),
        felhasznalonev: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        jelszoHash: '',
        regisztracioDatuma: new Date(),
        feltoltottVideok: [],
        kedveltVideok: [],
        lejatszasiListak: []
      } : null)
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<any> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser;
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser.pipe(
      map(user => user !== null)
    );
  }
}
