import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

// export class ErrorInterceptor2 implements HttpInterceptor {
//     intercept(
//         req: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         return next.handle(req).pipe(
//             catchError()
//         );
//     }
// }
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if(error.status === 401){
            return throwError(error.statusText);
          }
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            return throwError(applicationError);
          }
          const serverError = error.error;
          let modelSteErrors = '';
          if(serverError && typeof serverError === 'object'){
            for (const key in serverError){
              if (serverError[key]){
                modelSteErrors += serverError[key]+ '\n';
              }
            }
          }
          return throwError(modelSteErrors || serverError || 'Server Error');
        }
      })
    );
  }
}

export const ErrorInterceptorProvider ={
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}
