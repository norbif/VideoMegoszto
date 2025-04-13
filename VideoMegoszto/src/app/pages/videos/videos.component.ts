import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Video } from '../../shared/models/video';
import { VideosService } from '../../shared/service/videos.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule, 
    MatPaginatorModule, 
    MatButtonToggleModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss'
})
export class VideosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  allVideos: Video[] = [];
  pagedVideos: Video[] = [];
  pageSize = 3;
  pageSizeOptions = [3, 6];
  totalItems = 0;
  currentSort: 'newest' | 'oldest' = 'newest';
  currentPageIndex = 0;
  
  sortOptions = [
    { value: 'views', label: 'Megtekintések szerint' },
    { value: 'date', label: 'Dátum szerint' }
  ];
  selectedSortType = 'date';
  
  constructor(
    private videosService: VideosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAndSortVideos();
  }

  private loadAndSortVideos() {
    this.allVideos = this.videosService.getAllVideos();
    this.sortVideos();
    this.totalItems = this.allVideos.length;
    this.updatePage({ 
      pageIndex: this.currentPageIndex, 
      pageSize: this.pageSize, 
      length: this.totalItems 
    });
  }

  sortVideos() {
    if (this.selectedSortType === 'date') {
      this.allVideos.sort((a, b) => {
        const dateA = new Date(a.feltoltesDatuma).getTime();
        const dateB = new Date(b.feltoltesDatuma).getTime();
        return this.currentSort === 'newest' ? dateB - dateA : dateA - dateB;
      });
    } else {
      this.allVideos.sort((a, b) => {
        return this.currentSort === 'newest' 
          ? b.megtekintesekSzama - a.megtekintesekSzama 
          : a.megtekintesekSzama - b.megtekintesekSzama;
      });
    }
  }

  onSortTypeChange(value: string) {
    this.selectedSortType = value;
    this.sortVideos();
    this.updatePage({ 
      pageIndex: this.paginator.pageIndex, 
      pageSize: this.paginator.pageSize, 
      length: this.totalItems 
    });
  }

  onSortChange(value: 'newest' | 'oldest') {
    this.currentSort = value;
    this.sortVideos();
    this.updatePage({ 
      pageIndex: this.paginator.pageIndex, 
      pageSize: this.paginator.pageSize, 
      length: this.totalItems 
    });
  }

  updatePage(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedVideos = this.allVideos.slice(startIndex, endIndex);
    this.pageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
  }

  onVideoClick(video_id: number) {
    this.router.navigate(['/videos', video_id]);
  }
}
