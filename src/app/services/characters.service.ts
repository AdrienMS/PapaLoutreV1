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

import { characterSheet, FieldCharacter, SearchData} from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  public ref: firebase.database.Reference;
  public imageRef: firebase.database.Reference;
  private storageRef: firebase.storage.Reference;
  private info: any[] = [];
  private imageList: any[] = [];
  public currentUser: User;
  private isWaiting: boolean = true;

  constructor(
    private db: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private auth: AuthService
    ) {
      this.ref = firebase.database().ref('characters/');
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
          this.imageList = returnArr;
        } else {
          this.imageList = null;
        }
      });
  }

  createCharacter(credentials: characterSheet[], story_id: string, top: number, left: number, idCharacter: string = null): Observable<boolean> {
    return Observable.create(observer => {
      this.ref = firebase.database().ref("characters");
      let id = null;
      if (idCharacter != null) {
        id = idCharacter;
      } else {
        id = new Date().getTime().toString();
      }
      let putDatas = {id: id, character: [], story_id: story_id, top: top, left: left};
      
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        // Upload images to firebase
        for (let i = 0; i < credentials.length; i += 1) {
          for (let j = 0; j < credentials[i].items.length; j += 1) {
            if (
              credentials[i].items[j].type === "file"
              && credentials[i].items[j].value != ""
              && typeof credentials[i].items[j].value != "string"
              && credentials[i].items[j].value != null
              ) {
                if (credentials[i].items[j].value != undefined && !this.checkIfImageInStorage(credentials[i].items[j].value.name)) {
                  let newImage = credentials[i].items[j].value;
                  this.afStorage.upload(
                    '/characters/' + this.currentUser.user_id + '/' + newImage.name,
                    newImage
                    ).then(
                    res => {
                      this.imageRef.push();
                      this.imageRef.child(this.currentUser.user_id).child(Object.keys(this.imageList).length.toString()).set({name: credentials[i].items[j].value.name});
                      //credentials[i].items[j].value = credentials[i].items[j].value.name;
                    },
                    err => {
                      console.log(err);
                      observer.next(false);
                      observer.complete();
                    }
                  );
                  credentials[i].items[j].value = credentials[i].items[j].value.name;
                } else {
                  credentials[i].items[j].value = credentials[i].items[j].value.name;
                }
            }
          }
          putDatas.character.push(credentials[i].getDatasToJson());
          observer.next(true);
          observer.complete();
        }
        
        // Create character to firebase
        this.ref.push();
        if (idCharacter === null) {
          this.ref.child(this.currentUser.user_id).child(id).set(putDatas);
        } else {
          this.ref.child(this.currentUser.user_id).child(idCharacter).update(putDatas);
        }
      });
    });
  }

  getCharactersFromStory(id_story: string) {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.ref = firebase.database().ref('characters/');
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
          this.getUserCharacter().subscribe(res => {
            let allCharacters = res;
            let storyCharacters = [];
            observer.next(this.getAllCharacters(allCharacters, id_story));
            observer.complete();
          });
        });
      });
    });
  }

  private getAllCharacters(characters, id_story) {
    if (characters == null) {
      return null;
    }
    let keys = Object.keys(characters);
    let returnedDatas = [];
    for(let i = 0; i < keys.length; i += 1) {
      if (characters[keys[i]].story_id == id_story) {
        returnedDatas.push(characters[keys[i]])
      }
    }
    return returnedDatas;
  }

  private getUserCharacter(): Observable<any[]> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        for (let i = 0; i < this.info.length; i += 1) {
          if (this.info[i].key == this.currentUser.user_id) {
            observer.next(this.info[i].datas);
            observer.complete();
          }
        }
        return null;
      });
    });
  }

  checkIfImageInStorage(name: string) {
    for (let i = 0; i < this.imageList.length; i += 1) {
      if (this.imageList[i].name === name) {
        return true;
      }
    }
    return false;
  }

  getImage(name: string) {
    return this.afStorage.ref("characters/" + this.currentUser.user_id + "/" + name).getDownloadURL();
  }

  deleteCharacter(id: string) {
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
}
