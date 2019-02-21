import { Information } from './../../../models/informations';
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { InformationsChapterComponent } from '../informations-chapter/informations-chapter.component';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss']
})
export class FavoritesListComponent implements OnInit {
  fav: any;
  parent: InformationsChapterComponent;

  private favorites: {name: string, id: string, informations: Information[]}[] = [];

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.fav = this.navParams.get('fav');
    this.parent = this.navParams.get('parent');
    console.log(this.fav);
    if (this.fav != null) {
      Object.keys(this.fav).forEach(f => {
        this.favorites.push(this.fav[f]);
      });
    }
  }

  onClick(index: number) {
    //this.parent.saveToFavorites(this.chapter);
    console.log(index);
    this.parent.fillInformationsWithFav(this.favorites[index].informations);
    this.dismiss();
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
