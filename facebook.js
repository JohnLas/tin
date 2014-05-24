
var https = require('https');
var restler = require('restler');

exports.getFbData = function(accessToken, apiPath, callback) {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: apiPath + '?access_token=' + accessToken, //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });

        result.on('end', function(){
            callback(buffer);
        });
    });

    request.on('error', function(e){
        console.log('error from facebook.getFbData: ' + e.message)
    });

    request.end();
}


exports.sendFbRequest = function(request, callback) {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: request, //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });

        result.on('end', function(){
           callback(buffer);
        });
    });

    request.on('error', function(e){
        console.log('error from facebook.getFbData: ' + e.message)
    });

    request.end();
}


exports.sendMultipleFbRequest = function(access_token, callback) {
    var TOKEN = access_token;
    var batchreq = {};
    batchreq.batch = [];
    batchreq.batch.push({"method":"GET", "relative_url":"/me/notifications?limit=5"});
    batchreq.batch.push({"method": "GET", "relative_url":"/me/inbox?limit=5"});
    batchreq.batch.push({"method": "GET", "relative_url":"/me/friendrequests?limit=5"});
    restler.post('https://graph.facebook.com?access_token='+TOKEN
        +"&batch="+JSON.stringify(batchreq.batch))
                  .on('complete', function(data) {
                    var counter = {};
                    counter.notification = 0;
                    counter.inbox = 0;
                    counter.friendrequest = 0;
                    //Notifications
                    try {
                        if(JSON.parse(data[0].body).summary.unseen_count)
                            counter.notification = JSON.parse(data[0].body).summary.unseen_count;
                    } catch (e) {console.log(data[0])}
                    //Inbox
                    try {
                        if(JSON.parse(data[1].body).summary.unseen_count)
                            counter.inbox = JSON.parse(data[1].body).summary.unseen_count;
                    } catch (e) {console.log(data[1])}                    
                    //Friend
                    try {                    
                        if(JSON.parse(data[2].body).summary.unread_count)
                            counter.friendrequest = JSON.parse(data[2].body).summary.unread_count;
                    } catch (e) {console.log(data[2])}                    

        console.log(counter);
        callback(counter);
    });
}

