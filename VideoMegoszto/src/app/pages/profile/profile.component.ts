import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user';
import { Video } from '../../shared/models/video';
import { Playlist } from '../../shared/models/playlist';
import { UsersService } from '../../shared/service/users.service';
import { VideosService } from '../../shared/service/videos.service';
import { PlaylistsService } from '../../shared/service/playlists.service';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user?: User;
  userVideos: Video[] = [];
  userPlaylists: Playlist[] = [];

  constructor(
    private authService: AuthService,
    private videosService: VideosService,
    private playlistsService: PlaylistsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.loadUserContent();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private async loadUserContent() {
    if (this.user?.id) {
      try {
        // Videók betöltése
        const videos = await this.videosService.getVideosByUserId(this.user.id.toString());
        this.userVideos = videos;

        // Lejátszási listák betöltése (ha már van playlist service implementálva)
        const playlists = await this.playlistsService.getPlaylistsByUserId(parseInt(this.user.id));
        this.userPlaylists = playlists;
      } catch (error) {
        console.error('Error loading user content:', error);
        // Ha még nincsenek collection-ök, akkor üres tömböket használunk
        this.userVideos = [];
        this.userPlaylists = [];
      }
    }
  }

  onVideoClick(videoId: string) {  // string típusú ID használata
    this.router.navigate(['/videos', videoId]);
  }

  onPlaylistClick(playlistId: string) {  // string típusú ID használata
    this.router.navigate(['/playlists', playlistId]);
  }
}
