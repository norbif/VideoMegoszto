import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),  // For Nextcloud HTTP requests
    provideFirebaseApp(() => initializeApp({ 
      projectId: "videomegoszto-7112f", 
      appId: "1:355451091021:web:fdce22a968bc1064028404", 
      storageBucket: "videomegoszto-7112f.firebasestorage.app", 
      apiKey: "AIzaSyDGCMXr2UnBuRS5J0fHWye82dBT7CHHWU0", 
      authDomain: "videomegoszto-7112f.firebaseapp.com", 
      messagingSenderId: "355451091021", 
      measurementId: "G-MK9155T3F2" 
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};