import {Component, Input, Output,EventEmitter} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../project/project';


@Component({
    selector:'task-project-modal',
    templateUrl:'task-project-modal.component.html',
    styleUrls:['../project/project-modal.component.css']
})

export class TaskProjectModalComponent{
    constructor(public activeModal: NgbActiveModal) {
        console.log("Is this called");
    }
    searchText:string;
    @Input() filteredProjects:Project[];
    @Output() selectedProject= new EventEmitter<Project>();

    selectProject(project:Project){
        this.selectedProject.emit(project);
        this.activeModal.close();
    }
}