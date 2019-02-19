import { Observable } from 'rxjs/Observable';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';

import { AuthService } from './auth.service';

import { User } from '../models/user'
import { Place, PlacePosition, PlaceSection, PlaceInformation } from '../models/place';
import { PlaceLink, PlaceLinkInformation } from '../models/placeLink';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private refPlace: firebase.database.Reference;
  private refLink: firebase.database.Reference;
  private currentUser: User;
  private info: Place[] = [];
  private links: PlaceLink[] = [];
  private imageRef: firebase.database.Reference;
  private imageList: any[] = [];

  constructor(
    private db: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private auth: AuthService
    ) {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refPlace = firebase.database().ref('places/');
        this.refLink = firebase.database().ref('placesLinks/');
        this.getAllPlaces();
        this.getAllLinks();
        this.getImages();
      });
  }

  /*Places functions*/
  private getAllPlaces() {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        if (res == null) {
          observer.next(null);
          observer.complete();
        } else {
          this.refPlace.on('value', resp => {
            let returnArr = null;
            resp.forEach(childSnapshot => {
              let item = childSnapshot.val();
              if (childSnapshot.key == this.currentUser.user_id) {
                returnArr = childSnapshot.val();
              }
            });
            observer.next(returnArr);
            observer.complete();
          });
        }
      });
    });
  }

  public getPlacesFromStory(story_id): Observable<Place[]> {
    return Observable.create(observer => {
      this.getAllPlaces().subscribe(res => {
        this.info = [];
        if (res == null) {
          observer.next(null);
          observer.complete();
        } else {
          Object.keys(res).forEach(key => {
            this.info.push(new Place(res[key]["id"], res[key]["story_id"], res[key]["position"], res[key]["sections"]));
          });
          observer.next(this.info);
          observer.complete();
        }
      });
    })
  }

  public getPlacesFromIDAndStory(story_id: string, place_id: string): Observable<Place> {
    return Observable.create(observer => {
      this.getPlacesFromStory(story_id).subscribe(res => {
        let place: Place = null;
        for (let item of res) {
          if (item.id == place_id) {
            place = item;
          }
        }
        observer.next(place);
        observer.complete();
      });
    })
  }

  public savePlace(place: Place, story_id: string, place_id: string): Observable<string> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        let id = null;
        if (place_id != null) {
          id = place_id;
        } else {
          id = new Date().getTime().toString();
        }
        place.id = id;
        //let putDatas = place.getDatasToJSON();
        // Upload images to firebase
        for (let j = 0; j < place.sections.length; j += 1) {
          
          for (let i = 0; i < place.sections[j].informations.length; i += 1) {
            if (
              place.sections[j].informations[i].type === "file"
              && place.sections[j].informations[i].value != ""
              && typeof place.sections[j].informations[i].value != "string"
              && place.sections[j].informations[i].value != null
              ) {
                let image: File = place.sections[j].informations[i].value;
                if (image != undefined && !this.checkIfImageInStorage(image.name)) {
                  this.afStorage.upload(
                    '/places/' + this.currentUser.user_id + '/' + image.name,
                    image
                    ).then(
                    res => {
                      this.imageRef.push();
                      this.imageRef.child(this.currentUser.user_id).child(Object.keys(this.imageList).length.toString()).set({name: image.name});
                      //credentials[i].items[j].value = credentials[i].items[j].value.name;
                    },
                    err => {
                      console.log(err);
                      observer.next(false);
                      observer.complete();
                    }
                  );
                  place.sections[j].informations[i].value = place.sections[j].informations[i].value.name;
                } else {
                  place.sections[j].informations[i].value = place.sections[j].informations[i].value.name;
                }
            }
          }
          
        }
  
        let putDatas = place.getDatasToJSON();
  
        this.refPlace.push();
        if (place_id === null) {
          this.refPlace.child(this.currentUser.user_id).child(id).set(putDatas);
        } else {
          this.refPlace.child(this.currentUser.user_id).child(id).update(putDatas);
        }
  
        observer.next(id);
        observer.complete();
      });
    });
  }

  public deletePlace(id: string): Observable<boolean> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refPlace.child(this.currentUser.user_id).child(id).remove(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }

  /*Places Links functions*/
  private getAllLinks() {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refLink.on('value', resp => {
          let returnArr = null;
          resp.forEach(childSnapshot => {
            let item = childSnapshot.val();
            if (childSnapshot.key == this.currentUser.user_id) {
              returnArr = childSnapshot.val();
            }
          });
          observer.next(returnArr);
          observer.complete();
        });
      });
    });
  }

  public getLinksFromStory(story_id): Observable<PlaceLink[]> {
    return Observable.create(observer => {
      this.getAllLinks().subscribe(res => {
        if (res != null && res != undefined) {
          this.links = [];
          Object.keys(res).forEach(key => {
            this.links.push(new PlaceLink(res[key]["id"], res[key]["story_id"], res[key]["places_id"], res[key]["informations"]))
          });
          observer.next(this.links);
          observer.complete();
        } else {
          observer.next(null);
          observer.complete();
        }
      })
    });
  }

  public saveLink(link: PlaceLink, story_id: string, link_id: string): Observable<boolean> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        let id = null;
        if (link_id != null) {
          id = link_id;
        } else {
          id = new Date().getTime().toString();
        }
        //let putDatas = place.getDatasToJSON();
        // Upload images to firebase
        for (let i = 0; i < link.informations.length; i += 1) {
          if (
            link.informations[i].type === "file"
            && link.informations[i].value != ""
            && typeof link.informations[i].value != "string"
            && link.informations[i].value != null
            ) {
              if (link.informations[i].value != undefined && !this.checkIfImageInStorage(link.informations[i].value.name)) {
                let newImage = link.informations[i].value;
                this.afStorage.upload(
                  '/places/' + this.currentUser.user_id + '/' + newImage.name,
                  newImage
                  ).then(
                  res => {
                    this.imageRef.push();
                    this.imageRef.child(this.currentUser.user_id).child(Object.keys(this.imageList).length.toString()).set({name: link.informations[i].value.name});
                    //credentials[i].items[j].value = credentials[i].items[j].value.name;
                  },
                  err => {
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                  }
                );
                link.informations[i].value = link.informations[i].value.name;
              } else {
                link.informations[i].value = link.informations[i].value.name;
              }
          }
        }
  
        let putDatas = link.getDatasToJSON();
  
        this.refLink.push();
        if (link_id === null) {
          this.refLink.child(this.currentUser.user_id).child(id).set(putDatas);
        } else {
          this.refLink.child(this.currentUser.user_id).child(id).update(putDatas);
        }
  
        observer.next(id);
        observer.complete();
      });
    });
  }

  public deleteLink(id: string): Observable<boolean> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refLink.child(this.currentUser.user_id).child(id).remove(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }

  /*Global Functions*/
  checkIfImageInStorage(name: string) {
    for (let i = 0; i < this.imageList.length; i += 1) {
      if (this.imageList[i].name === name) {
        return true;
      }
    }
    return false;
  }

  private getImages() {
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

  public getImage(name: string) {
    return this.afStorage.ref("places/" + this.currentUser.user_id + "/" + name).getDownloadURL();
  }
}
