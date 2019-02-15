import { Component, OnInit } from '@angular/core';
import { ToastController, DomController, Events, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TimelinePeriod, TimelineDate, TimelineOption } from '../../models/timeline';

import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-add-timeline-period',
  templateUrl: './add-timeline-period.page.html',
  styleUrls: ['./add-timeline-period.page.scss'],
})
export class AddTimelinePeriodPage implements OnInit {
  private story_id;
  private period_id;
  private period: TimelinePeriod = new TimelinePeriod(null, null, "","","period",{format:"YYYY", year: 2019, month: 1, day: 1},{format:"YYYY", year: 2019, month: 1, day: 1});

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
    this.period_id = this.route.snapshot.paramMap.get('period_id');
    this.initialise();
  }

  private initialise() {
    if (this.period_id != "new") {
      this.timelineService.getPeriodsFromIdAndStory(this.story_id, this.period_id).subscribe(res => {
        this.period = new TimelinePeriod(res.id, res.story_id, res.name, res.description, res.type, res.start, res.end);
      });
    } else {
      this.period = new TimelinePeriod(
        null,
        this.story_id,
        "",
        "",
        "period",
        {format: "YYYY", year: 2019, month: 1, day: 1},
        {format: "YYYY", year: 2019, month: 1, day: 1}
      );
    }

  }

  private save() {
    if (!this.isFill()) {
      return;
    }

    this.timelineService.savePeriod(this.period).subscribe(res => {
      this.presentToast("L'évènement à été sauvegardé");
      this.navCtrl.navigateRoot("add-timeline-period/" + this.story_id + "/" + res);
    });
  }

  private cancel() {
    this.navCtrl.navigateRoot("timeline/" + this.story_id);
  }

  private applyModifications() {
    if (!this.isFill()) {
      return;
    }

    this.timelineService.savePeriod(this.period).subscribe(res => {
      this.presentToast("L'évênement à été sauvegardé");
      this.navCtrl.navigateRoot("add-timeline-period/" + this.story_id + "/" + res);
    });
  }

  private isFill(): boolean {
    if (this.period.name == "") {
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
