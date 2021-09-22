import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../_services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor( private injector: Injector) { }

  intercept(req,next){
    let authService = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders : {
        Authorization : `${authService.getToken()}`
      }
    });
    // if(authService.getToken()){
    //   tokenizedReq.url = tokenizedReq.url + '?access_token='+ `${authService.getToken()}`;
    // }
    
    //console.log('tokenizedReq', tokenizedReq);
    return next.handle(tokenizedReq);
  }
}
