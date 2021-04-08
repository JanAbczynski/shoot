import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment.prod';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = environment.apiUrl + "/login";
  isCompany = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  SetOpts(){
    let opts = {
      headers: new HttpHeaders({
      "X-Requested-With": "HttpClient"
      }).set(
        "Authorization","Bearer " +
        localStorage.getItem("token")!.toString()
      )
    }
    return opts
  }



  login(user: User) {
    console.log(user)
    console.log(this.url + "/postlogin")
    return this.http.post<User>(this.url + "/postlogin", user);
  }

  logout(){
    console.log("logout")
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }


  SetUserType(): boolean {
    let token = localStorage.getItem('token') as string
    let jwtHelper = new JwtHelperService();
    if(token != null){
    let decodedToken = jwtHelper.decodeToken(token);
      if(decodedToken.userType == "company"){
        return true;
      }
    }
    return false;
  }

  public isLogged(){

    let jwtHelper = new JwtHelperService();
    let token = localStorage.getItem('token') as string
    this.SetUserType();
    let expirationDate = jwtHelper.getTokenExpirationDate(token)
    let isExpired = jwtHelper.isTokenExpired(token);
    if(isExpired){localStorage.removeItem('token');}
    return !isExpired;
  }

  ChangePassword(body: any){
    let stringedBody: string;
    stringedBody = JSON.stringify(body)
    let fullUrl :string;
    if(body.hasOwnProperty('code')){
      fullUrl = this.url + "/PassChanger";
    }else{
      fullUrl = this.url + "/PassChangerFromPanel";
    console.log(fullUrl)
    }
    console.log("post")
    return this.http.post(fullUrl, body, this.SetOpts());
  }

}
