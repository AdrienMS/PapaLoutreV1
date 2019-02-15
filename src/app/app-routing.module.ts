import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'logout', loadChildren: './pages/logout/logout.module#LogoutPageModule' },
  { path: 'profil', loadChildren: './pages/profil/profil.module#ProfilPageModule' },
  { path: 'history-dashboard/:key', loadChildren: './pages/history-dashboard/history-dashboard.module#HistoryDashboardPageModule' },
  { path: 'links-characters/:key', loadChildren: './pages/links-characters/links-characters.module#LinksCharactersPageModule' },
  { path: 'places/:key', loadChildren: './pages/places/places.module#PlacesPageModule' },
  { path: 'place-sheet/:story_id/:place_id', loadChildren: './pages/place-sheet/place-sheet.module#PlaceSheetPageModule' },
  { path: 'place-link/:story_id/:link_id', loadChildren: './pages/place-link/place-link.module#PlaceLinkPageModule' },
  { path: 'timeline/:key', loadChildren: './pages/timeline/timeline.module#TimelinePageModule' },
  { path: 'add-timeline-event/:story_id/:event_id', loadChildren: './pages/add-timeline-event/add-timeline-event.module#AddTimelineEventPageModule' },
  { path: 'add-timeline-period/:story_id/:period_id', loadChildren: './pages/add-timeline-period/add-timeline-period.module#AddTimelinePeriodPageModule' },
  { path: 'plot/:story_id', loadChildren: './pages/plot/plot.module#PlotPageModule' },
  { path: 'chapter/:story_id', loadChildren: './pages/chapter/chapter.module#ChapterPageModule' },
  { path: 'add-chapter/:story_id/:chapter_id', loadChildren: './pages/add-chapter/add-chapter.module#AddChapterPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
