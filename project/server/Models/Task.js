const db = require('./../db');
const uuid = require('uuid/v4');

/*
task Schema
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    creator_id VARCHAR(36) NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
*/

class Task{

    static create(creator_id, title="", details="", callback){
        db.query(`INSERT INTO task(id, creator_id, title, details) VALUES (?,?,?,?)`, 
            [uuid(), creator_id, title, details],
            (err, results, fields)=>{
                callback(err)
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
                        details: result.title,
                        completed: result.completed,
                        created_at: result.created_at
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