import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, query, where, orderBy, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly collectionName = 'comments';

  constructor(private firestore: Firestore) {}

  async addComment(comment: Omit<Comment, 'id'>): Promise<string> {
    const commentsRef = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(commentsRef, {
      ...comment,
      datum: new Date()
    });
    return docRef.id;
  }

  async getCommentsByVideoId(videoId: string): Promise<Comment[]> {
    const commentsRef = collection(this.firestore, this.collectionName);
    const q = query(
      commentsRef, 
      where('videoId', '==', videoId),
      orderBy('datum', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      datum: doc.data()['datum'].toDate()
    } as Comment));
  }

  async getCommentById(id: string): Promise<Comment | undefined> {
    const commentRef = doc(this.firestore, this.collectionName, id);
    const commentDoc = await getDoc(commentRef);
    
    if (commentDoc.exists()) {
      const data = commentDoc.data();
      return {
        ...data,
        id: commentDoc.id,
        datum: data['datum'].toDate()
      } as Comment;
    }
    return undefined;
  }

  async updateComment(id: string, changes: Partial<Comment>): Promise<void> {
    const commentRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(commentRef, changes);
  }

  async deleteComment(id: string): Promise<void> {
    const commentRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(commentRef);
  }

  async likeComment(id: string): Promise<void> {
    const comment = await this.getCommentById(id);
    if (comment) {
      await this.updateComment(id, {
        kedvelesekSzama: (comment.kedvelesekSzama || 0) + 1
      });
    }
  }

  async dislikeComment(id: string): Promise<void> {
    const comment = await this.getCommentById(id);
    if (comment) {
      await this.updateComment(id, {
        nemKedvelesekSzama: (comment.nemKedvelesekSzama || 0) + 1
      });
    }
  }
}
