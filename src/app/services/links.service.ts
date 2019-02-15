import { Observable } from 'rxjs/Observable';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';

import { AuthService } from './auth.service';

import { User } from '../models/user'
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  public ref: firebase.database.Reference;
  public currentUser: User;
  private info: any[] = [];

  constructor(
    private db: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private auth: AuthService
  ) {
    this.getLinks();
  }

  private getLinks() {
    return Observable.create(observer => {
      this.ref = firebase.database().ref('links/');
      this.ref.on('value', resp => {
        this.info = [];
        let returnArr = [];
        resp.forEach(childSnapshot => {
          let item = childSnapshot.val();
          let container = {
            key: childSnapshot.key,
            datas: childSnapshot.val()
          };
          returnArr.push(container);
        });
        this.info = returnArr;
        observer.next(returnArr);
        observer.complete();
      });
    });
  }

  public createLink(credentials, datas, story_id, idLink = null) {
    return Observable.create(observer => {
      this.ref = firebase.database().ref("links");
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        let id = null;
        if (idLink != null) {
          id = idLink;
        } else {
          id = new Date().getTime().toString();
        }
        let putDatas = {
          id: id,
          firstCharacter: credentials.firstCharacter,
          secondCharacter: credentials.secondCharacter,
          story_id: story_id,
          informations: datas
        };

        this.ref.push();
        if (idLink === null) {
          this.ref.child(this.currentUser.user_id).child(id).set(putDatas);
        } else {
          this.ref.child(this.currentUser.user_id).child(id).update(putDatas);
        }
        observer.next(true);
        observer.complete();
      });
    });
  }

  public getLinksFromStory(id_story: string) {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.ref = firebase.database().ref('links/');
        this.ref.on('value', resp => {
          this.info = [];
          let returnArr = [];
          resp.forEach(childSnapshot => {
            let item = childSnapshot.val();
            let container = {
              key: childSnapshot.key,
              datas: childSnapshot.val()
            };
            returnArr.push(container);
          });
          this.info = returnArr;
          let allLinks = this.getUserLink();
          let storyCharacters = [];
          observer.next(this.getAllLinks(allLinks, id_story));
          observer.complete();
        });
      });
    });
  }

  public getLinksType(id_story) {
    return Observable.create(observer => {
      this.getLinks().subscribe(res => {
        if (res.length > 0) {
          let datas = res[0].datas["LinksTypeInfo"];
          let returnArr = datas[id_story];
          observer.next(returnArr);
          observer.complete();
        } else {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  public setLinksType(credentials, id_story, isSet: boolean) {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.ref = firebase.database().ref('links/');
  
        this.ref.push();
        if (!isSet) {
          this.ref.child(this.currentUser.user_id).child("LinksTypeInfo").child(id_story).set(credentials);
        } else {
          this.ref.child(this.currentUser.user_id).child("LinksTypeInfo").child(id_story).update(credentials);
        }
        observer.next(true);
        observer.complete();
      });
    });
  }

  private getAllLinks(links, id_story) {
    if (links == null) {
      return null;
    }
    let keys = Object.keys(links);
    let returnedDatas = [];
    for(let i = 0; i < keys.length; i += 1) {
      if (links[keys[i]].story_id == id_story) {
        returnedDatas.push(links[keys[i]])
      }
    }
    return returnedDatas;
  }

  private getUserLink(): any[] {
    for (let i = 0; i < this.info.length; i += 1) {
      if (this.info[i].key == this.currentUser.user_id) {
        return this.info[i].datas;
      }
    }
    return null;
  }
}
