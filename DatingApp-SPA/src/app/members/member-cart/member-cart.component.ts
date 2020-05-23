import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-cart',
  templateUrl: './member-cart.component.html',
  styleUrls: ['./member-cart.component.css']
})
export class MemberCartComponent implements OnInit {
  @Input() user: User;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private altertify: AlertifyService
  ) {}

  ngOnInit() {}
  sendLike(recipientId: number) {
    this.userService
      .sendlikes(this.authService.decodedToken.nameid, recipientId)
      .subscribe(
        data => {
          this.altertify.success('You have liked ' + this.user.knownAs);
        },
        error => {
          this.altertify.error(error);
        }
      );
  }
}
