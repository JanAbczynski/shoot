import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  url = environment.apiUrl + "/login";
  // url = "/login";

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

    public register (user: User){
      console.log("register");
      return this.http.post<User>(this.url + "/RegisterNewUser", user);
    }

    // public ValidateCode (code: String){
    //   console.log("service");
    //   return this.http.get<any>(this.url + "/ValidateUser?code=" + code);

    //   // https://localhost:44336/api/login/ValidateUser?code=ae25dfaf-86b4-47eb-8d0a-85e34d9f5284X
    //   // https://localhost:44336/api/login/ValidateUser?code

    // }
}
