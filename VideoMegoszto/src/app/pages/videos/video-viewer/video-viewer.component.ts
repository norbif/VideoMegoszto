import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Video } from '../../../shared/models/video';
import { Comment } from '../../../shared/models/comment';
import { User } from '../../../shared/models/user';
import { VideosService } from '../../../shared/service/videos.service';
import { CommentsService } from '../../../shared/service/comments.service';
import { UsersService } from '../../../shared/service/users.service';

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
  comments: Comment[] = [];
  commentUsers: Map<number, User> = new Map();

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
      // Load users for each comment
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
}
