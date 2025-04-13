import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Video } from '../../shared/models/video';
import { VideosService } from '../../shared/service/videos.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss'
})
export class VideosComponent implements OnInit {
  allVideos: Video[] = [];
  pagedVideos: Video[] = [];
  pageSize = 4;
  pageSizeOptions = [4, 8, 12];
  totalItems = 0;
  
  constructor(
    private videosService: VideosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.allVideos = this.videosService.getAllVideos();
    this.totalItems = this.allVideos.length;
    this.updatePage({ pageIndex: 0, pageSize: this.pageSize, length: this.totalItems });
  }

  updatePage(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedVideos = this.allVideos.slice(startIndex, endIndex);
  }

  onVideoClick(video_id: number) {
    this.router.navigate(['/videos', video_id]);
  }
}
