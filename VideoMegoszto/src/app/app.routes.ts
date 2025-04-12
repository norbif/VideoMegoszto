import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VideosComponent } from './pages/videos/videos.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { VideoViewerComponent } from './pages/videos/video-viewer/video-viewer.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'videos',
        component: VideosComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'videos/:id',
        component: VideoViewerComponent
    },
    {
        path: '**',
        redirectTo: 'home'  
    }

];
