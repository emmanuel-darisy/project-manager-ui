import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import{Observable,of} from 'rxjs';
import {Project} from './project';
import {catchError,tap} from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class ProjectService{
    
    private url="http://localhost:8086/project";
    constructor(private http : HttpClient){}
   
    private extractData(res:Response){
        let body= res;
        return body || {};
    }

    
    httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
   };

   getProjects():Observable<Project[]>{ 
        return this.http.get<Project[]>(this.url).pipe(
            tap(_=>console.log("fetched users")),
            catchError(this.handleError<Project[]>('',[]))
            );
   }

   addProject(project: Project,userId:number) :Observable<Project>{   
    let addProjectURL= `${this.url}/${userId}`;
    return this.http.post<Project>(addProjectURL,project,{responseType: 'text' as 'json'});
   }

   updateProject(project:Project):Observable<Project>{
    return this.http.put<Project>(this.url,project,{responseType: 'text' as 'json'});
   }

   deleteProject(project:Project):Observable<Project>{
    const id= project.projectId;
    let deleteURL= `${this.url}/${id}`;
    return this.http.delete<Project>(deleteURL,{responseType: 'text' as 'json'});
   }

   private handleError<T>(operation='operation',result?:T){
    return (error:any):Observable<T>=> {
        console.error(error);
        return of(result as T);
    };
   }


}