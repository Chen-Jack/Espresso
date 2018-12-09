import uuid from 'uuid/v4';
import {AsyncStorage} from 'react-native'

export interface Taskable{
    task_id : string,
    title: string,
    details: string | null,
    completed: boolean,
    allocated_date : string | null,
}

export interface TaskSet{
    date: string,
    tasks: Taskable[]
}

export default class TaskStorage{

    static updateStatus(task_id : string, new_status : boolean, cb : (err?:any)=> void){
        new_status = (new_status ? true : false) // Convert all falsy statements to bools
        
        AsyncStorage.getItem("espresso_app", (err, app)=>{
            if(err){
                return cb(err)
            }

            const app_data = (JSON.parse(app as string))
            const task = app_data.tasks[task_id] as Taskable
            task.completed = new_status

            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
                if(err){
                    return cb(err)
                }
                cb()
            })
        })
    }

    static createTask(title : string = "", details : string | null = "", cb ?: (err : any, new_task : Taskable) => void){
       const new_task = {
           task_id : uuid(),
           title,
           details,
           completed: false,
           allocated_date: null
       } as Taskable

       AsyncStorage.getItem("espresso_app", (err, app)=>{
           if(err){
                cb(err)
           }
           const app_data = JSON.parse(app as string)
           const tasks = app_data.tasks
           tasks[new_task.task_id] = new_task as Taskable

           AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
               console.log("Created Task");
               cb(err, new_task)
           })
       })
    }


    static editTask(task_id : string, new_title : string, new_details : string | null, cb ?: (err : any)=>void){
        console.log(`Editing for ${task_id} ${new_title} ${new_details}`);
        AsyncStorage.getItem("espresso_app", (err,app)=>{
            if(err){
                cb(err)
            }
            const app_data = JSON.parse(app as string)
            const task = app_data.tasks[task_id] as Taskable
            task.title = new_title
            task.details = new_details
            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
                cb(err)
            })
        })
    }

    static deleteTask(task_id : string, cb ?:(err ?: any)=>void){
        AsyncStorage.getItem("espresso_app", (err,app)=>{
            if(err){
                cb(err)
            }
            const app_data = JSON.parse(app as string)
            const tasks = app_data.tasks
            delete tasks[task_id]
            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
                cb(err)
            })
        })
    }

    static allocateMultipleTasks(task_id_arr : string[] , date : string | null, cb ?:(err?: any)=>void){
        AsyncStorage.getItem("espresso_app", (err,app)=>{
            if(err){
                cb(err)
            }
            const app_data = JSON.parse(app as string)
            const tasks = app_data.tasks
            for(const task_id in task_id_arr){
                tasks[task_id].allocated_date = date
            }
            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
                cb(err)
            })
        })
    }


    static allocateTask(task_id :string, date: string | null, cb ?:(err?:any) => void){
       AsyncStorage.getItem("espresso_app", (err,app)=>{
           if(err){
               cb(err)
           }
           const app_data = JSON.parse(app as string)
           const task = app_data.tasks[task_id] as Taskable
           task.allocated_date = date
           AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
               cb(err)
           })
       })
    }

    // static getAllTasks(cb=()=>{}){
    //     AsyncStorage.getItem("espresso_app", (err, app)=>{
    //         if(err)
    //             return cb(err)

    //         const app_data = JSON.parse(app)
    //         console.log("App data is", app_data);
    //         if(app_data)
    //             return cb(null, app_data.tasks)
    //         else
    //             return cb(null, [])
    //     })
    // }


}