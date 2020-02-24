import {Component, OnInit, Injector} from '@angular/core';
import {Project} from './project';
import {ProjectService} from './project.service';
import {ProjectDetailsComponent} from './project-details.component';
import { IgxTreeGridSummaryPipe } from 'igniteui-angular/lib/grids/tree-grid/tree-grid.summary.pipe';
import { UserService } from '../user/user.service';
import {ProjectModalComponent} from './project-modal.component';
//import $ from 'assets/jquery.js';
import {NgbActiveModal,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user/user';
import { ToastrService } from 'ngx-toastr';
//import { DatePipe } from '@angular/common';
import { stringify } from 'querystring';
import { DatePipe } from '@angular/common';



@Component({
    selector:'app-project',
    templateUrl:'./project.component.html',
    styleUrls:['./project.component.css']

})

export class ProjectComponent implements OnInit{
    disableStartEndDate:boolean=true;
    updateEnabled:boolean=false;
    sortProject:string="startDate"
    searchTerm:string="";
    users:User[];
    filteredUsers:User[];
    user:User;
    setDate:boolean=false;
    search:string;
    isDateValid:boolean;
    error:any={isError:false,errorMessage:""};
    filteredProjects=<any>[];

    constructor(private projectService:ProjectService,private userService:UserService
        ,private ngModal:NgbModal,private toastrService:ToastrService,private datePipe:DatePipe){

    }

    searchManager(searchTerm:string){
        this.searchTerm=searchTerm;
        console.log("Search term"+searchTerm);
        this.getUsers();
        this.filteredUsers = this.filterUsers(searchTerm);
        //$('#project-modal').
        
        const modalRef= this.ngModal.open(ProjectModalComponent,{size:"sm"});
        modalRef.componentInstance.filteredUsers= this.filteredUsers;
        modalRef.componentInstance.selectedUser.subscribe(
            (data)=> this.project.user=data
        );
        console.log("FilteredUsers"+JSON.stringify(this.filteredUsers));
    }

    changeCheck(event){
        this.disableStartEndDate= !event.checked;
    }


    project = new Project();
    projects = <any>[];
    projectList:Project[] = [
    /**{projectId:12,projectName:'',startDate:new Date('12/12/2004'),endDate:new Date('12/11/2005'),taskCount:7,priority:6,completedTasks:10},
    {projectId:13,projectName:'',startDate:new Date('12/11/2004'),endDate:new Date('12/12/2005'),taskCount:4,priority:15,completedTasks:5}
    **/];
   // sliderType=SliderType;
    
   ngOnInit(){
        this.projects=this.getProjects(); 
        this.getUsers();
   }
   
   
   sortProjects(sortUser:string){
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

   validateDates(startDate:Date, endDate:Date){
      console.log("validateDate"+startDate +endDate);
       if(startDate!=undefined && endDate !=undefined){
        if(new Date(startDate)>= new Date(endDate)){
            this.isDateValid=false;
        }else{
            this.isDateValid=true;
        }
       }
        return this.isDateValid;
   }

   formatFormObject(project:Project){
    console.log("Project startDate B4"+project.startDate);
    console.log("Project enddate"+project.endDate);
    
    if(project.priority==undefined){
        project.priority=0;
    }
    if(project.startDate ==undefined && project.endDate== undefined){
            project.startDate=new Date();
            project.endDate = new Date();
            project.endDate.setDate(new Date(project.startDate).getDate()+1);
    }
	if(project.startDate ==undefined && project.endDate != undefined){
        project.startDate=new Date();
	}
	if(project.startDate !=undefined && project.endDate == undefined){
        project.endDate = new Date();              
        project.endDate.setDate(new Date(project.startDate).getDate()+1);        
    }
    this.datePipe.transform(project.startDate,"yyyy-MM-dd");
    this.datePipe.transform(project.endDate,"yyyy-MM-dd");

    console.log("Project startDate After"+project.startDate);
    console.log("Project enddate"+project.endDate);
    }


   
   addProject(project:Project){
       this.formatFormObject(project);
console.log(this.validateDates(project.startDate,project.endDate));

        if(this.validateDates(project.startDate,project.endDate)){
            if(project.user != null && project.user!=undefined){
                let obs = this.projectService.addProject(this.project,this.project.user.userId);
                obs.subscribe(
                 data=>{
                    
                 console.log(JSON.stringify(data));
                 this.toastrService.success('Project added successfully','Success',{
                     timeOut:5000
                 });
                 location.reload();
                 }
                 );
            }else{
                this.toastrService.error('Please select manager','Error',{
                    timeOut:5000
                });
            }
            console.log("ProjectDetails"+JSON.stringify(project));
            
           // location.reload();
        }else{
            this.toastrService.error('Start Date cannot be greater than End Date','Error',{
                timeOut:5000
            });
        }
   }

   getProjects(){
        let obs = this.projectService.getProjects();
        obs.subscribe(
            (data)=>{
                this.projects=data;
                this.filteredProjects=this.projects;
            }
            
            );


        console.log(this.projects);
   }

   updateProjectDetail(project:Project){
    let obs = this.projectService.updateProject(this.project as Project);
    obs.subscribe(
        data=>{
           
        console.log(JSON.stringify(data));
        this.toastrService.success('Project updated successfully','Success',{
            timeOut:5000
        });
        location.reload();
        }
        
        );
        
   }

   suspendProject(project:Project){
    let obs = this.projectService.deleteProject(project);
    obs.subscribe(
        data=>{
        console.log(JSON.stringify(data));
        this.toastrService.success('Project deleted successfully','Success',{
            timeOut:5000
        });
        location.reload();
        }
        
        );
        
   }
   get searchText():string{
    return this._searchText;
}

set searchText(value:string){
    this._searchText=value;
    this.filteredProjects= this.filterProjects(value);
}
_searchText:string;

 filterProjects(term:string){
     console.log("searchTerm"+term);
   return this.filteredProjects = this.projects.filter(

        project=>project.projectName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())>-1);
}

   updateProject(project:Project){
        this.project = project;
        this.updateEnabled = true;
        window.scrollTo(0,0);
   }


   cancelProject(project:Project){
    location.reload();
    }
   getUsers(){    
    let obs = this.userService.getUsers();
    obs.subscribe(
        (data)=> this.users =data
    );   
    }
    
    filterUsers(term:string){
        return this.filteredUsers = this.users.filter(
         user=>user.firstName.indexOf(term)>-1 || user.lastName.indexOf(term)>-1  );
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