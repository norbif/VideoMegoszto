import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '../../shared/models/video';
import { VideosService } from '../../shared/service/videos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  videos: Video[] = [];
  
  constructor(
    private videosService: VideosService,
    private router: Router
  ) {}

  ngOnInit() {
    const allVideos = this.videosService.getAllVideos();
    this.videos = this.getRandomVideos(allVideos, 3);
  }

  private getRandomVideos(videos: Video[], count: number): Video[] {
    const shuffled = [...videos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  onVideoClick(video_id: number) {
    this.router.navigate(['/videos', video_id]);
  }
}
