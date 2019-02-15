import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddTimelineEventPage } from './add-timeline-event.page';

const routes: Routes = [
  {
    path: '',
    component: AddTimelineEventPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddTimelineEventPage]
})
export class AddTimelineEventPageModule {}
