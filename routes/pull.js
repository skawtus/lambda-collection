var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var DEBUG = true;

var sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'us-west-2'
});

function handle_messages(req, res, data, callback){

    if( "Messages" in data ) {
        store_queue_messages(req, res, data.Messages, function(){
            delete_queue_messages(req,res,data.Messages,callback);
        });
    }
    else
        callback(req,res,["Queue empty"]);

}

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

function store_message(content){
    //debugger;
    //TODO store this message... validating incoming messages correspond to a valid 'group'/'account'
}

function store_queue_messages(req,res,msgs, callback){
    _.each(msgs, function(message){
        var c = JSON.parse(message.Body);
        if( !("a" in c.query)) {
            store_message(c);
        }
    });
}




router.get('/', function(req, res) {
    notify_arrival(req,res,function(req,res,data){
        store_queue_messages(req, res, data, function(req,res, data){
            res.json(data);
        });
    });
});

module.exports = router;
