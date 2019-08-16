import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model: any = {};


  constructor(private authService: AuthService, private alertify: AlertifyService ) { }

  ngOnInit() {
  }

  register(){
    this.authService.register(this.model).subscribe(next =>
    {
      console.log('registration okay');
      this.alertify.success('Registration Successfully');
    }, 
    error => {console.log(error);}
    );
  }
  cancel(){
    this.cancelRegister.emit(false);
    console.log('cancled');
    this.alertify.error('Registration canceled');
  }
}
