import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values: any;
  valuesfrominput: any;
  isCollapsed = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.getValues();
  }
  registertoggle() {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
}
