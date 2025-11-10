import { Injectable, signal, WritableSignal } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public userName: WritableSignal<string | null> = signal(null);
  public userData: WritableSignal<User | null> = signal(null);

  constructor() {
    // initialize auth listener and keep a simple user signal
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userData.set(user);
        this.userName.set(user.displayName ?? user.email ?? null);
      } else {
        this.userData.set(null);
        this.userName.set(null);
      }
    });
  }

  create(email: string, password: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  signInWithEmail(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider);
  }

  logout() {
    const auth = getAuth();
    return auth.signOut();
  }

  sendPasswordReset(email: string) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }
}
