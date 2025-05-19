import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../shared/service/auth.service';

@Component({
  selector: 'app-video-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './video-viewer.component.html',
  styleUrl: './video-viewer.component.scss'
})
export class VideoViewerComponent implements OnInit {
  @Input() hideComments: boolean = false;
  @Output() videoLiked = new EventEmitter<number>();
  @Output() videoDisliked = new EventEmitter<number>();
  
  video?: Video;
  comments: Comment[] = [];
  newCommentText = '';
  commentUsers = new Map<string, User>();
  constructor(
    private route: ActivatedRoute,
    private videosService: VideosService,
    private commentsService: CommentsService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}
  

  async ngOnInit() {
    const videoId = this.route.snapshot.paramMap.get('id');
    if (videoId) {
      this.video = await this.videosService.getVideoById(videoId);
      if (this.video) {
        await this.loadComments();
      }
    }
  }

  private async loadComments() {
    if (this.video) {
      this.comments = await this.commentsService.getCommentsByVideoId(this.video.id!);
      for (const comment of this.comments) {
        const user = await this.usersService.getUserById(comment.szerzoId.toString());
        if (user) {
          this.commentUsers.set(comment.szerzoId, user);
        }
      }
    }
  }

  getUserForComment(szerzoId: number): User | undefined {
    return this.commentUsers.get(szerzoId.toString());
  }

  async addComment() {
    const currentUser = await this.authService.getCurrentUser().toPromise();
    if (!currentUser || !this.video || !this.newCommentText.trim()) return;

    const newComment: Comment = {
      videoId: this.video.id!,
      szerzoId: currentUser.id!,
      szoveg: this.newCommentText.trim(),
      datum: new Date(),
      kedvelesekSzama: 0,
      nemKedvelesekSzama: 0
    };

    await this.commentsService.addComment(newComment);
    await this.loadComments();
    this.newCommentText = '';
  }

  onLikeClick() {
    if (this.video) {
      this.video.kedvelesekSzama++;
      this.videoLiked.emit(Number(this.video.id));
    }
  }

  onDislikeClick() {
    if (this.video) {
      this.video.nemKedvelesekSzama++;
      this.videoDisliked.emit(Number(this.video.id));
    }
  }
}
