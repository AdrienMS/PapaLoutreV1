import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { InformationsChapterComponent } from '../informations-chapter/informations-chapter.component';

@Component({
  selector: 'app-information-popover',
  templateUrl: './information-popover.component.html',
  styleUrls: ['./information-popover.component.scss']
})
export class InformationPopoverComponent implements OnInit {
  chapIndex: number;
  parent: InformationsChapterComponent;

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.chapIndex = this.navParams.get('index');
    this.parent = this.navParams.get('parent');
  }

  onEdit() {
    this.parent.editInfo(this.chapIndex);
    this.dismiss();
  }

  onDelete() {
    this.parent.deleteInfo(this.chapIndex);
    this.dismiss();
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
