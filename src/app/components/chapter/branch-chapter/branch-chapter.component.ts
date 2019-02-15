import { Component, OnInit } from '@angular/core';
import { Directive, Input, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { DomController, PopoverController, NavController, Events } from '@ionic/angular';

import { ChapterActionPopoverComponent } from '../chapter-action-popover/chapter-action-popover.component';

import { ChapterPage } from '../../../pages/chapter/chapter.page';

import { Chapter } from '../../../models/chapter';
import { Information } from '../../../models/informations';

@Component({
  selector: 'app-branch-chapter',
  templateUrl: './branch-chapter.component.html',
  styleUrls: ['./branch-chapter.component.scss']
})
export class BranchChapterComponent implements OnInit {
  @Input("chapter") chapter: Chapter;
  @Input("root") root: ChapterPage;
  @Output('selectChapter') selectedChapter: EventEmitter<Chapter> = new EventEmitter();

  private value: number = null;

  private group: {id: string, isShow: boolean}[] = [];

  constructor(
    public element: ElementRef,
    public renderer: Renderer,
    public domCtrl: DomController,
    private popoverController: PopoverController,
    private navCtrl: NavController,
    private events: Events) {
      /*events.subscribe('reorder', value => {
        this.value = value[0].level;
      });*/
    }

  ngOnInit() {
    this.initTreeView();
  }

  private initTreeView() {
    this.group = [];
    this.chapter.children.forEach(child => {
      this.group.push({id: child.id, isShow: false});
    });
  }

  private clickToggle(index: number) {
    if (this.group[index].isShow) {
      this.group[index].isShow = false;
    } else  {
      this.group[index].isShow = true;
    }
  }

  private changeSelectedChapter(chapter: Chapter) {
    this.selectedChapter.emit(chapter);
  }

  public addUnderChapter(indexChap: number[]) {
    this.root.addUnderChapter(indexChap);
  }

  public deleteChapter(indexChap: number[]) {
    this.root.deleteChapter(indexChap);
  }

  /*private reorderChildren(ev) {
    //console.log("child", ev);
    console.log(this.value);
    if (this.value == null) {
      let d = new Date();
      let itemToMove = this.chapter.children.splice(ev.detail.from, 1)[0];
      this.chapter.children.splice(ev.detail.to, 0, itemToMove);
      ev.detail.complete();
      //console.log(d.getMilliseconds());
      this.events.publish('reorder', [{level: this.chapter.level}]);
    } else {
      this.value = null;
    }
  }*/

  async presentPopover(ev: any, index) {
    const popover = await this.popoverController.create({
      component: ChapterActionPopoverComponent,
      componentProps: {index: index, parent: this},
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
