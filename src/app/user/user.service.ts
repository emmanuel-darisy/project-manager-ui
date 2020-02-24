import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import{Observable,of} from 'rxjs';
import {User} from './user';
import {catchError,tap} from 'rxjs/operators';




@Injectable({providedIn:'root'})
export class UserService{

    private url="http://localhost:8086/user";
    constructor(private http : HttpClient){}
   
    private extractData(res:Response){
        let body= res;
        return body || {};
    }

    
    httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
   };

   getUsers():Observable<User[]>{ 
       
        return this.http.get<User[]>(this.url).pipe(
            tap(_=>console.log("fetched users")),
            catchError(this.handleError<User[]>('',[]))
            );
        
   }

   addUser(user: User) :Observable<User>{   
    return this.http.post<User>(this.url,user);
   }

   updateUser(user:User):Observable<User>{
    return this.http.put<User>(this.url,user);
   }

   deleteUser(user:User):Observable<User>{
       console.log("userID"+user.userId);
    const id= typeof user === 'number' ?user :user.userId;
    let deleteURL= `${this.url}/${id}`;
    return this.http.delete<User>(deleteURL,{responseType: 'text' as 'json'});
   }
   private handleError<T>(operation='operation',result?:T){
    return (error:any):Observable<T>=> {
        console.error(error);
        return of(result as T);
    };
   }


}