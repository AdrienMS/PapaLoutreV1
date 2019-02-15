import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlacesPage } from './places.page';

import { PlaceSheetComponent } from '../../components/place/place-sheet/place-sheet.component';
import { PlaceLinkComponent } from '../../components/place/place-link/place-link.component';

const routes: Routes = [
  {
    path: '',
    component: PlacesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlacesPage, PlaceSheetComponent, PlaceLinkComponent]
})
export class PlacesPageModule {}
