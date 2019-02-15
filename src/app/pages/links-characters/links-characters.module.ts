import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ColorPickerModule } from 'ngx-color-picker';

import { LinksCharactersPage } from './links-characters.page';

import { DragulaModule } from 'ng2-dragula';
import { AbsoluteDragDirective } from '../../directives/absolute-drag.directive';

const routes: Routes = [
  {
    path: '',
    component: LinksCharactersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DragulaModule,
    ColorPickerModule
  ],
  declarations: [LinksCharactersPage, AbsoluteDragDirective]
})
export class LinksCharactersPageModule {}
