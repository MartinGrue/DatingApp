import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService,
     private altertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',

          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
      },
      {
        breakpoint: 1000,
        width: '100%',
        height: '600px',
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
       },
       // max-width 400
       {
       breakpoint: 400,
       preview: false
       }];
      this.galleryImages = this.getImages();
  }
getImages(){
  const imageUrls = [];
  for (let i = 0; i< this.user.photos.length; i++) {
    imageUrls.push({
                  small:this.user.photos[i].url,
                  medium:this.user.photos[i].url,
                  big:this.user.photos[i].url,
                  description: this.user.photos[i].description
    });
  }
  return imageUrls;
}
  // loadUser(){
  //   this.userService.getUser(this.route.snapshot.params['id']).subscribe((user: User) => {this.user = user;},
  //   error => {this.altertify.error(error);});
  // }
}
