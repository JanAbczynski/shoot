
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCompany: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
    ) { }


  ngOnInit(): void {
  }

  logout(){
    this.loginService.logout();
  }

  isLogged(){
    this.isCompany = this.loginService.SetUserType();
    return this.loginService.isLogged();
  }
}
