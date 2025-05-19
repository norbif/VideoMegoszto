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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['../auth.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async onLogin() {
    try {
      await this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              this.errorMessage = 'Érvénytelen email cím';
              break;
            case 'auth/user-not-found':
              this.errorMessage = 'Nem található felhasználó';
              break;
            case 'auth/wrong-password':
              this.errorMessage = 'Helytelen jelszó';
              break;
            default:
              this.errorMessage = 'Hiba történt a bejelentkezés során';
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'Hiba történt a bejelentkezés során';
    }
  }
}
