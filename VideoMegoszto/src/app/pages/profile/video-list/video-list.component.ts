import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '../../../shared/models/video';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="videos-container">
      <h3>{{title}}</h3>
      @for (video of videos; track video.id) {
        <div class="video-card" (click)="onVideoSelect(video)">
          <img [src]="video.thumbnailUrl" [alt]="video.cim">
          <div class="video-info">
            <h4>{{video.cim}}</h4>
            <p>{{video.megtekintesekSzama}} megtekintés</p>
          </div>
        </div>
      }
    </div>
  `
})
export class VideoListComponent {
  @Input() videos: Video[] = [];
  @Input() title = 'Videók';
  @Input() loading = false;
  @Output() videoSelect = new EventEmitter<Video>();
  @Output() refresh = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  onVideoSelect(video: Video): void {
    this.videoSelect.emit(video);
  }
}
