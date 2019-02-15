import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { PlacesPage } from '../../../pages/places/places.page';

import { PlaceSheetComponent } from '../place-sheet/place-sheet.component';

@Component({
  selector: 'app-place-popover',
  templateUrl: './place-popover.component.html',
  styleUrls: ['./place-popover.component.scss']
})
export class PlacePopoverComponent implements OnInit {
  index: number = 0;
  parent: PlaceSheetComponent;

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.index = this.navParams.get('index');
    this.parent = this.navParams.get('parent');
  }

  onClickModify() {
    this.parent.modifyPlace();
    this.dismiss();
  }

  onClickDelete() {
    this.parent.deletePlace();
    this.dismiss();
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
