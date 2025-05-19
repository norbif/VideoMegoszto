import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { createClient, WebDAVClient } from 'webdav';

@Injectable({
  providedIn: 'root'
})
export class NextcloudService {
  private client: WebDAVClient;
  private username = environment.nextcloud.username;
  private password = environment.nextcloud.password;

  constructor(private http: HttpClient) {
    this.client = createClient(
      `${environment.nextcloud.url}/remote.php/dav`,
      {
        username: this.username,
        password: this.password
      }
    );
  }

  async uploadVideo(file: File, folderPath: string): Promise<string> {
    try {
      console.log('%c WebDAV Upload Started', 'background: #222; color: #bada55', {
        folder: folderPath,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.type,
        timestamp: new Date().toISOString()
      });

      // Ensure folder exists
      await this.createFolder(folderPath);

      // Create upload path
      const uploadPath = `/files/${this.username}/${folderPath}/${file.name}`;
      
      console.log('%c Upload Path', 'color: #ff00ff', uploadPath);

      const startTime = Date.now();
      
      // Convert File to ArrayBuffer and upload using WebDAV client
      const buffer = await file.arrayBuffer();
      await this.client.putFileContents(uploadPath, buffer, {
        contentLength: file.size,
        overwrite: true
      });

      const endTime = Date.now();
      const uploadDuration = (endTime - startTime) / 1000;
      const uploadSpeed = (file.size / 1024 / 1024) / uploadDuration;

      console.log('%c Upload Successful!', 'background: #4CAF50; color: white', {
        duration: `${uploadDuration.toFixed(2)} seconds`,
        speed: `${uploadSpeed.toFixed(2)} MB/s`,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });

      return this.getVideoUrl(folderPath, file.name);
    } catch (error) {
      console.error('%c WebDAV Upload Failed!', 'background: #f44336; color: white', {
        error,
        fileInfo: {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: file.type
        }
      });
      throw error;
    }
  }

  private async createFolder(folderPath: string): Promise<void> {
    const fullPath = `/files/${this.username}/${folderPath}`;
    
    try {
      // Check if folder exists
      const exists = await this.client.exists(fullPath);
      if (!exists) {
        await this.client.createDirectory(fullPath, { recursive: true });
        console.log('%c Folder Created', 'color: #4CAF50', fullPath);
      } else {
        console.log('%c Folder Already Exists', 'color: #FF9800', fullPath);
      }
    } catch (error) {
      console.error('%c Folder Creation Failed', 'color: #f44336', {
        path: fullPath,
        error
      });
      throw error;
    }
  }

  getVideoUrl(folderPath: string, fileName: string): string {
    return `${environment.nextcloud.url}/remote.php/dav/files/${this.username}/${folderPath}/${fileName}`;
  }

  async deleteVideo(url: string): Promise<void> {
    try {
      const path = url.split('/remote.php/dav')[1];
      await this.client.deleteFile(path);
      console.log('%c File Deleted Successfully', 'color: #4CAF50', url);
    } catch (error) {
      console.error('%c Delete Failed', 'color: #f44336', { url, error });
      throw error;
    }
  }
}
