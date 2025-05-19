import { Injectable } from '@angular/core';
import { Video, VideoLathatosag } from '../models/video';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, query, where, orderBy, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { NextcloudService } from './nextcloud.service';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private readonly collectionName = 'videos';

  constructor(
    private firestore: Firestore,
    private nextcloudService: NextcloudService
  ) {
    console.log('%c VideosService initialized', 'background: #222; color: #bada55');
  }

  async uploadVideo(file: File, videoData: Partial<Video>, userId: string): Promise<string> {
    try {
      console.log('%c Starting video upload', 'background: #222; color: #bada55', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.type,
        userId,
        timestamp: new Date().toISOString()
      });
      
      // 1. Feltöltés Nextcloudba
      const folderPath = `videos/${userId}`;
      const videoUrl = await this.nextcloudService.uploadVideo(file, folderPath);
      
      console.log('%c Video uploaded to Nextcloud', 'background: #4CAF50; color: white', {
        url: videoUrl
      });

      // 2. Metaadatok mentése Firestore-ba
      const videoRef = await addDoc(collection(this.firestore, this.collectionName), {
        ...videoData,
        url: videoUrl,
        feltoltesDatuma: new Date(),
        feltoltoId: userId,
        lathatosag: VideoLathatosag.Nyilvanos,
        megtekintesekSzama: 0,
        kedvelesekSzama: 0,
        nemKedvelesekSzama: 0,
        hozzaszolasok: [],
        hosszMasodpercben: 0, // TODO: Videó hosszának kiszámítása
        thumbnailUrl: '' // TODO: Thumbnail generálás
      });

      console.log('%c Metadata saved to Firestore', 'background: #2196F3; color: white', {
        videoId: videoRef.id,
        metadata: videoData
      });

      return videoRef.id;

    } catch (error) {
      console.error('%c Video upload failed', 'background: #f44336; color: white', {
        error,
        file: {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: file.type
        },
        userId
      });
      throw error;
    }
  }

  async getAllVideos(): Promise<Video[]> {
    console.log('%c Fetching all public videos', 'color: #2196F3');
    try {
      const videosRef = collection(this.firestore, this.collectionName);
      const q = query(videosRef, where('lathatosag', '==', 'public'));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        feltoltesDatuma: doc.data()['feltoltesDatuma'].toDate(),
        lathatosag: this.convertToVideoLathatosag(doc.data()['lathatosag'])
      } as Video));
      
      console.log('%c Found videos', 'color: #4CAF50', {
        count: videos.length,
        timestamp: new Date().toISOString()
      });
      
      return videos;
    } catch (error) {
      console.error('%c Error fetching videos', 'color: #f44336', error);
      throw error;
    }
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    console.log('%c Fetching video by ID', 'color: #2196F3', { id });
    try {
      const videoRef = doc(this.firestore, this.collectionName, id);
      const videoDoc = await getDoc(videoRef);
      
      if (videoDoc.exists()) {
        const data = videoDoc.data();
        const video = {
          ...data,
          id: videoDoc.id, // _id helyett id
          feltoltesDatuma: data['feltoltesDatuma'].toDate(),
          lathatosag: this.convertToVideoLathatosag(data['lathatosag'])
        } as Video;
        
        console.log('%c Video found', 'color: #4CAF50', { video });
        return video;
      }
      
      console.log('%c Video not found', 'color: #FF9800', { id });
      return undefined;
    } catch (error) {
      console.error('%c Error fetching video', 'color: #f44336', { id, error });
      throw error;
    }
  }

  async getVideosByIds(ids: string[]): Promise<Video[]> {
    const videos: Video[] = [];
    for (const id of ids) {
      const video = await this.getVideoById(id);
      if (video) {
        videos.push(video);
      }
    }
    return videos;
  }

  async getVideosByUserId(userId: string): Promise<Video[]> {
    const videosRef = collection(this.firestore, this.collectionName);
    const q = query(videosRef, where('feltoltoId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        _id: doc.id,
        feltoltesDatuma: (data['feltoltesDatuma'] as any).toDate(),
        lathatosag: this.convertToVideoLathatosag(data['lathatosag'])
      } as unknown as Video;
    });
  }

  async updateVideo(id: string, data: Partial<Video>): Promise<void> {
    const videoRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(videoRef, {
      ...data,
      feltoltesDatuma: data.feltoltesDatuma || new Date()
    });
  }

  async deleteVideo(id: string): Promise<void> {
    console.log('%c Deleting video', 'background: #FF9800; color: white', { id });
    try {
      const video = await this.getVideoById(id);
      if (video) {
        // 1. Delete from Nextcloud if possible
        await this.nextcloudService.deleteVideo(video.url);
        console.log('%c Video deleted from Nextcloud', 'color: #4CAF50', { url: video.url });
        
        // 2. Delete metadata from Firestore
        const videoRef = doc(this.firestore, this.collectionName, id);
        await deleteDoc(videoRef);
        console.log('%c Video metadata deleted from Firestore', 'color: #4CAF50', { id });
      }
    } catch (error) {
      console.error('%c Video deletion failed', 'background: #f44336; color: white', { id, error });
      throw error;
    }
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
