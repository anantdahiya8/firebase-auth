import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment.development';

// AngularFire providers
import { provideFirebaseApp, initializeApp as initializeFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore as getAngularFireFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeFirebaseApp(environment.firebaseConfig)),
    provideFirestore(() => getAngularFireFirestore())
  ]
};

initializeApp(environment.firebaseConfig);
