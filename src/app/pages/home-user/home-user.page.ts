import { Component, OnInit } from '@angular/core';
import { Events, NavController, ToastController } from '@ionic/angular';

import { UserService } from '../../services/user.service';
import { HistoryService } from '../../services/history.service';
import { User } from '../../../models/user';
import { History } from '../../../models/history';
import { Common } from '../../../models/common';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.page.html',
  styleUrls: ['./home-user.page.scss'],
})
export class HomeUserPage implements OnInit {
  private currentUser: User = null;
  private allHistories: Array<History> = null;
  private common : Common = null;
  private selectedHistory: History = null;

  constructor(
    public events: Events,
    private userService: UserService,
    private historyService: HistoryService,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    //this.events.publish('selected-history', 'test');
    this.events.publish('logister');
    if (this.currentUser != null) {
      this.historyService.getAll(this.currentUser.token).subscribe(
        histories => {
          this.allHistories = histories;
        },
        error => {
          this.presentToastWithOptions(error);
        }
      );
    }
  }

  public selectHistory(id: number) {
    this.common = JSON.parse(localStorage.getItem("common"));
    if (this.common === null) {
      this.common = new Common();
    }
    this.common.selectedHistory = id;
    this.historyService.getById(id, this.currentUser.token).subscribe(
      history => {
        this.selectedHistory = history;
        this.events.publish('selected-history', history.name);
        this.presentCorrectToastWithOptions("Vous avez sélectionner " + history.name);
      },
      error => {
        this.presentToastWithOptions(error);
      }
    );
    localStorage.setItem('common', JSON.stringify(this.common));
  }

  async presentToastWithOptions(message: string) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'X'
    });
    toast.present();
  }

  async presentCorrectToastWithOptions(message: string) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: false,
      position: 'bottom',
      duration: 2000,
      cssClass: 'success'
    });
    toast.present();
  }

}
