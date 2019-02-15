import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

//import { NotLoggedHeaderComponent } from '../../components/not-logged-header/not-logged-header.component';

import { LogisterPage } from './logister.page';

const routes: Routes = [
  {
    path: '',
    component: LogisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LogisterPage,
    //NotLoggedHeaderComponent
  ]
})
export class LogisterPageModule {}
