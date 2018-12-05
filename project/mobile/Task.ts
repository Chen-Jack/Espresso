import uuid from 'uuid/v4';
import {AsyncStorage} from 'react-native'

interface Task{
    task_id : string,
    title: string,
    details: string | null,
    completed: boolean,
    allocated_date : string | null,
}


export default class TaskStorage{

    static updateStatus(task_id : string, new_status : boolean, cb = (err ?: any)=>{}){
        new_status = (new_status ? true : false) //Convert all falsy statements to bools

        AsyncStorage.getItem("espresso_app", (err, app)=>{
            if(err)
                return cb(err)

            const app_data = (JSON.parse(app as string))
            const task = <Task> app_data.tasks[task_id]
            task.completed = new_status

            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data),(err)=>{
                if(err){
                    return cb(err)
                }

                console.log("Status Updated to", app_data);
                cb()
            })
        })
    }

    static createTask(title : string = "", details : string="", cb = (err ?: any, new_task ?: Task)=>{}){
       const new_task = {
           task_id : uuid(),
           title : title,
           details: details,
           completed: false,
           allocated_date: null
       }
       AsyncStorage.getItem("espresso_app", (err, app)=>{
           if(err){
                cb(err)
           }
           const app_data = JSON.parse(app as string)
           const tasks = app_data.tasks
           tasks[new_task.task_id] = <Task> new_task

           AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
               console.log("Created Task");
               cb(err, new_task)
           })
       })
    }


    static editTask(task_id : string, new_title : string, new_details : string, cb=(err ?: any)=>{}){
        console.log(`Editing for ${task_id} ${new_title} ${new_details}`);
        AsyncStorage.getItem("espresso_app", (err,app)=>{
            if(err){
                cb(err)
            }
            const app_data = JSON.parse(app as string)
            const task = <Task> app_data.tasks[task_id]
            task.title = new_title
            task.details = new_details
            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
                cb(err)
            })
        })
    }

    static deleteTask(task_id : string, cb=(err ?: any)=>{}){
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

    static allocateMultipleTasks(task_id_arr : Array<Task>, date : string, cb=(err?: any)=>{}){
        AsyncStorage.getItem("espresso_app", (err,app)=>{
            if(err){
                cb(err)
            }
            const app_data = JSON.parse(app as string)
            const tasks = app_data.tasks
            for(let task_id in task_id_arr){
                tasks[task_id].allocated_date = date
            }
            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
                cb(err)
            })
        })
    }


    static allocateTask(task_id :string, date:string, cb=(err?:any)=>{}){
       AsyncStorage.getItem("espresso_app", (err,app)=>{
           if(err){
               cb(err)
           }
           const app_data = JSON.parse(app as string)
           const task = <Task> app_data.tasks[task_id]
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