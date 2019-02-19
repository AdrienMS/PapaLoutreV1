import { Component, HostListener } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';

import { FcmService } from './services/fcm.service';
import { AuthService } from './services/auth.service';

import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public appPages = [];

  // Menu links when disconnected
  private disconnectedPages = [
    {
      title: 'Accueil',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Connexion',
      url: '/login',
      icon: 'person'
    }
  ];

  // Menu links when connected
  private connectedPages = [
    {
      title: 'Déconnexion',
      url: '/logout',
      icon: 'log-out'
    }
  ];

  // Menu links when connected and selected story
  private storyPages = [
    {
      title: 'Accueil',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Tableau de bord',
      url: '/history-dashboard/',
      icon: 'analytics'
    },
    {
      title: 'Personnages',
      url: '/links-characters/',
      icon: 'person'
    },
    {
      title: 'Lieux',
      url: '/places/',
      icon: 'map'
    },
    {
      title: 'Chronologie',
      url: '/timeline/',
      icon: 'calendar'
    },
    {
      title: 'Chapitres',
      url: '/chapter/',
      icon: 'book'
    },
    {
      title: 'Déconnexion',
      url: '/logout',
      icon: 'log-out'
    }
  ]

  private screenSize: number;
  private currentUser = null;

  private selectedStory: {} = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fcm: FcmService,
    private auth: AuthService,
    public toastCtrl: ToastController,
    public events: Events,
    private network: Network
  ) {
    //this.checkConnection();
    events.subscribe('login', () => {
      this.checkUserAuth();
    });
    events.subscribe('selectedStory', value => {
      this.selectedStory = value;
      this.checkUserAuth();
    });
    this.auth.getInfo();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkConnection();
      document.addEventListener("offline", this.offlineCallBackFunction, false);
      document.addEventListener("online", this.onlineCallBackFunction, false);
      this.screenSize = window.innerWidth;
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Get a FCM token
      this.fcm.getToken();

      // Listen to incoming messages
      this.fcm.listenToNotifications().pipe(
        tap(msg => this.initToast(msg)))
      .subscribe();
      this.checkUserAuth();
    });
  }

  checkConnection() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });
    
    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
  }

  async initToast(msg: {}) {
    // show a toast
    const toast = await this.toastCtrl.create({
      message: JSON.stringify(msg),
      duration: 3000
    });
    toast.present();
  }

  private checkUserAuth(): void {
    this.auth.afAuth.authState
    .subscribe(
      user => {
        //console.log(user);
        if (user) {
          this.appPages = this.connectedPages;
          this.auth.getCurrentUserInformations().subscribe(res => {
            this.currentUser = res;
            this.events.publish('currentUser', this.currentUser);
            if (this.selectedStory != null) {
              this.storyPages[1].url = '/history-dashboard/' + this.selectedStory["id"];
              this.storyPages[2].url = '/links-characters/' + this.selectedStory["id"];
              this.storyPages[3].url = '/places/' + this.selectedStory["id"];
              this.storyPages[4].url = '/timeline/' + this.selectedStory["id"];
              this.storyPages[5].url = '/chapter/' + this.selectedStory["id"];
              this.appPages = this.storyPages;
            }
          },
          err => {
            console.log(err);
          });
        } else {
          this.appPages = this.disconnectedPages;
          this.currentUser = null;
        }
      },
      err => {
        console.log(err);
        this.appPages = this.disconnectedPages;
        this.currentUser = null;
      }
    );
  }

  offlineCallBackFunction() {
    console.log('offline');
  }

  onlineCallBackFunction() {
    console.log('online');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSize = window.innerWidth;
  }
}
