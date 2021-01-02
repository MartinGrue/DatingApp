import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Pagination, PaginatedResult } from "src/app/_models/Pagination";
import { AuthService } from "../_services/auth.service";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";
import { Message } from "../_models/message";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = "Unread";

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertify: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.messages = data["messages"].result;
      this.pagination = data["messages"].pagination;
    });
  }
  loadMessages() {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;

          this.pagination = res.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);
    this.loadMessages();
  }
  deleteMessage(messageId: number) {
    this.userService
      .deleteMessage(this.authService.decodedToken.nameid, messageId)
      .subscribe(
        () => {
          this.messages.splice(
            this.messages.findIndex((m) => m.id === messageId),
            1
          );
          this.alertify.success("Message deleted");
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
}
