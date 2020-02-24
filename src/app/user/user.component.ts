import {Component, OnInit, OnChanges} from '@angular/core';
import {Observable,Subject} from 'rxjs';
//import {Pipe,PipeTransform} from '@angular/core';
import {debounceTime,distinctUntilChanged,switchMap} from 'rxjs/operators';

import {User} from './user';
import {UserDetailsComponent} from './user-details.component';
import {UserService} from './user.service'
import { ToastrService } from 'ngx-toastr';


@Component({
    selector:'app-user',
    templateUrl:'./user.component.html',
    styleUrls:['./user.component.css']

})

export class UserComponent implements OnInit, OnChanges{

    _searchText:string;
    users = <any>[];
    editEnabled:boolean = false;
    sortUser:string="firstName"
    user = new User();
    filteredUsers=<any>[]

    get searchText():string{
        return this._searchText;
    }
  
    set searchText(value:string){
        this._searchText=value;
        this.filteredUsers= this.filterUsers(value);
    }

    ngOnChanges(){
        console.log("ngOnChanges");
    }


    //private searchTerms = new Subject<string>();
    
    constructor(private userService: UserService, private toastrService:ToastrService){
        console.log("constructor");
        this.filteredUsers=this.users;
    }
    sortUsers(sortUser:string){
        if(sortUser==='firstName'){
            this.filteredUsers.sort(sortByFirstName);
        }else if( sortUser==='lastName'){
            this.filteredUsers.sort(sortByLastName);
        }else if(sortUser==='employeeId'){
            this.filteredUsers.sort(sortByEmployeeId);
        }
    }
    filterUsers(term:string){
       return this.filteredUsers = this.users.filter(
            user=>user.firstName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())>-1 || 
            user.lastName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())>-1  );
    }
    /**search(term:string):void{
        console.log("Entered str"+term)
        this.searchTerms.next(term);
        let obs  = this.getUsers();
       
        this.filteredUsers = this.users.filter(
            user=>user.firstName===term);
            console.log(JSON.stringify(this.filteredUsers));
         this.users = this.filteredUsers;   
         console.log("FilteredParentList"+JSON.stringify(this.filteredUsers));
    }**/

    addUser(user:User):void{
        console.log("JSON string"+JSON.stringify(this.user));
       let obs=  this.userService.addUser(this.user as User);
       obs.subscribe(
        (data)=>{
            console.log(JSON.stringify(data));
            this.toastrService.success('Added user successfully','Success',{
                timeOut:5000
            });
        }
        );

      //this.users = this.getUsers;
       location.reload();
    }

    cancelUser(user:User):void{
       location.reload();
    }

    deleteUser(user:User):void{
       let obs = this.userService.deleteUser(user);
       this.users = this.getUsers;
       obs.subscribe(
        (data)=>{
            console.log(JSON.stringify(data));
            this.toastrService.success('Deleted user successfully','Success',{
                timeOut:3000
                
            });
            location.reload();
        }
        );
    }

    getUsers(){    
        let obs = this.userService.getUsers();
        obs.subscribe(
            (data)=> {this.users =data, this.filteredUsers=data}
        );   
    }
   
    updateUser(user:User){
        console.log("EditUser"+user.lastName);
        this.user=user;
        this.editEnabled= true;
        let obs = this.userService.updateUser(this.user as User);
        obs.subscribe(
            (data)=>{
                console.log(JSON.stringify(data));
                this.toastrService.success('Updated successfully','Success',{
                    timeOut:5000
                });
                location.reload();
            }
            );
    }
    editUser(user:User){
        //console.log("EditUser"+user.lastName);
        this.user=user;
        this.editEnabled= true;  
        window.scrollTo(0,0);      
    }
    ngOnInit(): void{
        console.log("ngOninit");
        this.users = this.getUsers();//
        console.log(JSON.stringify(this.users))
        
       
    }
}
function sortByFirstName(user1:User, user2:User){
    console.log(user1.firstName+"--"+user2.firstName)
    if(user1.firstName>user2.firstName){
        return 1;
    }else if(user1.firstName<user2.firstName){
        return -1;
    }
    else{
        return 0;
    }
}
function sortByLastName(user1:User, user2:User){
if(user1.lastName>user2.lastName){
    return 1;
}else if(user1.lastName<user2.lastName){
    return -1;
}
else{
    return 0;
}
}
function sortByEmployeeId(user1:User, user2:User){
return (user1.employeeId-user2.employeeId);
}

