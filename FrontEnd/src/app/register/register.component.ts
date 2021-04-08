import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/service/register.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  constructor(
    private router: Router,
    private registerService: RegisterService,
    private fb: FormBuilder
    ) { }

    errorMessage: String = new String();
    registerFinished = false;
    userType: String = "person"
    loginForm = this.fb.group({
      UserLogin: ['john', Validators.required],
      UserPass: ['qwe', Validators.required],
      UserPass2: ['qwe', Validators.required],
      UserName: ['john', Validators.required],
      UserSureName: ['cornishon', Validators.required],
      UserTaxNumber: ['1233211123', Validators.required],
      UserAddress: ['Lon', Validators.required],
      UserCity: ['Kob', Validators.required],
      UserZipCode: ['05-230', Validators.required],
      UserMail: ['j.abc@wp.pl', Validators.required],
      UserPhoneNumber: ['123123123', Validators.required],
      UserPhoneNumber2: ['321321321', Validators.required],
      UserRole: ['dupa', Validators.required]
      })


  ngOnInit(): void {
  }

  onSubmit(){
    var user: User
    user = {
     Id: 0,
     userType: "",
     userLogin: this.loginForm.controls.UserLogin.value,
     userPass: this.loginForm.controls.UserPass.value,
     userName: this.loginForm.controls.UserName.value,
     userSureName: this.loginForm.controls.UserSureName.value,
     userTaxNumber: this.loginForm.controls.UserTaxNumber.value,
     userAddress: this.loginForm.controls.UserAddress.value,
     userCity: this.loginForm.controls.UserCity.value,
     userZipCode: this.loginForm.controls.UserZipCode.value,
     userMail: this.loginForm.controls.UserMail.value,
     userPhoneNumber: this.loginForm.controls.UserPhoneNumber.value,
     userPhoneNumber2: this.loginForm.controls.UserPhoneNumber2.value,
     userRole: 'role',
     token: ""
    }
    console.log(user);
    user.userType = this.userType.toString();
    this.registerForm(user)
  }

  registerForm(user: any){
    // this.validatePassword(user)
    this.registerService.register(user)
    .subscribe(
      res => {
        this.errorMessage = "";
        this.registerFinished =true
        setTimeout(() => {this.router.navigate(['/'])},15000)
      },
      (error: Response) => {
        if(error.status === 409){
          this.errorMessage = JSON.parse(JSON.stringify(error)).error;
          console.log(this.errorMessage)
        } else {
          alert("ERROR unxpected");
        }
      }
    );
  }

}
