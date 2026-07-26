import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../users/user.service';

export const adminGuard: CanActivateFn = () => {
  const users = inject(UserService);
  return users.isAdmin() ? true : inject(Router).createUrlTree(['/']);
};
