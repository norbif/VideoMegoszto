import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';
import commentek from '../../../../public/jsons/commentek.json';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private comments: Comment[] = [];

  constructor() {
    this.loadComments();
  }

  private loadComments() {
    this.comments = commentek.map(comment => ({
      _id: comment._id,
      szerzoId: comment.szerzoId,
      szoveg: comment.szoveg,
      datum: new Date(comment.datum),
      kedvelesekSzama: comment.kedvelesekSzama,
      nemKedvelesekSzama: comment.nemKedvelesekSzama
    }));
  }

  getAllComments(): Comment[] {
    return this.comments;
  }

  getCommentById(id: number): Comment | undefined {
    return this.comments.find(comment => comment._id === id);
  }

  getCommentsByIds(ids: number[]): Comment[] {
    return this.comments.filter(comment => ids.includes(comment._id));
  }
}
