import uuid from 'uuid/v4';
import {AsyncStorage} from 'react-native'


export default class Task{

    static updateStatus(task_id, status, cb=()=>{}){
        
        status = (status ? 1 : 0) // Format it to 0,1 incase status is another falsy value

        AsyncStorage.getItem("espresso_app", (err, app)=>{
            if(err)
                return cb(err)

            const app_data = JSON.parse(app)
            const tasks = app_data.tasks
            tasks[task_id].status = status

            AsyncStorage.setItem("espresso_app", JSON.stringify(tasks),(err)=>{
                if(err)
                    return cb(err)

                console.log("Status Updated");
                cb()
            })
        })
    }

    static create(title="", details="", callback){
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
           const app_data = JSON.parse(app)
           const tasks = app_data.tasks
           tasks.push(new_task)

           AsyncStorage.setItem("espress_app", JSON.stringify(app_data), (err)=>{
               console.log("Created Task");
               cb(null, new_task)
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

    // static allocateTask(creator_id, task_id, date, callback=()=>{}){
    //     console.log("CALLED TASK", creator_id, task_id, date);
    //     //Date format should be yyyy-mm-dd
    //     const sql_query = `UPDATE task SET allocated_date = (?) WHERE creator_id = (?) AND id = (?)`

    //     db.query(sql_query, [date, creator_id, task_id], (err, results, fields)=>{
    //         if(err){
    //             console.log("allocateTask() error", err);
    //             return callback(err)
    //         }
    //         console.log("RESULTS OF allocateTask was", results);
    //         callback()
    //     })
    // }

    static getAllTasks(cb=()=>{}){
        AsyncStorage.getItem("espresso_app", (err, app)=>{
            if(err)
                return cb(err)

            const app_data = JSON.parse(app)
            console.log("App data is", app_data);
            if(app_data)
                return cb(null, app_data.tasks)
            else
                return cb(null, null)
        })
    }


}