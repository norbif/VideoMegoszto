import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user';
import { Video } from '../../shared/models/video';
import { Playlist } from '../../shared/models/playlist';
import { UsersService } from '../../shared/service/users.service';
import { VideosService } from '../../shared/service/videos.service';
import { PlaylistsService } from '../../shared/service/playlists.service';
import { Router } from '@angular/router';

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
    private usersService: UsersService,
    private videosService: VideosService,
    private playlistsService: PlaylistsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    // Load first user (ID: 1)
    this.user = this.usersService.getUserById(1);
    if (this.user) {
      this.loadUserContent();
    }
  }

  private loadUserContent() {
    if (this.user) {
      // Load user's uploaded videos
      this.userVideos = this.videosService.getVideosByIds(this.user.feltoltottVideok);
      // Load user's playlists
      this.userPlaylists = this.playlistsService.getPlaylistsByUserId(this.user._id);
    }
  }

  onVideoClick(videoId: number) {
    this.router.navigate(['/videos', videoId]);
  }

  onPlaylistClick(playlistId: number) {
    this.router.navigate(['/playlists', playlistId]);
  }
}
