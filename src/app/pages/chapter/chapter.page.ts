import { Component, OnInit, HostListener } from '@angular/core';
import { Events, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { ChapterActionPopoverComponent } from '../../components/chapter/chapter-action-popover/chapter-action-popover.component';

import { LoginPage } from '../login/login.page';

import { CharactersService } from './../../services/characters.service';
import { StoriesService } from '../../services/stories.service';
import { ChapterService } from '../../services/chapter.service';
import { TimelineService } from '../../services/timeline.service';

import { TimelineEvent, TimelinePeriod } from './../../models/timeline';
import { TimelineDate } from '../../models/timeline';
import { Chapter } from '../../models/chapter';
import { Information } from '../../models/informations';
import { characterSheet, FirebaseDatasCharacters, SearchData, FieldCharacter } from '../../models/character';
import { CDate } from '../../models/cdate';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
})
export class ChapterPage implements OnInit {
  private storyInformation = null;
  public chapters: Chapter[] = [];
  public selectedChapter: Chapter = null;
  private story_id: string;
  private root: ChapterPage = this;
  private isSynchronize: boolean = true;
  private isMobile: boolean = false;
  private screenSize: number;
  private isOpenChapter: boolean = false;
  private isOpenInformations: boolean = false;
  private t_events: TimelineEvent[] = [];
  private t_periods: TimelinePeriod[] = [];
  
  //tree view variables
  private group: {id: string, isShow: boolean}[] = [];

  //characters variables
  private characters: FirebaseDatasCharacters[] = [];

  //tinyMce variables
  public tinyMceSettings = {
    plugins : ["textcolor link code searchreplace paste visualchars charmap table fullscreen preview"],
    relative_urls : false,
    remove_script_host : false,
    toolbar1 : "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | formatselect fontselect fontsizeselect",
    toolbar2 : "paste pastetext searchreplace | bullist numlist | outdent indent | undo redo | link unlink anchor code",
    toolbar3 : "forecolor backcolor | table | hr removeformat visualchars | subscript superscript | charmap preview | fullscreen",
    menubar: false,
    min_height: (window.innerHeight - 80),
    max_height: (window.innerHeight - 80)
  };

  constructor(
    private events: Events,
    private charactersService: CharactersService,
    private storiesService: StoriesService,
    private chapterService: ChapterService,
    private timelineService: TimelineService,
    private route: ActivatedRoute,
    private popoverController: PopoverController) {
    /*events.subscribe('reorder', value => {
      this.value = value[0].level;
    });*/
    /*events.subscribe('currentUser', value => {
      this.initialise();
    });*/
    this.initialise();
  }

  ngOnInit() {
    this.initialise();
    window.setInterval(this.doSynchronize, 600000, this);
  }

