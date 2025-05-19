import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { VideosService } from '../../shared/service/videos.service';
import { AuthService } from '../../shared/service/auth.service';
import { Video } from '../../shared/models/video';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent {
  selectedFile?: File;
  videoTitle = '';
  videoDescription = '';
  isUploading = false;
  uploadProgress = 0;
  errorMessage = '';

  constructor(
    private videosService: VideosService,
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;
      this.videoTitle = file.name.split('.')[0];
    } else {
      this.errorMessage = 'Csak videó fájlokat lehet feltölteni!';
    }
  }

  async onUpload() {
    if (!this.selectedFile || !this.videoTitle) {
      this.errorMessage = 'Kérlek válassz ki egy videót és adj meg címet!';
      return;
    }

    this.isUploading = true;
    try {
      const currentUser = await this.authService.getCurrentUser().toPromise();
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      const videoData: Partial<Video> = {
        cim: this.videoTitle,
        leiras: this.videoDescription,
        hosszMasodpercben: 0 // Ez később lesz kiszámolva
      };

      await this.videosService.uploadVideo(this.selectedFile, videoData, currentUser.id!);
      this.router.navigate(['/videos']);
    } catch (error) {
      console.error('Upload error:', error);
      this.errorMessage = 'Hiba történt a feltöltés során!';
    } finally {
      this.isUploading = false;
    }
  }
}
