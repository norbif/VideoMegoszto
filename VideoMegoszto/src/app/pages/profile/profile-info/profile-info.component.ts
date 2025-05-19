import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="profile-info">
      <div class="profile-picture-container">
        <img [src]="user.profilkepUrl || 'assets/default-avatar.png'" [alt]="user.felhasznalonev">
        @if (editMode) {
          <button mat-mini-fab (click)="onImageClick()">
            <mat-icon>edit</mat-icon>
          </button>
        }
      </div>
      <div class="user-details">
        @if (editMode) {
          <mat-form-field>
            <input matInput [(ngModel)]="user.felhasznalonev" (ngModelChange)="userChange.emit(user)">
          </mat-form-field>
        } @else {
          <h2>{{user.felhasznalonev}}</h2>
        }
      </div>
    </div>
  `
})
export class ProfileInfoComponent {
  @Input() user!: User;
  @Input() editMode = false;
  @Output() userChange = new EventEmitter<User>();
  @Output() imageSelect = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<void>();

  onImageClick(): void {
    this.imageSelect.emit();
  }
}
