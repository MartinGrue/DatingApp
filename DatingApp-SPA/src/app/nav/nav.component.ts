import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { AlertifyService } from "../_services/alertify.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  model: any = {};
  photourl: string;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe((purl) => {
      this.photourl = purl;
    });
  }
  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertify.success("Logged in successfully");
      },
      (error) => {
        console.log(error);
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(["/member/edit"]);
      }
    );
  }
  loggedIn() {
    return this.authService.loggedIn();
  }
  logout() {
    localStorage.removeItem("token");
    this.alertify.success("Logged out successfully");
    this.router.navigate(["/home"]);

    localStorage.removeItem("user");
    this.authService.decodedToken = null;
    this.authService.Currentuser = null;
  }
}
