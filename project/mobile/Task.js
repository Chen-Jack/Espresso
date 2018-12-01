import uuid from 'uuid/v4';
import {AsyncStorage} from 'react-native'


export default class Task{

    static updateStatus(task_id, new_status, cb=()=>{}){
        new_status = (new_status ? true : false) //Convert all falsy statements to bools

        AsyncStorage.getItem("espresso_app", (err, app)=>{
            if(err)
                return cb(err)

            const app_data = JSON.parse(app)
            const tasks = app_data.tasks
            tasks[task_id].completed = new_status

            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data),(err)=>{
                if(err){
                    return cb(err)
                }

                console.log("Status Updated to", app_data);
                cb()
            })
        })
    }

    static createTask(title="", details="", cb=()=>{}){
       const new_task = {
           task_id : uuid(),
           title : title,
           details: details,
           completed: false,
           allocated_date: null
       }
       console.log("Creating a new task", new_task);
       AsyncStorage.getItem("espresso_app", (err, app)=>{
           if(err){
                cb(err)
           }
           const app_data = JSON.parse(app)
           const tasks = app_data.tasks
           console.log("Tasks is,,,", tasks);
           tasks[new_task.task_id] = new_task

           AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
               console.log("Created Task");
               cb(err, new_task)
           })
       })
    }

    // static editTask(creator_id, task_id, title, details, cb=()=>{}){
    //     if(title && details){
    //         const sql_query = `UPDATE task SET title = (?) details = (?) WHERE creator_id = (?) AND id = (?)`
    //         db.query(sql_query, [title, details, creator_id, task_id], (err, results, fields)=>{
    //             if(err){
    //                 console.log("editTask() error(title and details)", err);
    //                 return callback(err)
    //             }
    //             callback()
    //         })
    //     }
    //     else if(title && !details){
    //         const sql_query = `UPDATE task SET title = (?) WHERE creator_id = (?) AND id = (?)`
    //         db.query(sql_query, [title, creator_id, task_id], (err, results, fields)=>{
    //             if(err){
    //                 console.log("editTask() error(title ", err);
    //                 return callback(err)
    //             }
    //             callback()
    //         })
    //     }
    //     else if(!title && details){
    //         const sql_query = `UPDATE task SET details = (?) WHERE creator_id = (?) AND id = (?)`
    //         db.query(sql_query, [details, creator_id, task_id], (err, results, fields)=>{
    //             if(err){
    //                 console.log("editTask() error(details)", err);
    //                 return callback(err)
    //             }
    //             callback()
    //         })
    //     }
    //     else{
    //         return console.log("WHAT< ERROR WITH TASK EDITING")
    //     }
    // }

    static deleteTask(task_id, cb=()=>{}){
        AsyncStorage.getItem("espresso_app", (err,app)=>{
            if(err){
                cb(err)
            }
            const app_data = JSON.parse(app)
            const tasks = app_data.tasks
            delete tasks[task_id]
            AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), (err)=>{
                cb(err)
            })
        })
    }

    static allocateTask(task_id, date, cb=()=>{}){
       AsyncStorage.getItem("espresso_app", (err,app)=>{
           if(err){
               cb(err)
           }
           const app_data = JSON.parse(app)
           const tasks = app_data.tasks
           tasks[task_id].allocated_date = date
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