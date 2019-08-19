import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-cart',
  templateUrl: './member-cart.component.html',
  styleUrls: ['./member-cart.component.css']
})
export class MemberCartComponent implements OnInit {
@Input() user: User;
  constructor() { }

  ngOnInit() {
  }

}
