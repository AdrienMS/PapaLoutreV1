import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { ChapterPage } from '../../../pages/chapter/chapter.page';

@Component({
  selector: 'app-chapter-action-popover',
  templateUrl: './chapter-action-popover.component.html',
  styleUrls: ['./chapter-action-popover.component.scss']
})
export class ChapterActionPopoverComponent implements OnInit {
  chapIndex: number[];
  parent: ChapterPage;

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.chapIndex = this.navParams.get('index');
    this.parent = this.navParams.get('parent');
  }

  addChapter() {
    this.parent.addUnderChapter(this.chapIndex);
    this.dismiss();
  }

  deleteChapter() {
    this.parent.deleteChapter(this.chapIndex);
    this.dismiss();
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
