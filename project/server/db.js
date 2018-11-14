var mysql = require('mysql');
var config = require('./config')

const connection = mysql.createConnection(config.db_credentials);
 
connection.connect((err)=>{
    if(err){
        console.log("There was an error connecting to the database");
        console.log(err);
    }
    else
        console.log("Successfully connected to database");
});


//USER TABLE
connection.query(`CREATE TABLE IF NOT EXISTS 
    user(
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )`, (err, results, fields)=>{
        if(err)
            console.log("Error when creating User Table", err);
        else{
            console.log("User Table is now ready");
        }
    }
)

//TASK TABLE
connection.query(`CREATE TABLE IF NOT EXISTS 
    task(
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        creator_id VARCHAR(36) NOT NULL,
        title TEXT NOT NULL,
        details TEXT, 
        completed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        allocated_date DATE,
        FOREIGN KEY (creator_id) REFERENCES user(id)
    )`, (err, results, fields)=>{
        if(err)
            console.log("Error when creating Task Table", err);
        else{
            console.log("Task Table is now ready");
        }
    }
)

module.exports = connection