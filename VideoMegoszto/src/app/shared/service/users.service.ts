import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { NextcloudService } from './nextcloud.service';
import { User } from '../models/user';
import userek from '../../../../public/jsons/userek.json';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly collectionName = 'users';
  private users: User[] = [];

  constructor(
    private firestore: Firestore,
    private nextcloudService: NextcloudService
  ) {
    this.loadUsers();
  }

  private loadUsers() {
    this.users = userek.map(user => ({
      _id: user._id,
      felhasznalonev: user.felhasznalonev,
      email: user.email,
      jelszoHash: user.jelszoHash,
      profilkepUrl: user.profilkepUrl,
      regisztracioDatuma: new Date(user.regisztracioDatuma),
      feltoltottVideok: (user.feltoltottVideok || []).map(String),
      kedveltVideok: user.kedveltVideok || [],
      lejatszasiListak: user.lejatszasiListak || []
    }));
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  async updateProfile(userId: string, data: Partial<User>, profilePicture?: File): Promise<void> {
    try {
      console.log('%c Updating profile', 'background: #2196F3; color: white', { userId, data });
      
      const updateData: Partial<User> = { ...data };

      if (profilePicture) {
        // Upload profile picture to Nextcloud
        const folderPath = `profile-pictures/${userId}`;
        const pictureUrl = await this.nextcloudService.uploadVideo(profilePicture, folderPath);
        updateData.profilkepUrl = pictureUrl;
      }

      // Update user data in Firestore
      const userRef = doc(this.firestore, this.collectionName, userId);
      await updateDoc(userRef, updateData);

      console.log('%c Profile updated successfully', 'background: #4CAF50; color: white');
    } catch (error) {
      console.error('%c Profile update failed', 'background: #f44336; color: white', error);
      throw error;
    }
  }
}
