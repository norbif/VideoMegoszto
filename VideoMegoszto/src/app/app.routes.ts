import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VideosComponent } from './pages/videos/videos.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { VideoViewerComponent } from './pages/videos/video-viewer/video-viewer.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { VideoUploadComponent } from './pages/video-upload/video-upload.component';

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
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'videos/:id',
        component: VideoViewerComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'upload',
        component: VideoUploadComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'home'  
    }

];
