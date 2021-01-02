import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../_models/user";
import { PaginatedResult } from "../_models/Pagination";
import { map } from "rxjs/operators";
import { Message } from "../_models/message";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // getUsers(): Observable<User[]>{
  // before pagination
  //   return this.http.get<User[]>(this.baseUrl + 'users');
  // }

  getUsers(
    page?,
    itemsPerPage?,
    userParams?,
    likesParam?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    // build up the query-parameter that are send to the server
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (userParams != null) {
      params = params.append("minAge", userParams.minAge);
      params = params.append("maxAge", userParams.maxAge);
      params = params.append("gender", userParams.gender);
      params = params.append("orderBy", userParams.orderBy);
    }

    if (likesParam === "ILiked") {
      params = params.append("ILiked", "true");
    }
    if (likesParam === "UsersThatLikedMe") {
      params = params.append("UsersThatLikedMe", "true");
    }
    return this.http
      .get<User[]>(this.baseUrl + "users", { observe: "response", params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginatedResult;
        })
      );
    // dont forget to update the resolver
  }
  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + "users/" + id, user);
  }
  setisMainPhoto(photoId: number, userId: number) {
    return this.http.post(
      this.baseUrl + "users/" + userId + "/photos/" + photoId + "/setMain",
      {}
    );
  }
  deletePhoto(photoId: number, userId: number) {
    return this.http.delete(
      this.baseUrl + "users/" + userId + "/photos/" + photoId
    );
  }
  sendlikes(userId: number, recipientId: number) {
    return this.http.post(
      this.baseUrl + "users/" + userId + "/like/" + recipientId,
      {}
    );
  }

  getMessages(
    id: number,
    page?,
    itemsPerPage?,
    messageContainer?
  ): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    params = params.append("MessageContainer", messageContainer);

    return this.http
      .get<Message[]>(this.baseUrl + "users/" + id + "/messages", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginatedResult;
        })
      );
  }
  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(
      this.baseUrl + "users/" + id + "/messages/thread/" + recipientId
    );
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + "users/" + id + "/messages", message);
  }
  deleteMessage(id: number, messageId: number) {
    return this.http.post(
      this.baseUrl + "users/" + id + "/messages/" + messageId,
      {}
    );
  }
  markAsRead(id: number, messageId: number) {
    this.http
      .post(
        this.baseUrl + "users/" + id + "/messages/" + messageId + "/isread",
        {}
      )
      .subscribe();
  }
}
