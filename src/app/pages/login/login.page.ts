import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, Events, LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loginError: string;

  /*email: FormControl;
  password: FormControl;*/

  validation_messages = {
    'email': [
      { type: 'required', message: 'Une adresse mail est requise.' },
      { type: 'email', message: 'Une adresse mail valide est demandé.' }
    ],
    'password': [
      { type: 'required', message: 'Un mot de passe est requis' },
      { type: 'minLength', message: 'Le mot de passe doit contenir au moins 5 caractères' },
      { type: 'pattern', message: 'Le mot de passe doit contenir au moins une miniscule, une majuscule et un chiffre' }
    ]
  }

	constructor(
		private navCtrl: NavController,
		private auth: AuthService,
    public events: Events,
    fb: FormBuilder,
    private loadingController: LoadingController
	) {
		this.loginForm = fb.group({
			email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
			password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.minLength(5)])),
    });
	}

  ngOnInit() {
  }

  async login() {
    await this.presentLoading();
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signInWithEmail(credentials)
			.then(
				() => {
          this.auth.getCurrentUserInformations().subscribe(res => {
            this.events.publish('login');
            this.destroyLoading();
            this.navCtrl.navigateForward("/profil");
          });
        },
				error => {
          console.log(error);
          this.destroyLoading();
          this.loginError = error.message;
        }
			);
  }
  
  loginWithGoogle() {
    this.presentLoading();
    this.auth.signInWithGoogle()
      .then(
        () => {
          this.events.publish('login');
          this.destroyLoading();
          this.navCtrl.navigateForward("/profil");
        },
        error => {
          console.log(error.message);
          this.loginError = error.message;
          this.destroyLoading();
        }
      );
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      translucent: true,
      spinner: "crescent"
    });
    return await loading.present();
  }

  async destroyLoading() {
    this.loadingController.dismiss();
  }

}
