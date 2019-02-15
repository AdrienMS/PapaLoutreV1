import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

import { Firebase } from '@ionic-native/firebase/ngx';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorageModule, AngularFireStorage } from 'angularfire2/storage';

import { DragulaModule } from 'ng2-dragula';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FcmService } from './services/fcm.service';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

import { AbsoluteDragDirective } from './directives/absolute-drag.directive';
import { CharacterPopoverComponent } from './components/character-popover/character-popover.component';
import { PlacePopoverComponent } from './components/place/place-popover/place-popover.component';
import { ChapterActionPopoverComponent } from './components/chapter/chapter-action-popover/chapter-action-popover.component';
import { InformationPopoverComponent } from './components/chapter/information-popover/information-popover.component';

@NgModule({
  declarations: [AppComponent, CharacterPopoverComponent, PlacePopoverComponent, ChapterActionPopoverComponent, InformationPopoverComponent],
  entryComponents: [CharacterPopoverComponent, PlacePopoverComponent, ChapterActionPopoverComponent, InformationPopoverComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    DragulaModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    FileChooser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Firebase,
    AngularFireAuth,
    AngularFireDatabase,
    AngularFireStorage,
    FcmService,
    AuthService
  ],
  bootstrap: [AppComponent],
  exports: [CharacterPopoverComponent, PlacePopoverComponent, ChapterActionPopoverComponent, InformationPopoverComponent]
})
export class AppModule {}
