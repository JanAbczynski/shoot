import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Competition } from 'src/app/models/Competition';
import { RunModel } from 'src/app/models/RunModel';
import { environment } from 'src/environments/environment.prod';
import { TargetModel } from 'src/app/models/TargetModel';

@Injectable({
  providedIn: 'root'
})
export class UserWorkService {

  url = environment.apiUrl + "/competition";

  constructor(
    private http: HttpClient,
    private loginService : LoginService

  ) { }

  getAllCompetitionForUser(): Observable<Competition[]> {
    var fullUrl = this.url + "/GetAllCompetitionForUser";
    return this.http.get<Competition[]>(fullUrl, this.loginService.SetOpts());
  }

  getAllCompetition(): Observable<Competition[]> {
    var fullUrl = this.url + "/GetAllCompetition";
    return this.http.get<Competition[]>(fullUrl, this.loginService.SetOpts());
  }

  getACompetitionById(id: string): Observable<Competition> {
    var fullUrl = this.url + "/GetCompetitionById/" + id;
    return this.http.get<Competition>(fullUrl, this.loginService.SetOpts());
  }

  getRunsForCompetition(competitionId: string): Observable<RunModel[]> {

    var fullUrl = this.url + "/GetRunByCompetitionId/" + competitionId;
    return this.http.get<RunModel[]>(fullUrl, this.loginService.SetOpts());
  }

  RegisterUserInRun(run: RunModel) {
    var fullUrl = this.url + "/RegisterUserInRun";
    return this.http.post(fullUrl, run, this.loginService.SetOpts());
  }

  public addCompetition (competition: Competition){
    var fullUrl = this.url + "/AddCompetition";
    return this.http.post(fullUrl, competition, this.loginService.SetOpts());
  }

  public addRun (run: RunModel){
    var fullUrl = this.url + "/addRun";
    return this.http.post(fullUrl, run, this.loginService.SetOpts());
  }

  GetTargets(body: any){
    var fullUrl = this.url + "/FindUserTargetsByToken";
    return this.http.post<TargetModel[]>(fullUrl, body);
  }
}
