import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  // observer: any = {next: function(value: User[]){
  //   this.users = value;
  //   console.log(this.users);}};
  observer_for_route: any = {
    next: function(value: User[]) {
      this.users = value;
      console.log(this.users);
    }
  };
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' }
  ];
  userParams: any = {};

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   this.users = data['users'];
    // });
    // all following commants are experimentation
    // this.route.data.subscribe((data: User[]) => {this.users = data;});

    // this.users = this.route.data['users'];
    // this.users = this.route.snapshot.data['users'];
    // console.log(this.route.snapshot.data['users']);
    // this.loadUsers();
    // this.loadUsers2();

    //after pagnation
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    console.log(this.users);
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;

    this.userParams.orderBy = 'lastActive';
  }
  resetfilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers2();
  }
  // loadUsers(){
  //   this.userService.getUsers().subscribe(this.observer);
  //   }

  // loadUsers comes from before the routing does the http request
  // loadUsers() {
  //   this.userService.getUsers().subscribe(
  //     (Data: User[]) => {
  //       this.users = Data;
  //     },
  //     error => {
  //       this.alertify.error(error);
  //     }
  //   );
  // }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);
    this.loadUsers();
  }
  loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (result: PaginatedResult<User[]>) => {
          this.users = result.result;
          this.pagination = result.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }
  applyFilter() {
    this.users = null;
    this.pagination.currentPage = 1;
    this.loadUsers2();
  }
  loadUsers2() {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.userParams
      )
      .subscribe(
        (result: PaginatedResult<User[]>) => {
          if (this.users != null) {
            this.users = this.users.concat(result.result);
          } else {
            this.users = result.result;
          }
          this.pagination = result.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }
  onScroll() {
    console.log('scrolled!!!!');
    this.pagination.currentPage = this.pagination.currentPage + 1;
    this.loadUsers2();
    // this.users.push(this.users[0],this.users[0],this.users[0],this.users[0],this.users[0],this.users[0],this.users[0]);
  }
}
