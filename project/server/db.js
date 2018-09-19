var mysql = require('mysql');
var config = require('./config')

var connection = mysql.createConnection(config.db_credentials);
 
connection.connect((err)=>{
    if(err){
        console.log("There was an error connecting to the database");
        console.log(err);
    }
    else
        console.log("Successfully connected to database");
});


//USER SCHEMA
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

module.exports = connection