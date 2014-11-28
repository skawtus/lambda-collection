var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var DEBUG = true;



function notify_arrival(req,res,callback){

    var sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        region: 'us-west-2'
    });

    var params = {
        QueueUrl: process.env.SNOWBALL_QUEUE, /* required */
        AttributeNames: [
            'All'
        ],
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 0,
        WaitTimeSeconds: 0
    };
    sqs.receiveMessage(params,  function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json([err,err.stack]);
        }
        else {
            //console.log(data);
            callback(req,res, data);
        }
    });

}

function handle_messages(req, res, data, callback){

    _.each(data.Messages, function(message){
        var c = JSON.parse(message.Body);
        if( !("a" in c.query) || store(c)) {
            delete_queue_message(message)
        }
    });

    callback(req,res);
}

function store(content){
    //debugger;
    //TODO store this message...
    return false;
}

function delete_queue_message(msg){

    var sqs = new AWS.SQS({
        apiVersion: '2012-11-05',
        region: 'us-west-2'
    });
    var params = {
        QueueUrl: process.env.SNOWBALL_QUEUE,
        ReceiptHandle: msg.ReceiptHandle
    };
    sqs.deleteMessage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}

router.get('/', function(req, res) {
    notify_arrival(req,res,function(req,res,data){
        handle_messages(req, res, data, function(req,res){

            if(DEBUG) res.json(["Ok"]);  //respond outside of handler for quickness
        });
    });
    if(!DEBUG) res.json(["Ok"]);
});

module.exports = router;
