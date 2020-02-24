import { User } from '../user/user';

export class Project{
    projectId:number;
    projectName:string;
    startDate:Date;
    endDate:Date;
    taskCount:number;
    priority:number;
    completedTasks:number;
    //setDate?:boolean;
    user:User;
}