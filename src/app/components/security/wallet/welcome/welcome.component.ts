import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WalletService } from '../../../../services/wallet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  wallet: any = null;
  loading = true;
  error: string | null = null;
  private statusCheckSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.loadWallet();
    this.username = localStorage.getItem('username') || 'User';
  }

  loadWallet() {
    this.loading = true;
    this.error = null;
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'User not authenticated';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`http://localhost:8080/api/wallet/user/${userId}`).subscribe({
      next: (data: any) => {
        this.wallet = data;
        this.loading = false;
        console.log('status:', data.status);
        // If wallet status isn't approved, redirect to welcome
        /* if (data.status == 'ACTIVE') {
          this.router.navigate(['/wallet/welcome']);
        } */
      },
      error: (err) => {
        console.error('Failed to load wallet', err);
        this.error = 'Failed to load wallet data';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.statusCheckSubscription) {
      this.statusCheckSubscription.unsubscribe();
    }
  }

  logout() {
    // Clear user data
    //localStorage.removeItem('userId');
    //localStorage.removeItem('authToken');
    localStorage.clear()
    
    // Redirect to login page
    this.router.navigate(['/home']);
  }

  today: Date = new Date();

  username: string = '';


}
