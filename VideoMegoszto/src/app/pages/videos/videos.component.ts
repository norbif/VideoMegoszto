import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Video } from '../../shared/models/video';
import { VideosService } from '../../shared/service/videos.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule, 
    MatPaginatorModule, 
    MatButtonToggleModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  allVideos: Video[] = [];
  pagedVideos: Video[] = [];
  pageSize = 12;
  pageSizeOptions = [6, 12, 24, 48];
  totalItems = 0;
  currentSort: 'newest' | 'oldest' = 'newest';
  currentPageIndex = 0;
  selectedVideoId?: number;
  videos: any[] = [];
  
  sortOptions = [
    { value: 'views', label: 'Megtekintések szerint' },
    { value: 'date', label: 'Dátum szerint' }
  ];
  selectedSortType: 'date' | 'views' = 'date';
  
  constructor(
    private videosService: VideosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAndSortVideos();
  }

  private async loadAndSortVideos() {
    try {
      const allVideos = await this.videosService.getAllVideos();
      this.totalItems = allVideos.length;
      
      // Sort videos
      const sortedVideos = this.sortVideos(allVideos);
      
      // Paginate
      const start = this.currentPageIndex * this.pageSize;
      const end = start + this.pageSize;
      this.pagedVideos = sortedVideos.slice(start, end);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }

  sortVideos(videos: Video[]): Video[] {
    return videos.sort((a, b) => {
      if (this.selectedSortType === 'date') {
        const dateComparison = new Date(b.feltoltesDatuma).getTime() - new Date(a.feltoltesDatuma).getTime();
        return this.currentSort === 'newest' ? dateComparison : -dateComparison;
      } else {
        const viewsComparison = b.megtekintesekSzama - a.megtekintesekSzama;
        return this.currentSort === 'newest' ? viewsComparison : -viewsComparison;
      }
    });
  }

  onSortTypeChange(value: 'date' | 'views') {
    this.selectedSortType = value;
    this.loadAndSortVideos();
  }

  onSortChange(value: 'newest' | 'oldest') {
    this.currentSort = value;
    this.loadAndSortVideos();
  }

  updatePage(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAndSortVideos();
  }

  onVideoClick(videoId: number) {
    this.router.navigate(['/videos', videoId]);
  }

  onVideoLiked(videoId: number) {
    console.log(`Video ${videoId} liked!`);
    this.loadAndSortVideos();
  }

  onVideoDisliked(videoId: number) {
    console.log(`Video ${videoId} disliked!`);
    this.loadAndSortVideos();
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
