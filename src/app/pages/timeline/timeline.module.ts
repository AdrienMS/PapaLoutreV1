import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TimelinePage } from './timeline.page';

import { TimelineEventComponent } from '../../components/timeline/timeline-event/timeline-event.component';
import { TimelinePeriodComponent } from '../../components/timeline/timeline-period/timeline-period.component';
import { TimelineChapterComponent } from '../../components/timeline/timeline-chapter/timeline-chapter.component';

const routes: Routes = [
  {
    path: '',
    component: TimelinePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TimelinePage, TimelineEventComponent, TimelinePeriodComponent, TimelineChapterComponent]
})
export class TimelinePageModule {}
