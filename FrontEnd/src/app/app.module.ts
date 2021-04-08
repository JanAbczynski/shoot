import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, } from '@angular/router';
import { RegisterComponent } from './register/register.component'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { UserWorkComponent } from './user-work/user-work.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { CompetitionComponent } from './competition/competition.component';
import { CompetitionManagerComponent } from './competition-manager/competition-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    UserWorkComponent,
    UserDetailComponent,
    UserPanelComponent,
    CompetitionComponent,
    CompetitionManagerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'userWork', component: UserWorkComponent},
      { path: 'userDetail', component: UserDetailComponent},
      { path: 'userPanel', component: UserPanelComponent },
      { path: 'competition/:id',component: CompetitionComponent },
      { path: 'CompetitionManager/:id', component: CompetitionManagerComponent },
    ]
    )


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
