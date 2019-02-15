import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';

import { AuthService } from './auth.service';

import { User } from '../models/user'
import { Chapter } from '../models/chapter';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private ref: firebase.database.Reference;
  private chapters: Chapter[];
  private currentUser: User;

  constructor(
    private db: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private auth: AuthService) {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.ref = firebase.database().ref('chapters/');
        this.getAll();
      });
    }

  public save(chapters: Chapter[]): Observable<boolean> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        chapters.forEach(chapter => {
          let chapter_id = null;
          if (chapter.id == null) {
            chapter.id = new Date().getTime().toString();
            console.log(chapter.id);
          } else {
            chapter_id = chapter.id;
          }
          let putDatas = chapter.getDataToJSON();
          if (chapter_id === null) {
            this.ref.child(this.currentUser.user_id).child(chapter.id).set(putDatas);
          } else {
            this.ref.child(this.currentUser.user_id).child(chapter.id).update(putDatas);
          }
        });
        observer.next(true);
        observer.complete();
      });
    });
  }

  public delete(id: string): Observable<boolean> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.ref.child(this.currentUser.user_id).child(id).remove(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }

  private getAll(): Observable<Chapter[]> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.ref.on('value', resp => {
          let returnArr = null;
          resp.forEach(childSnapshot => {
            let item = childSnapshot.val();
            if (childSnapshot.key == this.currentUser.user_id) {
              returnArr = childSnapshot.val();
            }
            console.log(returnArr);
          });
          observer.next(returnArr);
          observer.complete();
        });
      });
  });
}

  public getByStoryId(story_id: string): Observable<Chapter[]> {
    return Observable.create(observer => {
      this.getAll().subscribe(res => {
        this.chapters = [];
        if (res != null) {
          Object.keys(res).forEach(key => {
            if (res[key]["story_id"] == story_id) {
              let chap = new Chapter(
                res[key]["id"],
                res[key]["story_id"],
                res[key]["name"],
                res[key]["description"],
                res[key]["type"],
                res[key]["start"],
                res[key]["end"],
                res[key]["informations"],
                res[key]["children"],
                res[key]["order"],
                res[key]["level"],
                res[key]["progression"],
                res[key]["write"],
                res[key]["i_parent"]
                );
              this.chapters.push(chap);
            }
          });
        }
        console.log(this.chapters);
        observer.next(this.chapters);
        observer.complete();
      });
    })
  }
}
