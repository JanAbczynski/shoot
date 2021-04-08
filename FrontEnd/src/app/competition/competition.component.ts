import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserWorkService } from 'src/service/user-work.service';
import { Competition } from '../models/Competition';
import { RunModel } from '../models/RunModel';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {

  competitionId: string = "";
  competition: Competition = {};
  runs: RunModel[] = [{}];
  buttonId = "";
  buttonMessage = "";
  generateTable = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userWorkService: UserWorkService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.competitionId = params.id;
      this.getCompetition();
    })
  }

  getCompetition(){
    this.userWorkService.getACompetitionById(this.competitionId)
    .subscribe(
      competition => {
        this.competition = competition;
        console.log(competition)
        this.getRunsForCompetition()
      })
  }

  getRunsForCompetition(){
    this.userWorkService.getRunsForCompetition(this.competitionId)
    .subscribe(
      runs => {
        this.runs = runs;
        this.generateTable = true;
      })
  }


  SignIn(runId: string){
    var run = new RunModel();
    run.id = runId
    console.log(run)
      this.userWorkService.RegisterUserInRun(run)
      .subscribe(
        runs => {

        }, (error: Response) =>
        {
          if(error.status === 409)
          {
            this.buttonId = JSON.parse(JSON.stringify(error)).error.id;
            this.buttonMessage = JSON.parse(JSON.stringify(error)).error.message;
            setTimeout(()=>{
              this.buttonId = "";
            }, 3000)
          }
        }
      )
  }
}
