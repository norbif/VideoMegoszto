import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['../auth.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'A jelszavak nem egyeznek';
      return;
    }

    try {
      await this.authService.register(this.email, this.password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.errorMessage = 'Ez az email cím már regisztrálva van';
              break;
            case 'auth/invalid-email':
              this.errorMessage = 'Érvénytelen email cím';
              break;
            case 'auth/weak-password':
              this.errorMessage = 'A jelszó túl gyenge';
              break;
            default:
              this.errorMessage = 'Hiba történt a regisztráció során';
          }
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      this.errorMessage = 'Hiba történt a regisztráció során';
    }
  }
}
