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
        MaxNumberOfMessages: 0,
        //MessageAttributeNames: [
        //    'STRING_VALUE',
        //    /* more items */
        //],
        VisibilityTimeout: 0,
        WaitTimeSeconds: 0
    };
    sqs.receiveMessage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });

//
//    var params = {
//      Message: JSON.stringify({
//          default: JSON.stringify({
//              remote_address: req._remoteAddress,
//              startTime: req._startTime,
//              query: req.query,
//              params: req.params,
//              cookies: req.cookies,
//              originalUrl: req.originalUrl
//          })
//
//      }),
//      MessageStructure: 'json',
//      TopicArn: process.env.SNOWBALL_TOPIC
//    };
//    sns.publish(params, function(err, data) {
//        if (err) {
//            console.log(err, err.stack);
//            res.json([err,err.stack]);
//        }
//        else {
//            console.log(data);
//            callback(req,res);
//        }
//    });

}

router.get('/pull', function(req, res) {
    debugger;
  //  notify_arrival(req,res,function(req,res){
  //      if(DEBUG) res.json(["Ok"]);  //respond outside of handler for quickness
  //  });
  //  if(!DEBUG) res.json(["Ok"]);
});

module.exports = router;