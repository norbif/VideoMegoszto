import { Injectable } from '@angular/core';
import { Video, VideoLathatosag } from '../models/video';
import videok from '../../../../public/jsons/videok.json';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private videos: Video[] = [];

  constructor() {
    this.loadVideos();
  }

  private loadVideos() {
    this.videos = videok.map(video => ({
      _id: video._id,
      cim: video.cim,
      leiras: video.leiras,
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
      feltoltoId: video.feltoltoId,
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

  getAllVideos(): Video[] {
    return this.videos;
  }

  getVideoById(id: number): Video | undefined {
    return this.videos.find(video => video._id === id);
  }

  getVideosByIds(ids: number[]): Video[] {
    return this.videos.filter(video => ids.includes(video._id));
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
