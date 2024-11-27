import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TestService } from '../services/test.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(

    private _router: Router,

    private _testService: TestService,
  ) { }

  canActivate(): any {

    let access: any = this._testService.isAuthenticate();

    if (!access) {
      this._router.navigate(['']);
    }

    return true;
  }

}
