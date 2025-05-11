import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { interval } from 'rxjs';

type WalletStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private http: HttpClient) {}

  getWalletStatus(): Observable<WalletStatus> {
    const userId = localStorage.getItem('userId')
    return this.http.get('http://localhost:8080/api/wallet/'+ userId +'/status')
    .pipe(
      tap((response: any) => {
        if (!['PENDING', 'ACTIVE', 'REJECTED'].includes(response.status)) { 
          console.warn('Invalid wallet status received:', response.status);
        }
      }),
      map((response: any) => {
        // Ensure the status is one of the allowed values
        const status = response.status?.toUpperCase();
        return (status === 'PENDING' || status === 'ACTIVE' || status === 'REJECTED') 
          ? status 
          : 'PENDING';
      })
    );
  }

  startStatusPolling(intervalMs: number = 30000) {
    return interval(intervalMs).pipe(
      switchMap(() => this.getWalletStatus()),
      distinctUntilChanged()
    );
  }
}