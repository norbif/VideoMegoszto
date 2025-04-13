import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Video } from '../../../shared/models/video';
import { Comment } from '../../../shared/models/comment';
import { User } from '../../../shared/models/user';
import { VideosService } from '../../../shared/service/videos.service';
import { CommentsService } from '../../../shared/service/comments.service';
import { UsersService } from '../../../shared/service/users.service';

@Component({
  selector: 'app-video-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './video-viewer.component.html',
  styleUrl: './video-viewer.component.scss'
})
export class VideoViewerComponent implements OnInit {
  videoId: number = 0;
  video?: Video;
  comments: Comment[] = [];
  commentUsers: Map<number, User> = new Map();
  newCommentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private videosService: VideosService,
    private commentsService: CommentsService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.videoId = parseInt(params['id']);
      this.video = this.videosService.getVideoById(this.videoId);
      if (this.video) {
        this.loadComments();
      }
    });
  }

  private loadComments() {
    if (this.video) {
      this.comments = this.commentsService.getCommentsByIds(this.video.hozzaszolasok);
      this.comments.forEach(comment => {
        const user = this.usersService.getUserById(comment.szerzoId);
        if (user) {
          this.commentUsers.set(comment.szerzoId, user);
        }
      });
    }
  }

  getUserForComment(szerzoId: number): User | undefined {
    return this.commentUsers.get(szerzoId);
  }

  addComment() {
    if (this.video && this.newCommentText.trim()) {
      const newComment: Comment = {
        _id: this.comments.length + 1,
        szerzoId: 1, 
        szoveg: this.newCommentText.trim(),
        datum: new Date(),
        kedvelesekSzama: 0,
        nemKedvelesekSzama: 0
      };

      this.comments.unshift(newComment);
      
      
      const user = this.usersService.getUserById(newComment.szerzoId);
      if (user) {
        this.commentUsers.set(newComment.szerzoId, user);
      }
      this.newCommentText = '';
    }
  }
}
