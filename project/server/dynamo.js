const dynamo = require('dynamodb')
dynamo.AWS.config.loadFromPath('./aws_credentials.json');

module.exports = dynamo