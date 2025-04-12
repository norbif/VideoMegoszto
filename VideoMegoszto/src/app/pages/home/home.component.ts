import { Component, OnInit } from '@angular/core';
import { Video, VideoLathatosag } from '../../shared/models/video';
import videok from '../../../../public/jsons/videok.json';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  videos: Video[] = [];
  
  ngOnInit() {
    this.videos = videok.map(video => ({
      _id: video._id,
      cim: video.cim,
      leiras: video.leiras,
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
      feltoltoId: {
        _id: video.feltoltoId._id,
        felhasznalonev: video.feltoltoId.felhasznalonev,
        email: video.feltoltoId.email,
        jelszoHash: video.feltoltoId.jelszoHash,
        profilkepUrl: video.feltoltoId.profilkepUrl,
        regisztracioDatuma: new Date(video.feltoltoId.regisztracioDatuma),
        feltoltottVideok: video.feltoltoId.feltoltottVideok,
        kedveltVideok: video.feltoltoId.kedveltVideok,
        lejatszasiListak: video.feltoltoId.lejatszasiListak
      },
      feltoltesDatuma: new Date(video.feltoltesDatuma),
      hosszMasodpercben: video.hosszMasodpercben,
      megtekintesekSzama: video.megtekintesekSzama,
      cimkek: video.cimkek,
      lathatosag: this.convertToVideoLathatosag(video.lathatosag),
      kedvelesekSzama: video.kedvelesekSzama || 0,
      nemKedvelesekSzama: video.nemKedvelesekSzama || 0,
      hozzaszolasok: video.hozzaszolasok || []
    }));
  }
  onVideoClick(video_id: number) {
    window.location.href = `/videos/${video_id}`;
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
        return VideoLathatosag.Nyilvanos; // alapértelmezett érték
    }
  }
}
