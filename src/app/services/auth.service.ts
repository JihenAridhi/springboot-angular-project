import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private router: Router
  ) {}

  private apiUrl = `${environment.apiUrl}`;

  register(user: any, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    
    if (files?.length) {
      files.forEach(file => formData.append('files', file, file.name));
    }

    return this.http.post(`${this.apiUrl}/users/register`, formData).pipe(
      tap((response) => console.log('Registration successful:', response)),
      catchError(this.handleError)
    );
  }

  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };
    return this.http.post<any>(`${this.apiUrl}/user/login`, loginPayload).pipe(
      tap({
        next: (response) => {
          
          
          this.userService.setLoggedInUserId(response.userId);
          
          // Navigate based on user role or status
          //this.router.navigate(['/wallet/pending']); // Or your default route
        },
        error: (err) => console.error('Login failed:', err)
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.userService.clearLoggedInUserId();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    // Check both token and userId for more robust authentication
    return !!localStorage.getItem('accessToken') && !!localStorage.getItem('userId');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = error.error?.message || error.message || 'An unknown error occurred!';
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}