import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, Events, LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupError: string;
  form: FormGroup;
  
  validation_messages = {
    'username': [
      { type: 'required', message: 'Un pseudo est requis.'}
    ],
    'email': [
      { type: 'required', message: 'Une adresse mail est requise.' },
      { type: 'email', message: 'Une adresse mail valide est demandé.' }
    ],
    'password': [
      { type: 'required', message: 'Un mot de passe est requis.' },
      { type: 'minLength', message: 'Le mot de passe doit contenir au moins 5 caractères.' },
      { type: 'pattern', message: 'Le mot de passe doit contenir au moins une miniscule, une majuscule et un chiffre.' }
    ]
  }

	constructor(
		fb: FormBuilder,
    private navCtrl: NavController,
    private auth: AuthService,
    public events: Events,
    private loadingController: LoadingController
	) {
		this.form = fb.group({
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
			email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
			password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.minLength(5)]))
		});
  }

  ngOnInit() {
  }

  signup() {
    this.presentLoading();
		let data = this.form.value;
		let credentials = {
			email: data.email,
      password: data.password,
      username: data.username
		};
		this.auth.signUp(credentials).then(
			() => {
        this.navCtrl.navigateForward('/home');
        console.log('signup');
        this.events.publish('login');
        this.destroyLoading();
      },
			error => {
        this.signupError = error.message;
        console.log('signup error');
        this.events.publish('login');
        this.destroyLoading();
      }
		);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      translucent: true,
      spinner: "circles"
    });
    return await loading.present();
  }

  async destroyLoading() {
    this.loadingController.dismiss();
  }

}
