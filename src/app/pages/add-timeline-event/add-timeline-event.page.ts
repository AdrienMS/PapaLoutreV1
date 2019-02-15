import { Component, OnInit } from '@angular/core';
import { ToastController, DomController, Events, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TimelineEvent, TimelineDate, TimelineOption } from '../../models/timeline';

import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-add-timeline-event',
  templateUrl: './add-timeline-event.page.html',
  styleUrls: ['./add-timeline-event.page.scss'],
})
export class AddTimelineEventPage implements OnInit {
  private story_id;
  private event_id;
  private event: TimelineEvent = new TimelineEvent(null, null, "","","event",{format:"YYYY", year: 2019, month: 1, day: 1});

  constructor(
    private timelineService: TimelineService,
    private events: Events,
    private route: ActivatedRoute,
    private toast: ToastController,
    private navCtrl: NavController) {
      this.initialise();
    /*events.subscribe('currentUser', value => {
      this.initialise();
    });*/
    }

  ngOnInit() {
    this.story_id = this.route.snapshot.paramMap.get('story_id');
    this.event_id = this.route.snapshot.paramMap.get('event_id');
    this.initialise();
  }

  private initialise() {
    if (this.event_id != "new") {
      this.timelineService.getEventsFromIdAndStory(this.story_id, this.event_id).subscribe(res => {
        this.event = new TimelineEvent(res.id, res.story_id, res.name, res.description, res.type, res.start);
      });
    } else {
      this.event = new TimelineEvent(
        null,
        this.story_id,
        "",
        "",
        "event",
        {format: "YYYY", year: 2019, month: 1, day: 1}
      );
    }

  }

  private save() {
    if (!this.isFill()) {
      return;
    }

    this.timelineService.saveEvent(this.event).subscribe(res => {
      this.presentToast("L'évènement à été sauvegardé");
      this.navCtrl.navigateRoot("add-timeline-event/" + this.story_id + "/" + res);
    });
  }

  private cancel() {
    this.navCtrl.navigateRoot("timeline/" + this.story_id);
  }

  private applyModifications() {
    if (!this.isFill()) {
      return;
    }

    this.timelineService.saveEvent(this.event).subscribe(res => {
      this.presentToast("L'évênement à été sauvegardé");
      this.navCtrl.navigateRoot("add-timeline-event/" + this.story_id + "/" + res);
    });
  }

  private isFill(): boolean {
    if (this.event.name == "") {
      this.presentToast("Le nom n'est pas défini");
      return false;
    }

    return true;
  }

  private async presentToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
