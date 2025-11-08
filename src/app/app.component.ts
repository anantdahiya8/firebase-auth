import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { FireStoreService } from './firestore.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(private fireService: FireStoreService ){ this.initAuthListener(); }
  user : string | null = null;
  
  private initAuthListener() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user.displayName ?? user.email ?? null;
      } else {
        this.user = null;
      }
    });
  }

  logout() {
    const auth = getAuth();
    auth.signOut().then(() => {
      this.user = null;
      console.log('User signed out successfully');
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  }



  ngOnInit(): void {


    


    // const auth = getAuth();
    // signInWithEmailAndPassword(auth, 'anant.dahiya@gmail.com', 'hellowassup')
    //   .then((userCredential) => {
    //     // Signed in 
    //     const user = userCredential.user;
    //     console.log(user);
    //     this.user = user.email;
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //   });
  }
  create() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, 'anantdahiya88@gmail.com', 'hellowassup')
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);
        this.user = user.displayName ?? user.email ?? null;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // ..
      });
  }

  signInGmail() {
    // If already signed in, skip the popup
    if (this.user) {
      console.log('User already signed in:', this.user);
      return;
    }

    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    console.log(auth);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User : ", result.user)
        console.log("Token  : ", token)
        this.user = user.displayName ?? user.email ?? null;
        console.log('User : ', user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

  }

  getOrders() {
    // Debug authentication state and token first
    const auth = getAuth();
    const current = auth.currentUser;
    console.log('getOrders() - currentUser:', current);

    // Subscribe to realtime orders and log updates to the console.
    this.fireService.getAllOrdersRealtime().subscribe({
      next: (orders) => console.log('Realtime orders:', orders),
      error: (err) => console.error('Realtime fetch error:', err)
    });
  }

  getSingleOrder() {
    const auth = getAuth();
    const current = auth.currentUser;
    if(typeof current?.uid == 'string'){
      console.log('Current user ID:', current.uid);
      this.fireService.getSingleOrder(current.uid).subscribe({
      next: order => console.log('single order', order),
      error: err => console.error('single order error', err)
    });
    }
    
  }

  sendPasswordResetEmail() {
      const auth = getAuth();
      const email = 'anantdahiya88@gmail.com';
      if (email) {
        sendPasswordResetEmail(auth, email)
          .then(() => {
            console.log('Password reset email sent successfully');
          })
          .catch((error) => {
            console.error('Error sending password reset email:', error);
          });
      } else {
        console.error('No user is currently signed in');
      }
  }

  signInWithEmail() {
    const auth = getAuth();
    // Replace with actual email and password
    const email = 'anantdahiya88@gmail.com';
    const password = 'anantdahiya';
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        this.user = user.email;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in with email:', error);
      });
  }
}
