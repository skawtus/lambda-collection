
var AWS = require('aws-sdk');
var sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'us-west-2'
});
var lambda = new AWS.Lambda({
    apiVersion: '2014-11-11',
    region: 'us-west-2'
})

function notified(data, context){
    process_queue_messages(data, function(data){
        delete_queue_messages(data, function(data){
            if( data.Successful !== undefined && data.Successful.length > 0) {
                notify_arrival(notified, context);
            } else {
                context.done(null,'No messages left to process');
            }
        });
    })
}

function notify_arrival(callback, context){

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
            context.done(null,'no messages received.');
        }
        else {
            callback(data,context);
        }
    });

}

function process_queue_messages(data, callback){

    if( data.Messages !== undefined){
        var msgs = [];
        data.Messages.forEach( function(msg){
            msgs.push(JSON.parse(msg.Body));
        });
        var params = {
            FunctionName: process.env.PROCESS_FUNCTION, /* required */
            InvokeArgs: JSON.stringify(msgs) /* required */
        };
        lambda.invokeAsync(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                context.done(null,'unable to invoke lamba process function.');
            }
            else {
                console.log( JSON.stringify({
                    context: "lamba.invokeAsync "+process.env.PROCESS_FUNCTION,
                    data: data
                }, null, '  '));
            }
        });
    }
    callback(data);

}

function delete_queue_messages(data, callback){

    var params = {
        QueueUrl: process.env.SNOWBALL_QUEUE,
        Entries: []
    };

    if( data.Messages === undefined ){
        return callback({});
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
    notify_arrival( notified, context );
};


exports.delete_queue_messages =  delete_queue_messages;
exports.notify_arrival = notify_arrival;
exports.handler = handler;

