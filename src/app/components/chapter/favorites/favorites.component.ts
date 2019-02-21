import { Chapter } from './../../../models/chapter';
import { Information } from './../../../models/informations';
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { InformationsChapterComponent } from '../informations-chapter/informations-chapter.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  chapter: Chapter;
  parent: InformationsChapterComponent;

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.chapter = this.navParams.get('chapter');
    this.parent = this.navParams.get('parent');
  }

  onAdd() {
    this.parent.saveToFavorites(this.chapter);
    this.dismiss();
  }

  onShowFavorites() {
    this.parent.showFavorites(this.chapter);
    this.dismiss();
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
