import { TimelineService } from './../../../services/timeline.service';
import { Component, OnInit } from '@angular/core';
import { Directive, Input, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { DomController, PopoverController, NavController } from '@ionic/angular';

import { TimelineEvent, TimelinePeriod, TimelineDate, TimelineOption } from '../../../models/timeline';
import { CDate } from '../../../models/cdate';

@Component({
  selector: 'app-timeline-period',
  templateUrl: './timeline-period.component.html',
  styleUrls: ['./timeline-period.component.scss']
})
export class TimelinePeriodComponent implements OnInit {
  @Input('period_id') id_period: number;
  @Input('allEvent') all_events: TimelineEvent[];
  @Input('allPeriod') all_periods: TimelinePeriod[];
  @Input('option') option: TimelineOption;

  private t_period: TimelinePeriod;

  private min_date: CDate = null;
  private max_date: CDate = null;

  private min_date_period: CDate = null;
  private max_date_period: CDate = null;

  private line: number = 1;

  private width: number = null;
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
    this.t_period = this.all_periods[this.id_period];
    this.min_date_period = new CDate(this.t_period.start.year, this.t_period.start.month, this.t_period.start.day);
    this.max_date_period = new CDate(this.t_period.end.year, this.t_period.end.month, this.t_period.end.day);

    this.min_date = this.min_date_period;
    this.max_date = this.max_date_period;

    this.calcMinAndMax();

    this.calcWidth();

    this.calcPosLeft();

    this.calcPosTop();
  }

  private calcMinAndMax() {
    this.all_periods.forEach(period => {
      let item_min_value = new CDate(period.start.year, period.start.month, period.start.day);
      let item_max_value = new CDate(period.end.year, period.end.month, period.end.day);

      if (this.min_date.getDays() > item_min_value.getDays()) {
        this.min_date = item_min_value;
      }

      if (this.max_date.getDays() < item_max_value.getDays()) {
        this.max_date = item_max_value;
      }
    });

    this.all_events.forEach(event => {
      let item_value = new CDate(event.start.year, event.start.month, event.start.day);

      if (this.min_date.getDays() > item_value.getDays()) {
        this.min_date = item_value;
      }

      if (this.max_date.getDays() < item_value.getDays()) {
        this.max_date = item_value;
      }
    });

    this.min_date.day = 1;
    this.min_date.month = 1;
    this.max_date.day = 31;
    this.max_date.month = 12;
  }

  private calcWidth() {
    this.width = (((this.max_date_period.getDays() - this.min_date_period.getDays()) * 100) / (this.max_date.getDays() - this.min_date.getDays())) * this.option.scale;
  }

  private calcPosLeft() {
    this.left = ((this.min_date_period.getDays() - this.min_date.getDays()) * 100) / (this.max_date.getDays() - this.min_date.getDays()) * this.option.scale;
  }

  private calcPosTop() {
    this.all_periods.forEach(period => {
      let item_value = new CDate(period.start.year, period.start.month, period.start.day);
      if (item_value.getDays() < this.min_date_period.getDays()) {
        this.line += 1;
      }
    });
    this.top = (this.line * 20);
  }

  private getStylePeriod() {
    let window_width = window.innerWidth;
    let window_height = window.innerHeight;
    if (window_width >= window_height) {
      return {
        'width': this.width + 'vw',
        'top': this.top + 'px',
        'left': this.left + 'vw'
      }
    } else {
      return {
        'height': this.width + 'vh',
        'left': this.top + 'px',
        'top': this.left + 'vh'
      }
    }
  }

  private getStyleCard() {
    let top = this.top;
    let left = 0;
    let window_width = window.innerWidth;
    let window_height = window.innerHeight;
    if (window_width >= window_height) {
      if (this.left + this.width >= 100 * this.option.scale) {
        left = this.width - (200 * (100 / document.documentElement.clientWidth));
      }
      return {
        'left': left + 'vw',
        'top': top + 'px'
      }
    } else {
      if (this.left + this.width >= 100 * this.option.scale) {
        left = this.width - (200 * (100 / document.documentElement.clientHeight));
      }
      return {
        'left': top + 'px',
        'top': left + 'vh'
      }
    }
  }

  private delete() {
    this.timelineService.deletePeriod(this.t_period.id).subscribe(res => {
      this.navCtrl.navigateRoot("timeline/" + this.t_period.story_id);
    });
  }
  
  private displayCard() {
    let block = document.getElementById("informations_"+this.t_period.id);
    if (block.classList.contains("show")) {
      block.classList.remove("show");
    } else {
      block.classList.add("show");
    }
  }

}
