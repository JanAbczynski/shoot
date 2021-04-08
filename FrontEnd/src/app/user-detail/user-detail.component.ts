import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { LoginService } from 'src/service/login.service';
import { User } from '../models/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User = {};
  url = environment.apiUrl + "/login";
  displayData  = false;
  showChangePassForm  = false;
  editUserDate = false;
  isReady = false;
  passwordWasChanged = false;
  wrongPassMessage = false;

  userDataForm = new FormGroup({
    userName: new FormControl(),
    userSureName: new FormControl(),
    userAddress: new FormControl(),
    userCity: new FormControl(),
    userZipCode: new FormControl(),
    userMail: new FormControl(),
    userPhoneNumber: new FormControl(),
    userPhoneNumber2: new FormControl()
  })

  passForm = new FormGroup({
    oldPass: new FormControl('c',Validators.compose([Validators.required])),
    pass1: new FormControl('1',Validators.compose([Validators.required])),
    pass2: new FormControl('2',Validators.compose([Validators.required]))
  });

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.GetData();
  }

  public GetData(){

    let token = localStorage.getItem("token")!.toString();
    let userInfo = {"tokenCode": token}
    console.log(userInfo.tokenCode)
    this.http.post<User>(this.url + "/GetUsersData", userInfo)
    .subscribe((res: User) => {
      this.user = res;
      this.FillUpForm(res)
      this.displayData = true;
    })
  }

  FillUpForm(user: User){
    this.userDataForm.controls['userName'].setValue(user.userName);
    this.userDataForm.controls['userSureName'].setValue(user.userSureName);
    this.userDataForm.controls['userAddress'].setValue(user.userAddress);
    this.userDataForm.controls['userCity'].setValue(user.userCity);
    this.userDataForm.controls['userZipCode'].setValue(user.userZipCode);
    this.userDataForm.controls['userMail'].setValue(user.userMail);
    this.userDataForm.controls['userPhoneNumber'].setValue(user.userPhoneNumber);
    this.userDataForm.controls['userPhoneNumber2'].setValue(user.userPhoneNumber2);
  }

  RunEditUserData(){
    this.editUserDate = true;
  }

  runChangePasswordForm(){
    this.showChangePassForm  = true;
  }

  onSubmitPassChange(){
    var body = {
      "userPass": this.passForm.value.pass1,
      "oldPass": this.passForm.value.oldPass,
      "token": localStorage.getItem("token")
    }
    this.loginService.ChangePassword(body)
    .subscribe(x => {
      this.wrongPassMessage = false;
      this.passwordWasChanged = true;
      this.showChangePassForm = false;
    }, (error: Response) => {
     if(error.status == 401){
      this.wrongPassMessage = true;
     }
    })
  }

  onSubmit(){

  }
}
