import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User []> {

    constructor(private userservice: UserService,
         private router: Router, private altertify: AlertifyService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User []>{
             return this.userservice.getUsers().pipe(catchError(error => {
                 this.altertify.error('Problem with getting data');
                 this.router.navigate(['/home']);
                 return of(null);
             }));
         }
}