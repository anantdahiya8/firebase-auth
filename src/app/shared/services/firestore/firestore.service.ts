import { Injectable } from '@angular/core';
import { getFirestore, collection, query, onSnapshot, doc, getDoc, DocumentData, addDoc } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  // Use the Firebase JS SDK directly (getFirestore) instead of relying on
  // the AngularFire-injected Firestore provider. This avoids DI issues when
  // `provideFirestore` isn't available or not initialized yet.
  private get db() {
    return getFirestore();
  }

  /**
   * Fetches all documents from the 'orders' collection in real-time.
   * Emits an array of order documents (with their IDs) whenever the collection changes.
   */
  getAllOrdersRealtime(): Observable<DocumentData[]> {
    const ordersCollectionRef = collection(this.db, 'order');
    const q = query(ordersCollectionRef);

    return new Observable<DocumentData[]>(observer => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orders: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        observer.next(orders);
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }


  /**
   * Fetches a single order document by ID and returns it as an Observable.
   * Emits `null` if the document does not exist.
   */
  getSingleOrder(id: string): Observable<DocumentData | null> {
    const docRef = doc(this.db, 'order', id);
    return from(getDoc(docRef)).pipe(
      map(snapshot => snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as DocumentData) : null)
    );
  }

  /**
   * Sends an email using Firebase Firestore Email Extension.
   * Adds a document to the 'mail' collection which triggers the email extension.
   * 
   * @param to - Recipient email address
   * @param subject - Email subject line
   * @param html - Email body in HTML format
   * @returns Promise that resolves when email document is added to Firestore
   * 
   * Note: Requires Firebase Email Extension to be installed in your Firebase project.
   * Install from: Firebase Console → Extensions → Search "Trigger Email from Firestore"
   */
  sendEmail(to: string[], subject: string, html: string): Promise<DocumentData> {
    const mailCollectionRef = collection(this.db, 'mail');
    
    return addDoc(mailCollectionRef, {
      bcc: to,
      message: {
        subject: subject,
        html: html,
      },
    }).then((docRef) => {
      return docRef;
    }).catch((error) => {
      throw error;
    });
  }
}
