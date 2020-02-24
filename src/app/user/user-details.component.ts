import {Component,OnInit,OnChanges, Input, Output,EventEmitter} from '@angular/core';
import {User} from './user';
import { UserService } from './user.service';




@Component({
    selector:'app-user-list',
    templateUrl:'./user-details.component.html',
    styleUrls:[]
})

export class UserDetailsComponent implements OnChanges{
    
    constructor(private userService: UserService){
        
    }
    user:User;

    @Input() users:User[];
    @Input() sortUser:string;
    @Output() editUserDetail = new EventEmitter<User>();

    ngOnChanges(){
        //console.log("ngon changes child"+JSON.stringify(this.users));
        if(this.users){
            if(this.sortUser==='firstName'){
                this.users.sort(sortByFirstName);
            }else if( this.sortUser==='lastName'){
                this.users.sort(sortByLastName);
            }else if(this.sortUser==='employeeId'){
                this.users.sort(sortByEmployeeId);
            }
        }
    }

    
    deleteUser(user:User):void{
        let obs = this.userService.deleteUser(user);
        obs.subscribe((data)=> console.log(data));
        location.reload();
        
            
        }

    editUser(user:User):void{
        this.editUserDetail.emit(user);
    }
       
     

}
function sortByFirstName(user1:User, user2:User){
    //console.log(user1.firstName+"--"+user2.firstName)
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