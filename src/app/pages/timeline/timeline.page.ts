import { Component, OnInit } from '@angular/core';
import { ToastController, DomController, Events, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TimelineEvent, TimelinePeriod, TimelineDate, TimelineOption } from '../../models/timeline';
import { CDate } from '../../models/cdate';

import { TimelineService } from '../../services/timeline.service';
import { StoriesService } from '../../services/stories.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {
  private story_id: string;
  private storyInformation;
  private option: TimelineOption = new TimelineOption(null,null,0,"");
  private t_events: TimelineEvent[] = [];
  private t_periods: TimelinePeriod[] = [];
  private min_date: CDate = null;
  private max_date: CDate = null;
  private timeline_values: string[] = [];
  private new_option: TimelineOption = new TimelineOption(null,null,0,"");

  constructor(
    private timelineService: TimelineService,
    private storiesService: StoriesService,
    private events: Events,
    private route: ActivatedRoute,
    private navCtrl: NavController) {
      this.initialise();
    /*events.subscribe('currentUser', value => {
      this.initialise();
    });*/
  }

  ngOnInit() {
    this.story_id = this.route.snapshot.paramMap.get('key');
    this.storiesService.getStoryInfoFromKey(this.story_id).subscribe(
      res => {
        this.storyInformation = res;
        this.events.publish('selectedStory', res);
      },
      err => {
        console.log(err);
      }
    );
    this.initialise();
  }

  //initialise functions
  private initialise() {
    this.timelineService.getOptionFromStory(this.story_id).subscribe(res => {
      if (res == null) {
        this.newOption();
      } else {
        this.option = new TimelineOption(res.id, res.story_id, res.scale, res.date_format);
      }
      this.new_option = new TimelineOption(this.option.id, this.option.story_id, this.option.scale, this.option.date_format);
      //console.log(this.option);
    });
    this.timelineService.getEventsFromStory(this.story_id).subscribe(res => {
      this.t_events = res;
      //console.log(res);
    });
    this.timelineService.getPeriodsFromStory(this.story_id).subscribe(res => {
      this.t_periods = res;
      //console.log(res);
      this.defineTimeline();
    });
  }

  private newOption() {
    this.option = new TimelineOption(
      null,
      this.story_id,
      1,
      "year"
    );
  }

  //timeline functions
  private defineTimeline() {
    this.calcMinAndMax();
    this.timeline_values = [];
    if (this.option.date_format == 'year') {
      for (let i = this.min_date.year; i <= this.max_date.year; i += this.option.scale) {
        if (i > this.max_date.year) {
          this.timeline_values.push(this.max_date.year.toString());
        } else {
          this.timeline_values.push(i.toString());
        }
      }
    }
  }

  private getStyleValue(index: number) {
    let max_width = this.max_date.getDays() - this.min_date.getDays();
    let one_value = (((max_width / this.timeline_values.length) * 100) / max_width) * this.option.scale;let window_width = window.innerWidth;

    let window_height = window.innerHeight;
    if (window_width >= window_height) {
      return {
        'width': one_value + 'vw',
        'left': (one_value * index) + 'vw',
        'height': '100%',
        'border-left': '1px dashed black',
        'border-right': '1px dashed black',
      }
    } else {
      return {
        'height': one_value + 'vh',
        'top': (one_value * index) + 'vh',
        'width': '100%',
        'border-top': '1px dashed black',
        'border-bottom': '1px dashed black',
      }
    }
  }

  private calcMinAndMax() {
    this.t_periods.forEach(period => {
      let item_min_value = new CDate(period.start.year, period.start.month, period.start.day);
      let item_max_value = new CDate(period.end.year, period.end.month, period.end.day);

      if (this.min_date == null) {
        this.min_date = item_min_value;
        this.max_date = item_max_value;
      } else {
        if (this.min_date.getDays() > item_min_value.getDays()) {
          this.min_date = item_min_value;
        }
  
        if (this.max_date.getDays() < item_max_value.getDays()) {
          this.max_date = item_max_value;
        }
      }
    });

    this.t_events.forEach(event => {
      let item_value = new CDate(event.start.year, event.start.month, event.start.day);

      if (this.min_date == null) {
        this.min_date = item_value;
        this.max_date = item_value;
      } else {
        if (this.min_date.getDays() > item_value.getDays()) {
          this.min_date = item_value;
        }

        if (this.max_date.getDays() < item_value.getDays()) {
          this.max_date = item_value;
        }
      }
    });
  }

  //Event functions
  /*private positionningEvents(event: {top: string, left: string, width: string, index: number}) {

  }*/


  //Option functions
  private displayModifyOption() {
    let block = document.getElementById("modify_option");
    block.classList.add("show");
  }

  private cancelOption() {
    let block = document.getElementById("modify_option");
    block.classList.remove("show");
  }

  private saveOption() {
    this.timelineService.saveOption(this.new_option).subscribe(res => {
      this.option.id = res;
      this.cancelOption();
      this.initialise();
    },
    err => {
      console.log(err);
    });
  }

  private applyModificationsOption() {
    this.timelineService.saveOption(this.new_option).subscribe(res => {
      this.cancelOption();
      this.initialise();
    },
    err => {
      console.log(err);
    });
  }
}
