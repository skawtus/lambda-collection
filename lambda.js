
var AWS = require('aws-sdk');
var sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'us-west-2'
});

function notified(data){
    delete_queue_messages(data, function(data){
        if( data.Successful !== undefined && data.Successful.length > 0) {
            notify_arrival(notified);
        }
    });
}

function notify_arrival(callback){

    var params = {
        QueueUrl: process.env.SNOWBALL_QUEUE, /* required */
        AttributeNames: [
            'All'
        ],
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 1,
        WaitTimeSeconds: 0
    };
    sqs.receiveMessage(params,  function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            callback(data);
        }
    });

}

function delete_queue_messages(data, callback){

    var params = {
        QueueUrl: process.env.SNOWBALL_QUEUE,
        Entries: []
    };

    var ctr=0;

    if( data.Messages === undefined ){
        callback({});
        return;
    }

    data.Messages.forEach( function(msg){
        params.Entries.push({
            Id: msg.MessageId,
            ReceiptHandle: msg.ReceiptHandle
        });
    });


    sqs.deleteMessageBatch(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            console.log( JSON.stringify({
                context: "sqs.deleteMessageBatch",
                data: data
            }, null, '  '));
            callback(data);
        }
    });
}

function handler(event, context) {
    console.log(JSON.stringify(event, null, '  '));
    notify_arrival( notified );
};


exports.delete_queue_messages =  delete_queue_messages;
exports.notify_arrival = notify_arrival;
exports.handler = handler;

