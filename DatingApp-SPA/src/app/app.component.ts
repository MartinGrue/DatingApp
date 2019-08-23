import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  jwthelper = new JwtHelperService();

  constructor(private authServic: AuthService){}

  ngOnInit(){
    const token = localStorage.getItem('token');
    if (token){
      this.authServic.decodedToken = this.jwthelper.decodeToken(token);
    }

    const user: User = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.authServic.Currentuser = user;
      this.authServic.changeMemberPhoto(user.photoUrl);
    }
  }
}
