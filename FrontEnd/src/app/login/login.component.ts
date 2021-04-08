import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/service/login.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private invalidLogin = false;
  loginForm = this.fb.group({
    UserLogin: ['john', Validators.required],
    UserPass: ['qwe', Validators.required]
    })

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService) { }

  ngOnInit(): void {

  }

  onSubmit(){
    console.log(this.loginForm.controls.UserLogin.value)
    console.log(this.loginForm.controls.UserPass.value)
    this.login(this.loginForm.controls.UserLogin.value, this.loginForm.controls.UserPass.value)
  }

  login(name: string, pass: string)
  {
    var user: User;
    user =
    {
     userLogin: name,
     userPass: pass
    }
    this.loginService.login(user)
    .subscribe(
      res =>
      {
        console.log(res)
        console.log(res.token)
        localStorage.setItem("token", res.token!)
        setTimeout(() => {
          this.router.navigate(['/userWork'])
        }, 1000);

      },
      (error: Response) =>
      {
        console.log("error409")
          if(error.status === 409)
          {
            console.log("409")
          this.setAlertField();
          } else
          {
            alert("error");
          }
      }
    )
  }


  setAlertField(){
    this.invalidLogin = true;
    setTimeout(() => {
    this.invalidLogin = false;
    }, 2000)
  }


}
