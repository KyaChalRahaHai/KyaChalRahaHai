import Twit from 'twit';

tweetList=new Mongo.Collection("tweetList");



//Twitter
var T = new Twit({
    consumer_key:         'tboB7IrmPyBV7LWYkd8cdwjQJ',
    consumer_secret:      'j8VpwBL3HrIbM80mIuVotiEIUfhopLeuFtguVZ354BPB36vpUY',
    access_token:         '744766224656121857-dVoSmaBEHD5WYUg7LXR6ko9Z8ZWQMhC',
    access_token_secret:  'Ly1AKJG9u8j9P89AYeLzPB2iYfxpOiwmwzdnSKLqMpzgx',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});




//
// filter the public stream by english tweets containing `#`
//
var stream = T.stream('statuses/filter', { track: ['#fogg',"#kya",'#chal','#raha','#hai','#Kya chal raha hai','#kyachalrahahai','#perfume','#deodrant','#spray'] ,language:"en"})

stream.on('tweet',Meteor.bindEnvironment( function (tweet) {



    //console.log(tweet);
    var stringData=JSON.stringify(tweet);
    var jsonData=JSON.parse(stringData);
    var timeMilliSeconds=Math.floor(Date.now());

    //adding tweet to database
    tweetList.insert({tweet:jsonData,added:timeMilliSeconds});

    //liking the tweet
     T.post('favorites/create', {id:jsonData.id_str }, function(err, data, response) {
     console.log("tweet liked successfully");
     });




    //deleting tweets for data load balance

    var data= tweetList.find({}, {sort: {added : 1} }).fetch();

    var datacount=data.length;
    console.log(datacount);

    if(datacount>10){

        for(var i=0;i<(datacount-10);i++){

            tweetList.remove(data[i]._id);
        }
    }


}));

Meteor.publish('tweetList',function(){

    return tweetList.find({}, {sort: {added : -1},limit:5 });
});





