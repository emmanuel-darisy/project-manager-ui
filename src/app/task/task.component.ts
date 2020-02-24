
  import {Component,OnInit} from '@angular/core';
  import { TaskService } from './task.service';
  import { ProjectService } from '../project/project.service';
  import { UserService } from '../user/user.service';
  import { Task } from './task';
  import { ActivatedRoute, Router } from '@angular/router';
  import {NgbActiveModal,NgbModal} from '@ng-bootstrap/ng-bootstrap';
  import{TaskProjectModalComponent} from './task-project-modal.component';
  import{ParentTaskModalComponent} from './parent-task-modal.component';
  import{ProjectModalComponent} from '../project/project-modal.component';
  import { ParentTask } from './parentTask';
  import { User } from '../user/user';
  import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
  
  
  @Component({
      selector:'app-task',
      templateUrl:'./task.component.html',
      styleUrls:['../project/project.component.css']
  
  })
  
  export class TaskComponent implements OnInit{
      editEnabled:boolean=false;
      viewEnabled:boolean=false;
      task = new Task();
      parentTask = new ParentTask();
      tasks = <any>[];
      parentTasks : ParentTask[];
      filteredProjects=<any>[];
      filteredParentTasks:ParentTask[];
      filteredUsers:User[];
      searchTerm:string="";
      projects=<any>[];
      users:User[];
      isParentTask:boolean;
      isDateValid:boolean;
      cancelUpdateNav:boolean;
	  
      constructor(private taskService:TaskService,private projectService:ProjectService,private route:ActivatedRoute,
          private router:Router,private ngModal:NgbModal,private userService:UserService,
          private toastrService:ToastrService,private datePipe:DatePipe){
  
      }
      ngOnInit(){
          if(history.state.data != null){
              this.task=history.state.data.task;
              this.editEnabled=history.state.data.editEnabled;
              this.viewEnabled=history.state.data.viewEnabled;
          }
          
          console.log("Doesit oninit"+JSON.stringify(this.task));
          console.log("Doesit oninit boolean"+JSON.stringify(this.editEnabled));
          this.getProjects();
          this.getUsers();
          this.getTasks();
      }
  
 
 
    formatFormObject(task:Task){
    console.log("task startDate B4"+task.startDate);
    console.log("task enddate"+task.endDate);
    
    if(task.priority==undefined){
        task.priority=0;
    }
    if(task.startDate ==undefined && task.endDate== undefined){
            task.startDate=new Date();
            task.endDate = new Date();
            task.endDate.setDate(new Date(task.startDate).getDate()+1);
    }
	if(task.startDate ==undefined && task.endDate != undefined){
        task.startDate=new Date();
	}
	if(task.startDate !=undefined && task.endDate == undefined){
        task.endDate = new Date();              
        task.endDate.setDate(new Date(task.startDate).getDate()+1);        
    }
    this.datePipe.transform(task.startDate,"yyyy-MM-dd");
    this.datePipe.transform(task.endDate,"yyyy-MM-dd");

    console.log("task startDate After"+task.startDate);
    console.log("task enddate"+task.endDate);
    }
        validateDates(startDate:Date, endDate:Date){
            
             if(startDate!=undefined && endDate !=undefined){
              if(new Date(startDate)>= new Date(endDate)){
                  this.isDateValid=false;
              }else{
                  this.isDateValid=true;
              }
             }
              return this.isDateValid;
         }
      
      searchProject(){
          
          let obs = this.projectService.getProjects();
          obs.subscribe(
              (data)=>{
                  this.projects=data;
                  const modalRef= this.ngModal.open(TaskProjectModalComponent,{size:"sm"});
                  modalRef.componentInstance.filteredProjects= this.projects;
                  modalRef.componentInstance.selectedProject.subscribe(
                      (res2)=> this.task.project=res2
                  );
              }
          );
         // this.filteredProjects = this.filterProjects(searchTerm);
          //$('#project-modal').
          
         
          console.log("FilteredProjects"+JSON.stringify(this.filteredProjects));
      }
      searchParentTask(projectId:number){
          
          let obs = this.taskService.getParentTasks(projectId);
          obs.subscribe(
              res=>{
                  this.parentTasks=res;
                  console.log("AfterMod"+this.parentTasks)
                  const modalRef= this.ngModal.open(ParentTaskModalComponent,{size:"sm"});
                  modalRef.componentInstance.filteredParentTasks= this.parentTasks;
                  modalRef.componentInstance.selectedParentTask.subscribe(
                      (data)=> this.task.parentTask=data
                  );
              }
          );
      }
      searchManager(){
          
          let obs = this.userService.getUsers();
          //$('#project-modal').
          obs.subscribe(
              res=>{
                  this.filteredUsers=res
                  const modalRef= this.ngModal.open(ProjectModalComponent,{size:"sm"});
          modalRef.componentInstance.filteredUsers= this.filteredUsers;
          modalRef.componentInstance.selectedUser.subscribe(
              (data)=> this.task.user=data
          );
              }
          );
          
          console.log("FilteredUsers"+JSON.stringify(this.filteredUsers));
      }
      addTask(task:Task, isParentTask:boolean){
		  let hasErrors:boolean=false;
		  if(task.project == undefined){
			  hasErrors=true;
			  this.toastrService.error('Please select project ','Error',{
                    timeOut:5000
              });
		  }
		  
		  if(!isParentTask){
			   this.formatFormObject(this.task);
			   if(!this.validateDates(task.startDate,task.endDate)){
				   hasErrors=true;
				    this.toastrService.error('Start Date cannot be greater than End Date','Error',{
                    timeOut:5000
                  });
               }
               if(task.user == undefined){
                hasErrors=true;
                 this.toastrService.error('Please select user','Error',{
                 timeOut:5000
               });
            }
		  }
		  if(!hasErrors){
			   if(isParentTask){
              console.log("Project "+this.parentTask.project);
              this.parentTask.parentTaskName=task.taskName;
              this.parentTask.project=task.project;
              
                let obs = this.taskService.addParentTask(this.parentTask);
                obs.subscribe(
                    data=>{
                       
                    console.log(JSON.stringify(data));
                    this.toastrService.success('Task added successfully','Success',{
                        timeOut:5000
                    });
                        
                    }
                    );
                    location.reload();
          }else{
              console.log("TaskDetails"+JSON.stringify(task));
   
                  let obs = this.taskService.addTask(task);
              obs.subscribe(
                  data=>{
                     
                  console.log(JSON.stringify(data));
                  this.toastrService.success('Added task successfully','Success',{
                      timeOut:5000
                  });   
                  location.reload();                   
                  }
                  );
          }
		  }else{
			      this.toastrService.warning('Please select missing fields','Warning',{
                      timeOut:5000
                  });                      
		  }
         
          
      }
     
      //sliderType=SliderType;
  
      
      getTasks(){
          let obs  = this.taskService.getTasks();
          obs.subscribe(
              (data)=>this.tasks=data
          );
      }
  
  
      getParentTasks(projectId:number){
          let obs  = this.taskService.getParentTasks(projectId);
          obs.subscribe(
              (data)=>this.parentTasks=data
          );
          console.log("PrintThis"+this.parentTasks);
      }
  
      getProjects(){
          let obs = this.projectService.getProjects();
          obs.subscribe(
              (data)=>this.projects=data
          );
      }
     
      filterProjects(term:string){
          return this.filteredProjects = this.projects;
      }
  
      udpateTask(task:Task){
          let obs = this.taskService.updateTask(task);
          obs.subscribe(
              data=>{
                 
              console.log(JSON.stringify(data));
              this.toastrService.success('Updated task successfully','Success',{
                  timeOut:5000
              });
                  
              }
              );
      }

      cancelUpdateTask(task:Task,cancelUpdateNav:boolean){
        console.log("CancelTask"+task.project.projectId);
        cancelUpdateNav = true;
        this.router.navigate(['/viewtask'], {state:{data:{task,cancelUpdateNav}}});
      }
      getUsers(){    
          let obs = this.userService.getUsers();
          obs.subscribe(
              (data)=> this.users =data
          );   
          }
          
      filterUsers(term:string){
              return this.filteredUsers = this.users;
      }
  }