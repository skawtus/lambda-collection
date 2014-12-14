var lambda = require('./lambda');

function notified(data){
    lambda.delete_queue_messages(data, function(data){
        console.log("DELETE QUEUE MESSAGE: " + JSON.stringify(data, null, '  '));
        if( data.Successful !== undefined && data.Successful.length > 0) {
            lambda.notify_arrival(notified);
        }

    });
}

lambda.notify_arrival( notified );
