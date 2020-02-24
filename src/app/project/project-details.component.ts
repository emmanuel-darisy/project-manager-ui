import {Component,OnInit,OnChanges, Input, Output,EventEmitter} from '@angular/core';
import {Project} from './project';
import { ProjectService } from './project.service';




@Component({
    selector:'app-project-list',
    templateUrl:'./project-details.component.html',
    styleUrls:[]
})

export class ProjectDetailsComponent implements OnChanges{
    
    constructor(private projectService: ProjectService){
        
    }
    project:Project;

    //temp variables for testing
    tasksCompleted:number=10;
    tasksCount:number=15;
    startDate:string='11/27/2019';
    endDate:string='12/15/2019';
    priority:number=5;
    

    @Input() projects:Project[];
    @Input() sortProject:string="startDate";
    @Output() editProject = new EventEmitter<Project>();

    ngOnChanges(){
        console.log("Inside child"+JSON.stringify(this.projects));
        if(this.projects){
            if(this.sortProject==='startDate'){
                this.projects.sort(sortByStartDate);
            }else if( this.sortProject==='endDate'){
                this.projects.sort(sortByEndDate);
            }else if(this.sortProject==='priority'){
                this.projects.sort(sortByPriority);
            }else if(this.sortProject==='completed'){
                this.projects.sort(sortByCompleted);
            }
        }
    }

    updateProject(project:Project){
        console.log("Child");
        this.editProject.emit(project);
    }
   
    suspendProject(){

    }
     

}
function sortByStartDate(project1:Project, project2:Project){
    return <any>new Date(project1.startDate) - <any>new Date(project2.startDate);
}
function sortByEndDate(project1:Project, project2:Project){
    return <any>new Date(project1.endDate) - <any>new Date(project2.endDate);
}
function sortByPriority(project1:Project, project2:Project){
    return (project1.priority-project2.priority);
}
function sortByCompleted(project1:Project, project2:Project){
    return (project2.completedTasks-project1.completedTasks);
}