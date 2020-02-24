import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import {UserDetailsComponent} from './user/user-details.component';
import {TaskDetailsComponent} from './task/task-details.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailsComponent} from './project/project-details.component';
import { TaskComponent } from './task/task.component';
import { ViewtaskComponent } from './viewtask/viewtask.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user/user.service';
import { ProjectService } from './project/project.service';
import { TaskService} from './task/task.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {NgbModule,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { MatSliderModule } from '@angular/material/slider';

//import {JQ_TOKEN} from './common/jQuery.service';

import {NgPipesModule} from 'ngx-pipes';
//import{IgxInputGroupModule,IgxSliderModule} from 'igniteui-angular';
import { ProjectModalComponent } from './project/project-modal.component';
import { TaskProjectModalComponent } from './task/task-project-modal.component';
import { ParentTaskModalComponent } from './task/parent-task-modal.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { DatePipe } from '@angular/common';
//let jQuery=window['$'];

@NgModule({
  declarations: [
    AppComponent, UserComponent, ProjectComponent, TaskComponent, ViewtaskComponent,
    UserDetailsComponent,ProjectDetailsComponent,TaskDetailsComponent,ProjectModalComponent,
    TaskProjectModalComponent,ParentTaskModalComponent
  ],
  entryComponents:[ProjectModalComponent,TaskProjectModalComponent,ProjectDetailsComponent,ParentTaskModalComponent],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgPipesModule,Ng2SearchPipeModule,
    ToastrModule.forRoot(),NgxBootstrapSliderModule,MatSliderModule
  ],
  providers: [UserService,ProjectService,TaskService,NgbActiveModal/**
  {provide:JQ_TOKEN,useValue:jQuery} */,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
