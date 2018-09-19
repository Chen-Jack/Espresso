const db = require('./../db')
const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('./../config')

/*
User Schema
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
*/
class User{

  //Callback should take in errors and a jwt if successful
  static create(username, password, callback = (err, jwt)=>{}){
    bcrypt.hash(password, 8, function(err, hash) {
      if(err){
        console.log("Error with hashing password");
        callback("Error with password Hashing, User creation Aborted")
      }
      else{
        //SQL QUERY TO INSERT USER
        db.query('INSERT INTO user (id, username, password) VALUES(?,?,?)',
          [uuid(), username, hash],
          (err, results, fields)=>{
            //Let the callback handle the err, if it exists
            if(err)
              callback(err, null)
            else{
              //Sucessfully created User, create a token and send it back.
              jwt.sign({ foo: 'bar' }, config.jwt.secret, (err, token)=>{
                callback(err, token)
              });
            }
          })       
      }
    })
  }

  //Given a username string, it returns the first user entry on the table
  //Callback accepts an error and result
  static find(username, callback=()=>{}){
    db.query(`SELECT * FROM user WHERE username = ?`, username, (err, results, fields)=>{
      if(err)
        callback(err , null)
      else{
        //Return the first user of the search
        const user = {
          id: results[0].id,
          username: results[0].username,
          password: results[0].password
        }

        callback(null, user)
      }
    })
  }

  //Checks to see if the username and password is a match
  //The callback should accept error or a jwt token
  static verify(username, raw_password, callback=(err,jwt)=>{}){
    User.find(username, (err, user_query)=>{
      bcrypt.compare(raw_password, user_query.password, (err, res)=>{
        //If error or no match, then callback with no token
        if(err || res === false)
          callback(err, null)

        else{ //valid match
          jwt.sign({ id: user_query.id }, config.jwt.secret, (err, token)=>{
            console.log("GOOD SIGNING");
            callback(err, token)
          })
        }
      });
    })
  }



}

module.exports = User