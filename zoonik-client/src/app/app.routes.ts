import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

export const routes: Routes = [
  {
    path: 'video',
    component:VideoPlayerComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },

  {
    path: '',
    redirectTo: 'video',
    pathMatch: 'full'
  }
];
