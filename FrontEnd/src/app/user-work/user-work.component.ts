import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserWorkService } from 'src/service/user-work.service';
import { Competition } from '../models/Competition';

@Component({
  selector: 'app-user-work',
  templateUrl: './user-work.component.html',
  styleUrls: ['./user-work.component.css']
})
export class UserWorkComponent implements OnInit {

  isCreatingCompetition = false
  createCompetition: FormGroup;
  competitions : Competition[] = [{}];

  constructor(
    private fb: FormBuilder,
    private userWorkService: UserWorkService
  )
  {
    this.createCompetition = new FormGroup ({
      description: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      dur: new FormControl(null),
      // duration: new FormControl(null, Validators.required),
      placeOf: new FormControl(null, Validators.required)
   })
  }


  ngOnInit(): void {
    this.getAllCompetitionForUser()
  }

  getAllCompetitionForUser(){
    this.userWorkService.getAllCompetitionForUser()
    .subscribe(
      competitions => {
        this.competitions = competitions;
      })
  }

  onSubmit(){
    var competition: Competition;
    competition = {
      id : null,
      description: this.createCompetition.controls.description.value,
      runs: null,
      duration: this.createCompetition.controls.dur.value,
      startTime: this.createCompetition.controls.startTime.value,
      placeOf: this.createCompetition.controls.placeOf.value
    }
    this.addCompetition(competition)
  }

  addCompetition(competition: Competition){
    this.userWorkService.addCompetition(competition)
    .subscribe(
      res => {
        console.log("com: ", res)
        this.createCompetition.reset();
        this.isCreatingCompetition = false
        this.getAllCompetitionForUser()
      })
  }

  ActivateCreator(){
    if(this.isCreatingCompetition){
      this.isCreatingCompetition = false
    }else{
      this.isCreatingCompetition = true
    }
  }
}
