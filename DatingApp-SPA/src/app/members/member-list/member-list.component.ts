import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  // observer: any = {next: function(value: User[]){
  //   this.users = value;
  //   console.log(this.users);}};
  observer_for_route: any = {
    next: function(value: User[]){
      this.users = value;
      console.log(this.users);
    }
  };
  
    constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }
  
    ngOnInit() {
      // this.route.data.subscribe((data: User[]) => {this.users = data;});
      this.route.data.subscribe(data => {
        this.users = data['users'];
      });
      // this.users = this.route.data['users'];
// this.users = this.route.snapshot.data['users'];
      // console.log(this.route.snapshot.data['users']);
      // this.loadUsers();
      // this.loadUsers2();
    }
  
  
    // loadUsers(){
    //   this.userService.getUsers().subscribe(this.observer);
    //   }
    loadUsers(){
      this.userService.getUsers().subscribe((Data: User[]) => {this.users = Data;},
      error => {this.alertify.error(error);});
  
    }
}
