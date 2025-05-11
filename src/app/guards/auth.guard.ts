import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // 1. Check if user is logged in
    if (!localStorage.getItem('accessToken')) {
      this.router.navigate(['/home']);
      return false;
    }

    const roles = JSON.parse(localStorage.getItem('roles') || '[]'); // Fetch roles from local storage
    const requiredRole = route.data['role'] as string; // Get the role defined in the route

    // Check for the presence of the required role or higher (Admin can access all)
    console.log('auth roles array: ', roles)
    const hasRole = roles.some((role: string) => {
      return this.isRoleHierarchical(role, requiredRole);
    });

    if(!hasRole)
      this.router.navigate(['/login'])
    return hasRole;
  }

  // Helper function to check for role hierarchy
  private isRoleHierarchical(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = ['ROLE_CUSTOMER', 'ROLE_USER', 'ROLE_MANAGER', 'ROLE_ADMIN']; // Define the role hierarchy

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex; // User can access if their role is equal to or higher in the hierarchy
  }
}
