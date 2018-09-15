const dynamo = require('./../dynamo.js')
const Joi = require('joi')

var User = dynamo.define('User', {
    hashKey : 'id',
    timestamps: true,
    schema : {
      id: Joi.string(),
      username: Joi.string(),
      password: Joi.string(),
      email   : Joi.string(),
    }
  });

// User.test = function(){
//   console.log("Test success")
// }

module.exports = User