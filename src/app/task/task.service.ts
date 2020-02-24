import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import{Observable,of} from 'rxjs';
import {Task} from './task';
import {ParentTask} from './parentTask';
import {catchError,tap} from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class TaskService{

    private url="http://localhost:8086/task";
    private parentTaskURL="http://localhost:8086/parentTask";
    constructor(private http : HttpClient){}
   
    private extractData(res:Response){
        let body= res;
        return body || {};
    }

    
    httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
   };

   getTasks():Observable<Task[]>{ 
        return this.http.get<Task[]>(this.url).pipe(
            tap(_=>console.log("fetched tasks")),
            catchError(this.handleError<Task[]>('',[]))
            );
   }

   getTasksById(projectId:number):Observable<Task[]>{ 
       let tasksByIdURL= `${this.url}/${projectId}`;
    return this.http.get<Task[]>(tasksByIdURL).pipe(
        tap(_=>console.log("fetched tasks by ID")),
        catchError(this.handleError<Task[]>('',[]))
        );
}

   //addTask(task: Task,userId:number,projectId:number,parentId:number) :Observable<Task>{   
    addTask(task: Task) :Observable<Task>{   
    let addTaskURL= `${this.url}`;
    return this.http.post<Task>(addTaskURL,task,{responseType: 'text' as 'json'});
   }

   addParentTask(parentTask: ParentTask) :Observable<ParentTask>{   
    let addParentTaskURL= `${this.parentTaskURL}`;
    return this.http.post<ParentTask>(addParentTaskURL,parentTask,{responseType: 'text' as 'json'});
   }

   getParentTasks(projectId:number):Observable<ParentTask[]>{ 
    let addParentTaskURL= `${this.parentTaskURL}/${projectId}`;
    return this.http.get<ParentTask[]>(addParentTaskURL).pipe(
        tap(_=>console.log("fetched parentTasks")),
        catchError(this.handleError<ParentTask[]>('',[]))
        );
}
   
   updateTask(task:Task):Observable<Task>{
    return this.http.put<Task>(this.url,task,{responseType: 'text' as 'json'});
   }

   
   private handleError<T>(operation='operation',result?:T){
    return (error:any):Observable<T>=> {
        console.error(error);
        return of(result as T);
    };
   }


}