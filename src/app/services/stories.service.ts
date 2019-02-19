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
export class StoriesService {
  public ref: firebase.database.Reference;
  public imageRef: firebase.database.Reference;
  private storageRef: firebase.storage.Reference;
  private info: any[] = [];
  private imageList: any[] = [];
  public currentUser: User;

  constructor(
    private db: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private auth: AuthService
    ) {
      this.ref = firebase.database().ref('stories/');
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
      });
      this.imageRef = firebase.database().ref('images/');
      this.imageRef.on('value', resp => {
        this.imageList = [];
        let returnArr = [];
        resp.forEach(childSnapshot => {
          let item = childSnapshot.val();
          let container = {
            key: childSnapshot.key,
            datas: childSnapshot.val()
          };
          returnArr.push(container);
        });
        if (returnArr != null) {
          this.imageList = returnArr[0].datas;
        } else {
          this.imageList = null;
        }
      });
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
      });
      //console.log(this.getStoriesUser());
  }

  uploadImageBrowser(imageURI: File, credentials, isModify){
    return new Promise<boolean>((resolve, reject) => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.afStorage.upload('/stories/' + this.currentUser.user_id + '/' + imageURI.name, imageURI).then(
          res => {
            this.imageRef.push();
            this.imageRef.child(this.currentUser.user_id).child(Object.keys(this.imageList).length.toString()).set({name: imageURI.name});
            this.callBackCreate(res, credentials, isModify);
            resolve(true);
          },
          err => {console.log(err); reject(err);}
        );
      });
    })
  }

  public createStories(credentials, isModify) {
    return new Promise<boolean>((resolve, reject) => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        if (credentials.image != null && credentials.image != "" && typeof(credentials.image) != "string") {
          this.uploadImageBrowser(credentials.image, credentials, isModify).then(
            res => {
              if (res) { resolve(true); }
              else { resolve(false) };
            },
            err => {console.log(err); reject(err);}
          );
        } else {
          this.callBackCreate(null, credentials, isModify);
          resolve(true);
        }
      });
    });
  }

  public callBackCreate(data: UploadTaskSnapshot, credentials, isModify) {
    let putDatas = {};
    let id = null;
    if (isModify === null) {
      id = new Date().getTime().toString();
    } else {
      id = isModify;
    }
    if (data != null && typeof(data) != "string") {
      if (data.state === "success") {
        putDatas = {title: credentials.title, description: credentials.description, img: data.metadata.name, user_id: this.currentUser.user_id, is_private: true, id: id};
      } else {
        return;
      }
    } else {
      let value = null;
      if (credentials.imgName != undefined && credentials.imgName != null) {
        value = credentials.imgName;
      } else if (typeof(credentials.image) == "string" && credentials.image != "") {
        value = credentials.image;
      }
      putDatas = {title: credentials.title, description: credentials.description, img: value, user_id: this.currentUser.user_id, is_private: true, id: id};
    }
    this.ref.push();
    if (isModify === null) {
      this.ref.child(this.currentUser.user_id).child(id).set(putDatas);
    } else {
      this.ref.child(this.currentUser.user_id).child(id).update(putDatas);
    }
    
  }

  public getStories(): Observable<any> {
    return Observable.create(observer => {
      
      this.ref = firebase.database().ref('stories/');
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
        this.getStoriesUser().subscribe(res => {
          observer.next(res);
          observer.complete();
        },
        err => {
          observer.next(null);
          observer.complete();
        });
      });
    });
  }

  private getStoriesUser() {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        for (let i = 0; i < this.info.length; i += 1) {
          if (this.info[i].key === this.currentUser.user_id) {
            observer.next(this.info[i].datas);
            observer.complete();
          }
        }
        observer.next(null);
        observer.complete();
      });
    });
  }

  private countStories(datas: {}): number {
    return Object.keys(datas).length;
  }

  public getUrlImage(name: string) {
    return this.afStorage.ref("stories/" + this.currentUser.user_id + "/" + name).getDownloadURL();
  }

  public checkIfThisNameIsPresent(name: string): boolean {
    let keys = Object.keys(this.imageList);
    for (let i = 0; i < keys.length; i += 1) {
      if (this.imageList[keys[i]].name === name) {
        return true;
      }
    }
    return false;
  }

  public getImagesList() {
    return this.imageList;
  }

  public deleteStory(id) {
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

  public getStoryInfoFromKey(key: string) {
    return Observable.create(observer => {
      this.getStories().subscribe(
        res => {
          let keys = Object.keys(res);
          for (let i = 0; i < keys.length; i += 1) {
            if (keys[i] === key) {
              observer.next(res[keys[i]]);
              observer.complete();
              break;
            }
          }
        },
        err => {
          observer.next(null);
          observer.complete();
        }
      );
    });
  }
}