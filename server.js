var FB_USER_ACCESS_TOKEN = "CAADc1yuzX8gBALgzjvb0ZBJd0aYGz0WuItmwSVjQnUsDJ2vzZC7y62ssSNW2je3m0vgTuGuIJf6ozSuL3VKoygZAzfJ6NZC1VXBqo4gbpfdFTAnkqeyP4yO2j2BcP44KTzkaCLrvIFwMhFlmmqeR3KYkMtzPPbBb0tLGlY3zZC7j3LtoZA0ZAm7";
var CORE_ID = "55ff6a065075555318301787";
var CORE_ACCESS_TOKEN = "e2b4805974884c9733bfaab61eb86b4d714384dc";

var request = require('request');
var facebook = require('./facebook.js');

var lastInputValue = -1;


function getCounters(callback) {
    facebook.sendMultipleFbRequest(FB_USER_ACCESS_TOKEN,function(counter){
        if(counter){
            var total = counter.notification + counter.friendrequest + counter.inbox;
            if (total != lastInputValue)
                updateNotificationLed(total);
            lastInputValue = total;
        }
    });
}


function updateNotificationLed (count) {
    console.log("Count : "+count);
    request.post("https://api.spark.io/v1/devices/"+CORE_ID+"/changeNumber", function(err, httpResponse, body){if(err) console.log(body); }).form({access_token: CORE_ACCESS_TOKEN,params:count});

}

setInterval(function(){getCounters(function(){})},12000);


/*
function getLongerToken (token) {
    facebook.sendFbRequest('/oauth/access_token?'
        +'grant_type=fb_exchange_token'
        +'&client_id='+'242816709255112'
        +'&client_secret='+'67f4f4b54b19c91db5dbf8925725313c'
        +'&fb_exchange_token='+token, function(data){console.log(data);});
}*/
