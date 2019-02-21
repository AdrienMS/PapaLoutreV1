import { TimelineService } from './../../../services/timeline.service';
import { Component, OnInit } from '@angular/core';
import { Directive, Input, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { DomController, PopoverController, NavController } from '@ionic/angular';

import { TimelineEvent, TimelinePeriod, TimelineDate, TimelineOption } from '../../../models/timeline';
import { Chapter } from '../../../models/chapter';
import { CDate } from '../../../models/cdate';
import { Time } from '@angular/common';

@Component({
  selector: 'app-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss']
})
export class TimelineEventComponent implements OnInit {
  @Input('event_id') id_event: number;
  @Input('allEvent') all_events: TimelineEvent[];
  @Input('allPeriod') all_periods: TimelinePeriod[];
  @Input('allChapter') all_chapters: Chapter[];
  @Input('option') option: TimelineOption;

  private t_event: TimelineEvent;

  private min_date: CDate = null;
  private max_date: CDate = null;

  private date_period: CDate = null;

  private line: number = 1;

  private left: number = null;
  private top: number = null;

  constructor(
    public element: ElementRef,
    public renderer: Renderer,
    public domCtrl: DomController,
    private popoverController: PopoverController,
    private navCtrl: NavController,
    private timelineService: TimelineService) { }

  ngOnInit() {
    this.t_event = this.all_events[this.id_event];
    this.date_period = new CDate(this.t_event.start.year, this.t_event.start.month, this.t_event.start.day);
    console.log("date period:" + this.date_period.getDays());

    this.min_date = this.date_period;
    this.max_date = this.date_period;

    this.calcMinAndMax();

    this.calcPosLeft();

    this.calcPosTop();
  }

  private calcMinAndMax() {
    this.all_periods.forEach(period => {
      let item_min_value = new CDate(period.start.year, period.start.month, period.start.day);
      let item_max_value = new CDate(period.end.year, period.end.month, period.end.day);

      console.log(this.min_date.getDays(), item_min_value.getDays());
      if (this.min_date.getDays() > item_min_value.getDays()) {
        this.min_date = item_min_value;
      }

      if (this.max_date.getDays() < item_max_value.getDays()) {
        this.max_date = item_max_value;
      }
    });

    this.all_events.forEach(event => {
      let item_value = new CDate(event.start.year, event.start.month, event.start.day);

      console.log(this.min_date.getDays(), item_value.getDays());
      if (this.min_date.getDays() > item_value.getDays()) {
        this.min_date = item_value;
      }

      if (this.max_date.getDays() < item_value.getDays()) {
        this.max_date = item_value;
      }
    });

    this.all_chapters.forEach(chapter => {
      let item_min_value = new CDate(chapter.start.year, chapter.start.month, chapter.start.day);
      let item_max_value = new CDate(chapter.end.year, chapter.end.month, chapter.end.day);

      console.log(this.min_date.getDays(), item_min_value.getDays());
      if (this.min_date.getDays() > item_min_value.getDays()) {
        this.min_date = item_min_value;
      }

      if (this.max_date.getDays() < item_max_value.getDays()) {
        this.max_date = item_max_value;
      }

      if (chapter.children != null && chapter.children.length > 0) {
        this.clacMinAdnMaxChild(chapter);
      }
    });
    this.min_date.day = 1;
    this.min_date.month = 1;
    this.max_date.day = 31;
    this.max_date.month = 12;
    console.log("min_date:" + this.min_date.getDays());
    console.log("max_date:" + this.max_date.getDays());
  }

  private clacMinAdnMaxChild(chapter) {
    chapter.children.forEach(child => {
      let item_min_value = new CDate(child.start.year, child.start.month, child.start.day);
      let item_max_value = new CDate(child.end.year, child.end.month, child.end.day);

      console.log(this.min_date.getDays(), item_min_value.getDays());
      if (this.min_date.getDays() > item_min_value.getDays()) {
        this.min_date = item_min_value;
      }

      if (this.max_date.getDays() < item_max_value.getDays()) {
        this.max_date = item_max_value;
      }

      if (child.children != null && child.children.length > 0) {
        this.clacMinAdnMaxChild(child);
      }
    });
  }

  private calcPosLeft() {
    this.left = ((this.date_period.getDays() - this.min_date.getDays()) * 100) / (this.max_date.getDays() - this.min_date.getDays()) * this.option.scale;
  }

  private calcPosTop() {
    this.all_periods.forEach(period => {
      let item_value = new CDate(period.end.year, period.end.month, period.end.day);
      if (item_value.getDays() < this.date_period.getDays()) {
        this.line += 1;
      }
    });
    this.all_chapters.forEach(chapter => {
      let item_value = new CDate(chapter.start.year, chapter.start.month, chapter.start.day);
      if (item_value.getDays() < this.date_period.getDays()) {
        this.line += 1;
      }
    });
    this.top = (this.line * 20);
  }

  private getStyleEvent() {
    let window_width = window.innerWidth;
    let window_height = window.innerHeight;
    if (window_width >= window_height) {
      return {
        'top': (this.top + 5) + 'px',
        'left': (this.left - ((window.innerWidth / 1500))) + 'vw'
      }
    } else {
      return {
        'left': (this.top + 5) + 'px',
        'top': (this.left - ((window.innerHeight / 1500))) + 'vh'
      }
    }
  }

  private getStyleCard() {
    let top = 0;
    let window_width = window.innerWidth;
    let window_height = window.innerHeight;
    if (window_width >= window_height) {
      let left = 0;
      if (this.left > (10000 / window.innerWidth)) {
        left = -100
      }
      return {
        'left': left + 'px',
        'top': top + 'px'
      }
    } else {
      let left = 0;
      if (this.top > 100) {
        left = this.top
      }
      return {
        'left': top + 'px',
        'top': left + 'px'
      }
    }
  }

  private delete() {
    this.timelineService.deleteEvent(this.t_event.id).subscribe(res => {
      this.navCtrl.navigateRoot("timeline/" + this.t_event.story_id);
    });
  }

  private displayCard() {
    let block = document.getElementById("informations_"+this.t_event.id);
    if (block.classList.contains("show")) {
      block.classList.remove("show");
    } else {
      block.classList.add("show");
    }
  }

}
