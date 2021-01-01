import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TabsetComponent } from "ngx-bootstrap/tabs";
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from "@kolkov/ngx-gallery";
import { User } from "src/app/_models/user";
import { AlertifyService } from "src/app/_services/alertify.service";
import { UserService } from "src/app/_services/user.service";
import { AuthService } from "src/app/_services/auth.service";

@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.css"],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild("memberTabs", {static: true}) membertabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private userService: UserService,
    private altertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data["user"];
    });
    this.route.queryParams.subscribe((params) => {
      const selectedTab = params["tab"];
      console.log(selectedTab);
      console.log(this.membertabs);
      this.membertabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });

    this.galleryOptions = [
      {
        width: "500px",
        height: "500px",

        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
      {
        breakpoint: 1000,
        width: "100%",
        height: "600px",
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
      },
    ];
    this.galleryImages = this.getImages();
  }
  ngAfterViewInit() {}
  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description,
      });
    }
    return imageUrls;
  }
  // loadUser(){
  //   this.userService.getUser(this.route.snapshot.params['id']).subscribe((user: User) => {this.user = user;},
  //   error => {this.altertify.error(error);});
  // }
  selectTab(tabid: number) {
    this.membertabs.tabs[tabid].active = true;
  }
  sendLike(recipientId: number) {
    this.userService
      .sendlikes(this.authService.decodedToken.nameid, recipientId)
      .subscribe(
        (data) => {
          this.altertify.success("You have liked " + this.user.knownAs);
        },
        (error) => {
          this.altertify.error(error);
        }
      );
  }
}
