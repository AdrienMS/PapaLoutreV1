import { Component, OnInit } from '@angular/core';
import { Events, NavController } from '@ionic/angular';

import { UserService } from '../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private currentUser: User = null;
  private connected: boolean = false;

  constructor(private userService: UserService, public events: Events, private navCtrl: NavController) {}

  ngOnInit() {
    this.events.publish('logister');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.connected = true;
    }
    if (this.connected) {
      this.navCtrl.navigateForward('home-user');
    }
  }
}
