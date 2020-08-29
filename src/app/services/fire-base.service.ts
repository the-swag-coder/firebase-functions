import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient
  ) {
  }

  getUsers() {
    return this.http.get(this.API_URL + 'user');
  }

  addUser(payload: IUser) {
    return this.http.post(this.API_URL + 'user', payload);
  }

  updateUser(userId: string, payload: IUser) {
    return this.http.put(this.API_URL + `user/${userId}`, payload);
  }

  deleteUser(userId: string) {
    return this.http.delete(this.API_URL + `user/${userId}`);
  }

}

export interface IUser {
  id?: string;
  name: string;
  email: string;
}
