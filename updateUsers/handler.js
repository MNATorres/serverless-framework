const {
    DynamoDBDocument
} = require('@aws-sdk/lib-dynamodb');

const {
    DynamoDB
} = require('@aws-sdk/client-dynamodb');

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = DynamoDBDocument.from(new DynamoDB(dynamoDBClientParams))

const updateUsers = async (event, context) => {

    let userId = event.pathParameters.id

    const body = JSON.parse(event.body)

    var params = {
        TableName: 'usersTable',
        Key: { pk: userId },
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: { '#name' : 'name' },
        ExpressionAttributeValues:
            { ':name' : body.name },
        ReturnValues: 'ALL_NEW'
    };

    return dynamodb.update(params).then(res => {
        console.log(res)
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res.Attributes })
        }
    });
}

module.exports = {
    updateUsers
}