  private changeView() {
    if (this.isMobile) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  private initialise() {
    this.onResize(null);
    this.story_id = this.route.snapshot.paramMap.get('story_id');
    this.storiesService.getStoryInfoFromKey(this.story_id).subscribe(
      res => {
        this.storyInformation = res;
        this.events.publish('selectedStory', res);
      },
      err => {
        console.log(err);
      }
    );
    this.timelineService.getEventsFromStory(this.story_id).subscribe(res => {
      this.t_events = res;
    });
    this.timelineService.getPeriodsFromStory(this.story_id).subscribe(res => {
      this.t_periods = res;
    });
    this.charactersService.getCharactersFromStory(this.story_id).subscribe(res => {
      this.characters = res;
    });
    this.chapterService.getByStoryId(this.story_id).subscribe(res => {
      console.log(res);
      this.chapters = res;
      this.initTreeView();
      this.selectedChapter = this.chapters[0];
      console.log(this.chapters);
    },
    err => {
      console.log(err);
    });
  }

  public editData() {
    this.isSynchronize = false;
  }

  private synchronize() {
    console.log(this.chapters);
    this.chapterService.save(this.chapters).subscribe(res => {
      this.isSynchronize = true;
    },
    err => {
      console.log(err);
    });
  }

  private doSynchronize(parent: ChapterPage) {
    parent.synchronize();
  }

  /*private reorderItems(ev) {
    if (this.value == null) {
      //console.log("chapter", ev);
      let d = new Date();
      let itemToMove = this.chapters.splice(ev.detail.from, 1)[0];
      this.chapters.splice(ev.detail.to, 0, itemToMove);
      ev.detail.complete();
      //console.log(d.getMilliseconds())
    } else {
      this.value = null;
    }
  }*/

  /*private save() {
    console.log(this.chapters);
  }*/

  //tree view functions
  private initTreeView() {
    this.group = [];
    this.chapters.forEach(chapter => {
      this.group.push({id: chapter.id, isShow: false});
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
    this.selectedChapter = chapter;
  }

  private calcMinAndMax(): {min: CDate, max: CDate} {
    let min_date: CDate = null;
    let max_date: CDate = null;

    this.t_periods.forEach(period => {
      let item_min_value = new CDate(period.start.year, period.start.month, period.start.day);
      let item_max_value = new CDate(period.end.year, period.end.month, period.end.day);

      if (min_date == null) {
        min_date = item_min_value;
        max_date = item_max_value;
      } else {
        if (min_date.getDays() > item_min_value.getDays()) {
          min_date = item_min_value;
        }
  
        if (max_date.getDays() < item_max_value.getDays()) {
          max_date = item_max_value;
        }
      }
    });

    this.t_events.forEach(event => {
      let item_value = new CDate(event.start.year, event.start.month, event.start.day);

      if (min_date == null) {
        min_date = item_value;
        max_date = item_value;
      } else {
        if (min_date.getDays() > item_value.getDays()) {
          min_date = item_value;
        }

        if (max_date.getDays() < item_value.getDays()) {
          max_date = item_value;
        }
      }
    });

    return {min: min_date, max: max_date};
  }

  private addChapter() {
    let start_date = {format: "YYYY", year: 0, month: 0, day: 0};
    let end_date = {format: "YYYY", year: 0, month: 0, day: 0};
    if (this.chapters != null && this.chapters.length > 0) {
      let prev_chap = this.chapters[this.chapters.length - 1];
      start_date = {format: prev_chap.start.format, year: prev_chap.start.year, month: prev_chap.start.month, day: prev_chap.start.day};
      end_date = {format: prev_chap.end.format, year: prev_chap.end.year, month: prev_chap.end.month, day: prev_chap.end.day};
    } else {
      let min_and_max = this.calcMinAndMax();
      if (min_and_max.min != null) {
        start_date = {format: "YYYY", year: min_and_max.min.year, month: min_and_max.min.month, day: min_and_max.min.day};
        end_date = {format: "YYYY", year: min_and_max.min.year, month: min_and_max.min.month, day: min_and_max.min.day};
      }
    }
    let chap = new Chapter(
      null,
      this.story_id,
      "Chapitre " + (this.chapters.length + 1).toString(),
      "",
      "chapter",
      start_date,
      end_date,
      null,
      null,
      1,
      0,
      0,
      "",
      null
    );
    if (this.chapters != null && this.chapters.length == 0) {
      this.selectedChapter = this.chapters[0];
    } else {
      this.chapters.push(chap);
    }
    this.initTreeView();
    this.isSynchronize = false;
  }

  public addUnderChapter(index: number[]) {
    let datas = this.getChapterAndLenght(index);
    index.push(datas.lenght);

    let chap = new Chapter(
      null,
      this.story_id,
      "Sous Chapitre " + (datas.lenght + 1).toString(),
      "",
      "chapter",
      {format: datas.chap.start.format, year: datas.chap.start.year, month: datas.chap.start.month, day: datas.chap.start.day},
      {format: datas.chap.end.format, year: datas.chap.end.year, month: datas.chap.end.month, day: datas.chap.end.day},
      null,
      null,
      1,
      0,
      0,
      "",
      index
    );
    if (datas.chap.children == null) {
      datas.chap.children = [];
    }
    datas.chap.children.push(chap);
    this.initTreeView();
    this.isSynchronize = false;
  }

  public deleteChapter(index: number[]) {
    console.log(index);
    if (index.length == 1) {
      this.chapterService.delete(this.chapters[index[0]].id).subscribe(res => {
        if (res) {
          console.log("ok");
        } else {
          console.log("error");
        }
        if (this.chapters.length == 0) {
          this.selectedChapter = null;
        }
        this.chapters.splice(index[0], 1);
        this.initTreeView();
        this.isSynchronize = false;
      });
    } else {
      let to_delete = index.pop();
      let datas = this.getChapterAndLenght(index);
      datas.chap.children.splice(to_delete, 1);
      if (this.chapters.length == 0) {
        this.selectedChapter = null;
      }
      this.initTreeView();
      this.isSynchronize = false;
    }
  }

  private getChapterAndLenght(index: number[]): {chap: Chapter, lenght: number} {
    let r_chap = this.chapters[index[0]];
    let lenght = 0;
    if (r_chap.children != null) {
      lenght = r_chap.children.length;
    }
    for (let i = 1; i < index.length; i += 1) {
      r_chap = r_chap.children[index[i]];
      if (r_chap.children != null) {
        lenght = r_chap.children.length;
      } else {
        lenght = 0;
      }
    }
    return {chap: r_chap, lenght: lenght};
  }

  private openChapterPanel() {
    let block = document.getElementById("chapters_panel");
    block.classList.add("open");
    this.isOpenChapter = true;
    let buttonBlock = document.getElementById("panel_left");
    buttonBlock.style.left = "269px";

    this.isOpenInformations = false;
    buttonBlock = document.getElementById("panel_right");
    buttonBlock.style.right = "1vw";
  }
    

  private closeChapterPanel() {
    let block = document.getElementById("chapters_panel");
    block.classList.remove("open");
    this.isOpenChapter = false;
    let buttonBlock = document.getElementById("panel_left");
    buttonBlock.style.left = "1vw";
  }

  private openInformationsPanel () {
    let block = document.getElementById("chapters_panel");
    block.classList.remove("open");
    this.isOpenChapter = false;
    let buttonBlock = document.getElementById("panel_left");
    buttonBlock.style.left = "1vw";

    buttonBlock = document.getElementById("panel_right");
    buttonBlock.style.right = "269px";
    this.isOpenInformations = true;
  }

  private closeInformationsPanel() {
    this.isOpenInformations = false;
    let buttonBlock = document.getElementById("panel_right");
    buttonBlock.style.right = "1vw";
  }

  async presentPopover(ev: any, index: number[]) {
    const popover = await this.popoverController.create({
      component: ChapterActionPopoverComponent,
      componentProps: {index: index, parent: this},
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSize = window.innerWidth;
    if (this.screenSize <= 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    //this.changeView();
  }
}
