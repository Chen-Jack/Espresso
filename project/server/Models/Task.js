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


}

module.exports = Task