import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
		private navCtrl: NavController,
    private auth: AuthService,
    public events: Events
  ) { }

  ngOnInit() {
    this.auth.signOut().then(
      () => this.events.publish('logister'),
      err => {console.log(err); this.events.publish('logister');}
    );
    this.navCtrl.navigateForward('home');
    this.events.publish('logister');
  }

}
