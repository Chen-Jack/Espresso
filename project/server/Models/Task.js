const db = require('./../db');
const uuid = require('uuid/v4');


class Task{

    static updateStatus(creator_id, task_id, status, callback=()=>{}){
        const sql_query = `UPDATE task SET completed = (?) WHERE creator_id = (?) AND id = (?)`
        
        status = (status ? 1 : 0) // Format it to 0,1 incase status is another falsy value

        db.query(sql_query, [status, creator_id, task_id], (err, results, fields)=>{
            if(err){
                console.log("updateStatus() error", err);
                return callback(err)
            }

            return callback()
            
        })
    }

    static create(creator_id, title="", details="", callback){
        db.query(`INSERT INTO task(id, creator_id, title, details) VALUES (?,?,?,?)`, 
            [uuid(), creator_id, title, details],
            (err, results, fields)=>{
                callback(err)
            })
    }

    static allocateTask(creator_id, task_id, date, callback=()=>{}){
        console.log("CALLED TASK", creator_id, task_id, date);
        //Date format should be yyyy-mm-dd
        const sql_query = `UPDATE task SET allocated_date = (?) WHERE creator_id = (?) AND id = (?)`

        db.query(sql_query, [date, creator_id, task_id], (err, results, fields)=>{
            if(err){
                console.log("allocateTask() error", err);
                return callback(err)
            }
            console.log("RESULTS OF allocateTask was", results);
            callback()
        })
    }

    static getTasksCreatedBy(creator_id, callback=()=>{}){
        const sql_query = `SELECT * FROM task WHERE creator_id = (?)`

        db.query(sql_query, creator_id, (err, results, fields)=>{
            if(err){
                console.log("getTasksCreatedBy() error", err);
                return callback(err,null)

            }
            
            let cleaned_results = [];
            if(results){
                cleaned_results = results.map((result)=>{
                    return {
                        id: result.id,
                        creator_id: result.creator_id,
                        title: result.title,
                        details: result.details,
                        completed: result.completed,
                        created_at: result.created_at,
                        allocated_date: result.allocated_date
                    }
                })
            }
            else{
                console.log(`There were no results returned for getTasksCreatedBy() for ${creator_id}`);
            }

            if(callback)
                callback(err,cleaned_results)
        })
    }


}

module.exports = Task