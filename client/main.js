tweetList=new Mongo.Collection("tweetList");

Meteor.subscribe('tweetList');
Template.tweetBox.helpers({

  'recentTweets':function(){

    return tweetList.find({},{sort:{added:-1}});
  }

});
