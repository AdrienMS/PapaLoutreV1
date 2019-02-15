import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { EditorModule } from '@tinymce/tinymce-angular';

import { ChapterPage } from './chapter.page';
import { BranchChapterComponent } from '../../components/chapter/branch-chapter/branch-chapter.component';
import { InformationsChapterComponent } from '../../components/chapter/informations-chapter/informations-chapter.component';

const routes: Routes = [
  {
    path: '',
    component: ChapterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    EditorModule
  ],
  declarations: [ChapterPage, BranchChapterComponent, InformationsChapterComponent]
})
export class ChapterPageModule {}
