import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
})


export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  walletService: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void
  {
    localStorage.clear()
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: async (response) => {
        /* console.log('Full login response:', response);
        console.log('Role array:', response.roles);
        console.log('First role:', response.roles?.[0]); */
        // Store all necessary user data
          localStorage.setItem('accessToken', response.accessToken); // Make sure your backend returns a token
          localStorage.setItem('roles', JSON.stringify(response.roles));
          localStorage.setItem('username', response.username);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('fullname', response.fullname);
          
  
        const role = response.role.toLowerCase();
  
        if (!role) {
          this.errorMessage = 'No role found in response.';
          return;
        }
        localStorage.setItem('role', role);

  
        //console.log('Stored Role:', localStorage.getItem('role')); // After setting the role in localStorage
 // Log the stored role
  
        if (role.toLowerCase() === 'admin') {
          console.log('Redirecting to admin dashboard');
          await this.router.navigate(['/account/dashboard']);
        } else {
          console.log('Redirecting to wallet or welcome');
          localStorage.setItem('walletStatus', response.wallet.status)
          const status = response.wallet.status//await firstValueFrom(this.walletService.getWalletStatus());
          console.log('Wallet Status:', status); // Log the wallet status
          if (status === 'ACTIVE') {
            await this.router.navigate(['/wallet/welcome']);
          } else {
            await this.router.navigate(['/pending']);
          }
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      },
    });
  }
  
}
