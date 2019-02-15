import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddTimelinePeriodPage } from './add-timeline-period.page';

const routes: Routes = [
  {
    path: '',
    component: AddTimelinePeriodPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddTimelinePeriodPage]
})
export class AddTimelinePeriodPageModule {}
