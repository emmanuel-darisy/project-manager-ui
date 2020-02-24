import { Project } from '../project/project';
import { User } from '../user/user';
import { ParentTask } from './parentTask';

export class Task{
    taskId:number;
    taskName:string;
    startDate:Date;
    endDate:Date;
    priority:number;
    status:string;
    project:Project;
    user:User;
    parentTask:ParentTask;
}