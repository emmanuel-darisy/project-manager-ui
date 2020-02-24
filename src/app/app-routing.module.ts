import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Component} from '@angular/core';
import { UserComponent } from './user/user.component'
import{ProjectComponent} from './project/project.component';
import{TaskComponent} from './task/task.component';
import {ViewtaskComponent} from './viewtask/viewtask.component';
import { Task } from './task/task';

const routes: Routes = [{path:"user", component:UserComponent},{path:"project",component:ProjectComponent},
{path:"task", component:TaskComponent},{path:"viewtask", component:ViewtaskComponent},
{path:"", component:UserComponent}
];

@NgModule({
 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
