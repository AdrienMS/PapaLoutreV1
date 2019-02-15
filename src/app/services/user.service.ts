import { Injectable } from '@angular/core';
//import { HTTP } from '@ionic-native/http';
//import { Http, Headers, RequestOptions } from "@angular/http";
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
//import 'rxjs/add/operator/map';

import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = "http://localhost:4242/";
  private user: User;

  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<User> {
    return Observable.create(observer => {
      this.http.post(this.API_URL + 'login', {email: email, password: password})
      .toPromise()
        .then(
          res => {
            if (res["status"] != undefined && res["status"] === 201) {
              this.user = new User();
              this.user = res["user"];
              this.user.token = res["token"];
              localStorage.setItem('currentUser', JSON.stringify(this.user));
              observer.next(this.user);
            } else {
              observer.next(null);
            }
            observer.complete();
          },
          error => {
            console.log(error);
            observer.next(null);
            observer.complete();
          }
        )
    });
  }

  public register(email: string, password: string, name: string): Observable<boolean> {
    return Observable.create(observer => {
      this.http.post(this.API_URL + 'register', {email: email, password: password, name: name})
      .toPromise()
      .then(
        res => {
          if (res["status"] === 201) {
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        },
        error => {
          observer.next(false);
          observer.complete();
        }
      )
    });
  }

  public checkIfConnected(token: string): Observable<boolean> {
    return Observable.create(observer => {
      this.http.post(this.API_URL + 'checkIfConnected', {token: token})
      .toPromise()
      .then(
        res => {
          if (res["status"] === 403) {
            observer.next(false);
          } else {
            observer.next(true);
          }
          observer.complete();
        },
        error => {
          observer.next(false);
          observer.complete();
        }
      )
    })
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
  }
}
