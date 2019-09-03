import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-PhotoEditor',
  templateUrl: './PhotoEditor.component.html',
  styleUrls: ['./PhotoEditor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = true;
  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo;

  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.initUploader();
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authservice.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authservice.changeMemberPhoto(photo.url);
          this.authservice.Currentuser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authservice.Currentuser)
          );
        }
      }
    };
  }

  SetMainPhoto(mainPhoto: Photo) {
    this.userService
      .setisMainPhoto(mainPhoto.id, this.authservice.decodedToken.nameid)
      .subscribe(
        () => {
          console.log('Main updated');
          this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
          this.currentMainPhoto.isMain = false;
          mainPhoto.isMain = true;
          this.authservice.changeMemberPhoto(mainPhoto.url);

          this.authservice.Currentuser.photoUrl = mainPhoto.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authservice.Currentuser)
          );
        },
        error => {
          this.alertify.error(error);
        }
      );
  }
  DeletePhoto(photoId: number) {
    this.alertify.confirm('Are you sure?', () => {
      this.userService
        .deletePhoto(photoId, this.authservice.decodedToken.nameid)
        .subscribe(
          () => {
            this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
            this.alertify.success('Photo has been deleted');
          },
          error => {
            this.alertify.error('failed to delete the photo');
          }
        );
    });
  }
}
