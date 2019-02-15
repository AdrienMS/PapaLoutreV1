import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, Events } from '@ionic/angular';

import { UserService } from '../../services/user.service';

import { User } from '../../../models/user';

@Component({
  selector: 'app-logister',
  templateUrl: './logister.page.html',
  styleUrls: ['./logister.page.scss'],
})
export class LogisterPage implements OnInit {
  //Login variables
  private loginEmail: string = null;
  private loginPassword: string = null;

  //Register variables
  private registerEmail: string = null;
  private registerPassword: string = null;
  private registerPasswordConfirm: string = null;
  private registerName: string = null;

  //Global variables
  private loading: boolean = false;
  private currentUser: User = null;

  constructor(private userService: UserService, public toastController: ToastController, private navCtrl: NavController, public events: Events) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser != null || this.currentUser != undefined) {
      this.navCtrl.navigateForward('');
    }
    this.events.publish('logister');
  }

  private display_register() {
    let registerBlock = document.getElementById("register");
    let loginBlock = document.getElementById("login");
    let toggleBlock = document.getElementById("form_toggle");
    registerBlock.classList.add("active");
    loginBlock.classList.add("hidden");
    toggleBlock.classList.add("visible");
  }

  private hide_register() {
    let registerBlock = document.getElementById("register");
    let loginBlock = document.getElementById("login");
    let toggleBlock = document.getElementById("form_toggle");
    registerBlock.classList.remove("active");
    loginBlock.classList.remove("hidden");
    toggleBlock.classList.remove("visible");
  }

  private onClickLogin() {
    this.loading = true;
    this.loadingButton("loginButton");
    if (this.loginEmail === null || this.loginPassword === null) {
      this.loading = false;
      this.presentToastWithOptions('Veuillez remplir tous les champs.');
    }
    this.userService.login(this.loginEmail, this.loginPassword).subscribe(
      user => {
        this.stopLoadingButton("loginButton");
        if (user) {
          this.changingPage();
          this.currentUser = user;
          this.navCtrl.navigateForward('home-user');
          this.events.publish('logister');
        } else {
          this.loading = false;
          this.presentToastWithOptions('L\'email ou le mot de passe sont incorrect.');
        }
      },
      error => {
        this.loading = false;
        this.presentToastWithOptions(error);
      }
    );
  }

  private onClickRegister() {
    this.loading = true;
    this.loadingButton("registerButton");
    if (this.registerEmail === null || this.registerName === null || this.registerPassword === null || this.registerPasswordConfirm === null) {
      this.loading = false;
      this.presentToastWithOptions('Veuillez remplir tous les champs.');
      return;
    }
    if (this.registerPassword == this.registerPasswordConfirm) {
      this.userService.register(this.registerEmail, this.registerPassword, this.registerName).subscribe(
        res => {
          this.stopLoadingButton("registerButton");
          if (res) {
            this.changingPage();
            //do something
            this.navCtrl.navigateForward('confirm_register');
            this.events.publish('logister');
          } else {
            this.loading = false;
            this.presentToastWithOptions('L\'email est incorrect ou à déjà été utilisé.');
          }
        },
        error => {
          this.loading = false;
          this.presentToastWithOptions(error);
        }
      )
    } else {
      this.loading = false;
      this.presentToastWithOptions('Le mot de passe est différent.');
    }
  }

  private loadingButton(block: string) {
    let buttonBlock = document.getElementById(block);

    buttonBlock.classList.add("loading");
  }

  private stopLoadingButton(block: string) {
    let buttonBlock = document.getElementById(block);

    buttonBlock.classList.remove("loading");
  }

  private changingPage() {
    let changing_page = document.getElementById("changing_page");

    changing_page.classList.add('load');
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

}
