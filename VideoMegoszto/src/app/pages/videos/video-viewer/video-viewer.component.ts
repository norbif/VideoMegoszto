import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Video, VideoLathatosag } from '../../../shared/models/video';
import videok from '../../../../../public/jsons/videok.json';

@Component({
  selector: 'app-video-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-viewer.component.html',
  styleUrl: './video-viewer.component.scss'
})
export class VideoViewerComponent implements OnInit {
  videoId: number = 0;
  video?: Video;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.videoId = parseInt(params['id']);
      const foundVideo = videok.find(v => v._id === this.videoId);
      
      if (foundVideo) {
        this.video = {
          _id: foundVideo._id,
          cim: foundVideo.cim,
          leiras: foundVideo.leiras,
          url: foundVideo.url,
          thumbnailUrl: foundVideo.thumbnailUrl,
          feltoltoId: {
            _id: foundVideo.feltoltoId._id,
            felhasznalonev: foundVideo.feltoltoId.felhasznalonev,
            email: foundVideo.feltoltoId.email,
            jelszoHash: foundVideo.feltoltoId.jelszoHash,
            profilkepUrl: foundVideo.feltoltoId.profilkepUrl,
            regisztracioDatuma: new Date(foundVideo.feltoltoId.regisztracioDatuma),
            feltoltottVideok: foundVideo.feltoltoId.feltoltottVideok,
            kedveltVideok: foundVideo.feltoltoId.kedveltVideok,
            lejatszasiListak: foundVideo.feltoltoId.lejatszasiListak
          },
          feltoltesDatuma: new Date(foundVideo.feltoltesDatuma),
          hosszMasodpercben: foundVideo.hosszMasodpercben,
          megtekintesekSzama: foundVideo.megtekintesekSzama,
          cimkek: foundVideo.cimkek,
          lathatosag: this.convertToVideoLathatosag(foundVideo.lathatosag),
          kedvelesekSzama: foundVideo.kedvelesekSzama || 0,
          nemKedvelesekSzama: foundVideo.nemKedvelesekSzama || 0,
          hozzaszolasok: foundVideo.hozzaszolasok || []
        };
      }
    });
  }

  private convertToVideoLathatosag(value: string): VideoLathatosag {
    switch (value) {
      case 'public':
        return VideoLathatosag.Nyilvanos;
      case 'unlisted':
        return VideoLathatosag.NemListazott;
      case 'private':
        return VideoLathatosag.Privat;
      default:
        return VideoLathatosag.Nyilvanos;
    }
  }
}
