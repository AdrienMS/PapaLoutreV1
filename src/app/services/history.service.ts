import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { History } from '../../models/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private API_URL = "http://localhost:4242/";
  private history: History;
  private allHistories: Array<History> = null;

  constructor(private http: HttpClient) { }

  public getAll(token: string): Observable<Array<History>> {
    this.allHistories = new Array<History>();
    return Observable.create(observer => {
      let add_headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': token
      });
      //let options = new HttpRequest({ headers: add_headers });
      this.http.get(this.API_URL + "history/getAll", { headers: add_headers })
      .toPromise()
      .then(
        res => {
          if (res["status"] != undefined && res["status"] === 200) {
            res["histories"].forEach(history => {
              this.allHistories.push(new History(history["id"], history["author_id"], history["name"], history["description"]));
            });
            observer.next(this.allHistories);
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

  public getById(id: number, token: string): Observable<History> {
    return Observable.create(observer => {
      let add_headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': token,
        'history_id': id.toString()
      });
      this.http.get(this.API_URL + "history/getById", {headers: add_headers})
      .toPromise()
      .then(
        res => {
          if (res["status"] != undefined && res["status"] === 200) {
            observer.next(res["history"][0]);
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
    })
  }
}
