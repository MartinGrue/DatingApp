import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editform: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  user: User;
  photoUrl: string;
  constructor(private route: ActivatedRoute,
     private altertify: AlertifyService,
      private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => { this.user = data['user']; }
    );
    this.authService.currentPhotoUrl.subscribe(purl => {this.photoUrl = purl; });

   }

  unloadNotification($event: any) {
    if (this.editform.dirty) {
      $event.returnValue = true;
  }
  }
updateUser(){
  this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
    next => {this.altertify.success('Profile updated');
             this.editform.reset(this.user); },
    error => {this.altertify.error(error); }
  );
  }
  updateMainPhoto(photourl){
    this.user.photoUrl = photourl;
  }
}
