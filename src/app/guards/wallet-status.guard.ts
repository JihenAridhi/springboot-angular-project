import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { WalletService } from '../services/wallet.service';
import { AuthService } from '../services/auth.service';

export const walletStatusGuard: CanActivateFn = (route) => {
  const walletService = inject(WalletService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.log('not is loged in ')
    return router.createUrlTree(['/login']);
  }

  const requiredStatus = route.data?.['requiredStatus'] || 'ACTIVE';

  //jihen addition
  const storedStatus = localStorage.getItem('walletStatus');

  if (!storedStatus) {
    return router.createUrlTree(['/wallet/pending']);
  }

  // 5. Compare statuses (case-insensitive)
  if (storedStatus.toUpperCase() === requiredStatus.toUpperCase()) {
    return true;
  }

  // 6. Redirect based on required status
  return router.createUrlTree(
    requiredStatus.toUpperCase() === 'ACTIVE' 
      ? ['/wallet/pending'] 
      : ['/wallet/welcome']
  );
  
  /*return walletService.getWalletStatus().pipe(
    map(status => {
      if (status === requiredStatus) {
        return true;
      }
      return router.createUrlTree(
        requiredStatus === 'ACTIVE' ? ['/wallet/pending'] : ['/wallet/welcome']
      );
    }),
    catchError(() => of(router.createUrlTree(['/wallet/pending'])))
  );*/
};