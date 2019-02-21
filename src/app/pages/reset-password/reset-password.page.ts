import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  private email: string = "";

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private toast: ToastController
  ) { }

  ngOnInit() {
  }

  private async resetPassword() {
    await this.presentLoading();
    this.authService.resetPassword(this.email).subscribe(res => {
      if (res) {
        this.presentToast("Un email vous à été envoyé");
      } else {
        this.presentToast("L'adresse mail est incorrect ou n'est pas connu");
      }
      this.destroyLoading();
    });
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      translucent: true,
      spinner: "crescent"
    });
    return await loading.present();
  }

  private async destroyLoading() {
    this.loadingController.dismiss();
  }

  private async presentToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
