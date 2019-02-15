import { Component, OnInit } from '@angular/core';
import { Slides } from '@ionic/core/dist/collection/components/slides/slides';

@Component({
  selector: 'app-confirm-register',
  templateUrl: './confirm-register.page.html',
  styleUrls: ['./confirm-register.page.scss'],
})
export class ConfirmRegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private nextSlide() {
    let slides: Slides = document.getElementById("slides");
    slides.slideNext();
  }

}
