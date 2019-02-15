import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { StoriesService } from './../../services/stories.service';

@Component({
  selector: 'app-history-dashboard',
  templateUrl: './history-dashboard.page.html',
  styleUrls: ['./history-dashboard.page.scss'],
})
export class HistoryDashboardPage implements OnInit {
  id: string = null;
  storyInformation = null;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private storiesService: StoriesService,
    private events: Events
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('key');
    this.storiesService.getStoryInfoFromKey(this.id).subscribe(
      res => {
        this.storyInformation = res;
        this.events.publish('selectedStory', res);
      },
      err => {
        console.log(err);
      }
    );
  }

}
