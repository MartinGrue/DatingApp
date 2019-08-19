import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editform: NgForm;
  @HostListener('window.´:beforeunload', ['$event'])
  user: User;

  constructor(private route: ActivatedRoute, private altertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => { this.user = data['user']; }
    );
  }
  updateUser(){
    console.log(this.user);
    this.altertify.success('Profile updated');
    this.editform.reset(this.user);
  }
  unloadNotification($event: any) {
if (this.editform.dirty) {
  $event.returnValue = true;
}
  }

}
