const dynamo = require('./../dynamo.js')
const Joi = require('joi')

var User = dynamo.define('User', {
    hashKey : 'username',
    schema : {
      username: Joi.string(),
      password: Joi.string(),
      email   : Joi.string().email()
    }
  });

module.exports = User