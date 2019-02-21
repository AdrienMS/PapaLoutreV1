import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';
import { Events } from '@ionic/angular';

//import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;
  private userRef: AngularFireList<User>;
  private info: any[] = [];
  private ref: firebase.database.Reference;

  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    public events: Events
  ) {
    afAuth.authState.subscribe(user => {
			this.user = user;
    }, error => console.log(error));
    this.ref = firebase.database().ref('users/');
    this.getInfo();
  }

  public getInfo() {
    return Observable.create(observer => {
      this.ref.on('value', resp => {
        this.info = [];
        let returnArr = [];
  
        resp.forEach(childSnapshot => {
            let item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });
  
        this.info = returnArr;
        //console.log(this.info);
        //this.events.publish('login');
        observer.next(this.info);
        observer.complete();
      }, err => {
        console.log(err);
        observer.next(null);
        observer.complete();
      });
    });
  }

	signInWithEmail(credentials) {
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
  }
  
  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(
      newUser => {
        this.ref.push();
        this.ref.child(newUser.user.uid).set({email: credentials.email, username: credentials.username, user_id: newUser.user.uid, status: 0});
      }
    );
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signInWithGoogle(): Promise<any> {
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  private oauthSignIn(provider: AuthProvider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider).then( result => {
        if(!this.isInFirebaseDb(result)) {
          this.ref.push();
          this.ref.child(result.user.uid).set({email: result.user.email, username: result.user.displayName, user_id: result.user.uid, status: 0});
        }
      });
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
      .then(() => {
        return this.afAuth.auth.getRedirectResult().then( result => {
          // This gives you a Google Access Token.
          // You can use it to access the Google API.
          let token = result.credential.providerId;
          // The signed-in user info.
          let user = result.user;
          
          if(!this.isInFirebaseDb(result)) {
            this.ref.push();
            this.ref.child(result.user.uid).set({email: result.user.email, username: result.user.displayName, user_id: result.user.uid, status: 0});
          }
        }).catch(function(error) {
          // Handle Errors here.
          alert(error.message);
        });
      });
    }
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  getCurrentUserInformations(): Observable<User> {
    return Observable.create(observer => {
      this.getInfo().subscribe(() => {
        for(let i = 0; i < this.info.length; i += 1) {
          if (this.afAuth.auth.currentUser.uid === this.info[i].user_id) {
            observer.next(this.info[i]);
            observer.complete();
          }
        }
        observer.next(null);
        observer.complete();
      });
    });
  }

  getEmail() {
    return this.user && this.user.email;
  }
  
  isInFirebaseDb(user: firebase.auth.UserCredential): boolean {
    for(let i = 0; i < this.info.length; i += 1) {
      if (this.info[i].user_id == user.user.uid) {
        return true;
      }
    }
    return false;
  }

  modifyUser(user: User) {
    this.ref.push();
    this.ref.child(this.afAuth.auth.currentUser.uid).update({email: user.email, username: user.username, user_id: user.user_id, status: user.status});
  }

  resetPassword(email: string): Observable<boolean> {
    return Observable.create(observer => {
      this.afAuth.auth.sendPasswordResetEmail(email).then(() => {
        observer.next(true);
        observer.complete();
      }, err => {
        console.log(err);
        observer.next(false);
        observer.complete();
      });
    });
  }
}
