import {Component,OnInit} from '@angular/core';
import { TaskService } from '../task/task.service';
import { ProjectService } from '../project/project.service';
import { Task } from '../task/task';
import {NgbActiveModal,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TaskProjectModalComponent} from '../task/task-project-modal.component';
import { Project } from '../project/project';
import { Router } from '@angular/router';import { ActivatedRoute}from '@angular/router';


@Component({
    selector:'app-viewtask',
    templateUrl:'./viewtask.component.html',
    styleUrls:[]

})

export class ViewtaskComponent implements OnInit{

    constructor(private taskService:TaskService,private projectService:ProjectService
        ,private ngModal:NgbModal,private router:Router,private route:ActivatedRoute){
        
    }
    cancelUpdateNav:boolean;
    ngOnInit(){
       // this.getTasks();
       if(history.state.data != null){
        this.task=history.state.data.task; 
        this.project=this.task.project ;
        this.cancelUpdateNav=history.state.data.cancelUpdateNav;
        let obs2 = this.taskService.getTasksById(this.task.project.projectId);
                        obs2.subscribe(
                           res2=>{
                            this.tasks=res2;
                           }
                          
                        );
        console.log(this.cancelUpdateNav);         
    }
    }
    
   task = new Task();
   
    tasks = <any>[];
    filteredProjects=<any>[];
    project=new Project();
    sortTask:string;
   
    
    getTasks(){
        let obs  = this.taskService.getTasks();
        obs.subscribe(
            (data)=>this.tasks=data
        );
    }

  
    searchProject(){
        let obs = this.projectService.getProjects();
        obs.subscribe(
            res=>{
                this.filteredProjects=res;
                const modalRef= this.ngModal.open(TaskProjectModalComponent,{size:"sm"});
                modalRef.componentInstance.filteredProjects= this.filteredProjects;
                modalRef.componentInstance.selectedProject.subscribe(
                    data=> {
                        this.project=data;
                        let obs2 = this.taskService.getTasksById(this.project.projectId);
                        obs2.subscribe(
                           res2=>this.tasks=res2
                        );
                    }
                    );
            }
            );
        
          
        
            //$('#project-modal').
        
        console.log("FilteredProjects"+JSON.stringify(this.filteredProjects));
    }

}