import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';

import { AuthService } from './auth.service';

import { User } from '../models/user'
import { TimelineEvent, TimelinePeriod, TimelineDate, TimelineOption } from '../models/timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private refEvent: firebase.database.Reference;
  private refPeriod: firebase.database.Reference;
  private refOption: firebase.database.Reference;
  private currentUser: User;
  private events: TimelineEvent[] = [];
  private periods: TimelinePeriod[] = [];
  private option: TimelineOption = null;

  constructor(
    private db: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private auth: AuthService
  ) {
    this.refEvent = firebase.database().ref('timelineEvent/');
    this.refPeriod = firebase.database().ref('timelinePeriod/');
    this.refOption = firebase.database().ref('timelineOption/');
    this.auth.getCurrentUserInformations().subscribe(res => {
      console.log("timeline constructor");
      this.currentUser = res;
      this.getAllOptions();
      this.getAllEvents();
    });
  }

  //Option functions
  private getAllOptions(): Observable<{number,TimelineOption}> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refOption.on('value', resp => {
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

  public getOptionFromStory(story_id: string): Observable<TimelineOption> {
    return Observable.create(observer => {
      this.getAllOptions().subscribe(res => {
        let optionToReturn: TimelineOption = null;
        if (res != null) {
          Object.keys(res).forEach(key => {
            if (res[key].story_id == story_id) {
              optionToReturn = res[key];
            }
          });
        }
        observer.next(optionToReturn);
        observer.complete();
      });
    });
  }

  public saveOption(option: TimelineOption): Observable<string> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        let is_new: boolean = false;
        if (option.id == null) {
          option.id = new Date().getTime().toString();
          is_new = true;
        }
        this.refOption.push();
        if (is_new) {
          this.refOption.child(this.currentUser.user_id).child(option.id).set(option.getDataToJSON());
        } else {
          this.refOption.child(this.currentUser.user_id).child(option.id).update(option.getDataToJSON());
        }
        observer.next(option.id);
        observer.complete();
      });
    });
  }

  //Event functions
  private getAllEvents(): Observable<{number, TimelineEvent}> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refEvent.on('value', resp => {
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

  public getEventsFromStory(story_id: string): Observable<TimelineEvent[]> {
    return Observable.create(observer => {
      this.getAllEvents().subscribe(res => {
        let eventToReturn: TimelineEvent[] = [];
        if (res != null) {
          Object.keys(res).forEach(key => {
            eventToReturn.push(res[key]);
          });
        }
        observer.next(eventToReturn);
        observer.complete();
      });
    });
  }

  public getEventsFromIdAndStory(story_id: string, event_id: string): Observable<TimelineEvent> {
    return Observable.create(observer => {
      this.getEventsFromStory(story_id).subscribe(res => {
        let eventToReturn: TimelineEvent = null;
        res.forEach(event => {
          if (event.id == event_id) {
            eventToReturn = event;
          }
        });
        observer.next(eventToReturn);
        observer.complete();
      });
    })
  }

  public saveEvent(event: TimelineEvent): Observable<string> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        let is_new: boolean = false;
        if (event.id == null) {
          event.id = new Date().getTime().toString();
          is_new = true;
        }
        this.refEvent.push();
        if (is_new) {
          this.refEvent.child(this.currentUser.user_id).child(event.id).set(event.getDataToJSON());
        } else {
          this.refEvent.child(this.currentUser.user_id).child(event.id).update(event.getDataToJSON());
        }
        observer.next(event.id);
        observer.complete();
      });
    });
  }

  public deleteEvent(id: string): Observable<boolean> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refEvent.child(this.currentUser.user_id).child(id).remove(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }


  //Period Functions
  private getAllPeriods(): Observable<{number, TimelinePeriod}> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refPeriod.on('value', resp => {
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

  public getPeriodsFromStory(story_id: string): Observable<TimelinePeriod[]> {
    return Observable.create(observer => {
      this.getAllPeriods().subscribe(res => {
        let periodToReturn: TimelinePeriod[] = [];
        if (res != null) {
          Object.keys(res).forEach(key => {
            periodToReturn.push(res[key]);
          });
        }
        observer.next(periodToReturn);
        observer.complete();
      });
    });
  }

  public getPeriodsFromIdAndStory(story_id: string, event_id: string): Observable<TimelinePeriod> {
    return Observable.create(observer => {
      this.getPeriodsFromStory(story_id).subscribe(res => {
        let periodToReturn: TimelinePeriod = null;
        res.forEach(event => {
          if (event.id == event_id) {
            periodToReturn = event;
          }
        });
        observer.next(periodToReturn);
        observer.complete();
      });
    })
  }

  public savePeriod(period: TimelinePeriod): Observable<string> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        let is_new: boolean = false;
        if (period.id == null) {
          period.id = new Date().getTime().toString();
          is_new = true;
        }
        this.refPeriod.push();
        if (is_new) {
          this.refPeriod.child(this.currentUser.user_id).child(period.id).set(period.getDataToJSON());
        } else {
          this.refPeriod.child(this.currentUser.user_id).child(period.id).update(period.getDataToJSON());
        }
        observer.next(period.id);
        observer.complete();
      });
    });
  }

  public deletePeriod(id: string): Observable<boolean> {
    return Observable.create(observer => {
      this.auth.getCurrentUserInformations().subscribe(res => {
        this.currentUser = res;
        this.refPeriod.child(this.currentUser.user_id).child(id).remove(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }
}
