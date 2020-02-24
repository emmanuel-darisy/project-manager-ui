import {Component,OnInit,OnChanges, Input, Output,EventEmitter} from '@angular/core';
import {Task} from './task';
import {Project} from '../project/project';
import { TaskService } from './task.service';
import { ProjectService } from '../project/project.service';
import{Router, ActivatedRoute} from '@angular/router';
import{TaskProjectModalComponent} from './task-project-modal.component';
import {NgbActiveModal,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import{RouterModule} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector:'app-task-list',
    templateUrl:'./task-details.component.html',
    styleUrls:[]
})

export class TaskDetailsComponent implements OnChanges{
    
    constructor(private taskService: TaskService, 
        private projectService:ProjectService,private router:Router,private ngModal:NgbModal
        ,private toastrService:ToastrService,private route:ActivatedRoute){
        
    }
    task:Task;
    editEnabled:boolean=false;
    viewEnabled:boolean=false;
    projects:Project[];
    filteredProjects:any[];

    @Input() tasks:Task[];
    @Input() sortTask:string;
    @Output() editUserDetail = new EventEmitter<Task>();

   
    ngonInit(){
        console.log("Inside ngOninit");
        if(history.state.data != null){
            this.task=history.state.data.task;   
            console.log(this.task);         
        }
    }
    

    ngOnChanges(){
        //console.log("ngon changes child"+JSON.stringify(this.users));
        if(this.tasks){
            if(this.sortTask==='startDate'){
                this.tasks.sort(sortByStartDate);
            }else if( this.sortTask==='endDate'){
                this.tasks.sort(sortByEndDate);
            }else if(this.sortTask==='priority'){
                this.tasks.sort(sortByPriority);
            }
        }
    }
    
     editTask(task:Task, editEnabled:boolean){
         console.log("EditTask"+task);
         editEnabled = true;
        this.router.navigate(['/task'], {state:{data:{task,editEnabled}}});
     }  
     viewTask(task:Task, viewEnabled:boolean){
        console.log("EditTask"+task);
        viewEnabled = true;
       this.router.navigate(['/task'], {state:{data:{task,viewEnabled}}});
    }  

     endTask(task:Task){
         console.log("Inside endTask"+JSON.stringify(task));
        task.status="Completed";
       let obs = this.taskService.updateTask(task);
       obs.subscribe(
           res=>{
            console.log(JSON.stringify(res));
            this.toastrService.success('Updated task successfully','Success',{
                timeOut:5000
            });
           }
       );
       //location.reload();
    } 
    searchProject(){
        
        let obs = this.projectService.getProjects();
        obs.subscribe(
            res=>{
                this.filteredProjects=res;
            }
            );
        
        //$('#project-modal').
        const modalRef= this.ngModal.open(TaskProjectModalComponent,{size:"sm"});
        modalRef.componentInstance.filteredProjects= this.filteredProjects;
        modalRef.componentInstance.selectedProject.subscribe(
            (data)=> this.task.project=data
        );
        console.log("FilteredProjects"+JSON.stringify(this.filteredProjects));
    }
    getTasks(){
        let obs  = this.taskService.getTasks();
        obs.subscribe(
            (data)=>this.tasks=data
        );
    }
    

}
function sortByStartDate(task1:Task, task2:Task){
    return <any>new Date(task1.startDate) - <any>new Date(task2.startDate);
}
function sortByEndDate(task1:Task, task2:Task){
    return <any>new Date(task1.endDate) - <any>new Date(task2.endDate);
}
function sortByPriority(task1:Task, task2:Task){
    return (task1.priority-task2.priority);
}
