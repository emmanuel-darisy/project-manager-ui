import {Component, Input, Output,EventEmitter} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user/user';


@Component({
    selector:'project-modal',
    templateUrl:'project-modal.component.html',
    styleUrls:['project-modal.component.css']
})

export class ProjectModalComponent{
    constructor(public activeModal: NgbActiveModal) {
        console.log("Is this called");
    }
    searchText:string;
    @Input() filteredUsers:User[];
    @Output() selectedUser= new EventEmitter<User>();

    selectUser(user:User){
        this.selectedUser.emit(user);
        this.activeModal.close();
    }
}