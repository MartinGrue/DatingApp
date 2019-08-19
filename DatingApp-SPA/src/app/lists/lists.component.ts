import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
users: User[];
// observer: any = {next: function(value: User[]){
//   this.users = value;
//   console.log(this.users);}};

  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
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
