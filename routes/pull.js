var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var DEBUG = true;

var sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'us-west-2'
});

function notify_arrival(req,res,callback){

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
            res.json([err,err.stack]);
        }
        else {
            callback(req,res, data);
        }
    });

}

function handle_messages(req, res, data, callback){

    _.each(data.Messages, function(message){
        var c = JSON.parse(message.Body);
        if( !("a" in c.query)) {
            store(c);
        }
    });

    if( "Messages" in data )
        delete_queue_messages(req,res,data.Messages,callback);
    else
        callback(req,res,["Queue empty"]);
}

function store(content){
    //debugger;
    //TODO store this message... validating incoming messages correspond to a valid 'group'/'account'

}

function delete_queue_messages(req,res,msgs, callback){

    var params = {
        QueueUrl: process.env.SNOWBALL_QUEUE,
        Entries: []
    };

    var ctr=0;
    _.each(msgs, function(msg){
        params.Entries.push({
           Id: (ctr++).toString(),
           ReceiptHandle: msg.ReceiptHandle
        });
    });

    sqs.deleteMessageBatch(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.json([err,err.stack]);
        }
        else {
            console.log(data);
            callback(req,res, data);
        }
    });
}

router.get('/', function(req, res) {
    notify_arrival(req,res,function(req,res,data){
        handle_messages(req, res, data, function(req,res, data){
            res.json(data);  //respond outside of handler for quickness
        });
    });
});

module.exports = router;
