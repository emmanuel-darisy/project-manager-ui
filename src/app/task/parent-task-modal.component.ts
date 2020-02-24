import {Component, Input, Output,EventEmitter} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ParentTask } from './parentTask';


@Component({
    selector:'parent-task-modal',
    templateUrl:'parent-task-modal.component.html',
    styleUrls:['../project/project-modal.component.css']
})

export class ParentTaskModalComponent{
    constructor(public activeModal: NgbActiveModal) {
        console.log("Is this called");
    }
    searchText:string;
    @Input() filteredParentTasks:ParentTask[];
    @Output() selectedParentTask= new EventEmitter<ParentTask>();

    selectParentTaskDetails(parentTask:ParentTask){
        this.selectedParentTask.emit(parentTask);
        this.activeModal.close();
    }
}