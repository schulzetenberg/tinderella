const tinder = require('tinder');
const client = new tinder.TinderClient();
const config = require('config');
const Q = require('q');

const logger = require('./nodejs/logger');
const randomNumber = require('./nodejs/random-number');
const randomMessage = require('./nodejs/random-message');

const accessToken = config.get('facebook.accessToken');
const userId = config.get('facebook.userId');

client.authorize(accessToken, userId, run);

function run() {
  likeAll()
  .then(function(){
    // Wait at least 2 minutes before messaging any matches
    const pause = randomNumber(120000, 180000); // Between 2min & 3min
    setTimeout(function(){ return }, pause);
  })
  .then(messageMatches)
  .then(function(){
    const nextRun = randomNumber(3600000, 7200000);
    setTimeout(function(){ run() }, nextRun); // Run again in 1-2 hrs
  })
  .catch(function(err){
    logger.error(err);
  });
}

function likeAll() {
  const defer = Q.defer();
  const numUsers = randomNumber(6, 10); // TODO: Not actually working! It is always 10

  client.getRecommendations(numUsers, function(err, data){
    if(err) {
      logger.error(err);
    } else if(data.message && data.message.indexOf('timeout') > -1) {
      logger.error('Timeout: ' + JSON.stringify(data.message));
    } else if(!data.results) {
      logger.error('No recommendation results');
    } else {
      var promiseChain = Q.fcall(function(){}); // create an empty promise to begin the chain

      // loop through all the promises and return one at a time
      data.results.forEach(function(userData) {
        let nextPromise = function() {
          return like(userData._id);
        };

        promiseChain = promiseChain.then(nextPromise); // add the next promise onto the chain
      });

      promiseChain.then(function(){
        logger.warn('Liked ' + data.results.length + ' user(s)');
        defer.resolve();
      }).catch(function(err){
        logger.error(err);
        defer.resolve();
      });
    }
  });

  return defer.promise;
}

function like(userId) {
  const defer = Q.defer();
  const randomNum = randomNumber(300, 2000); // Between 300ms and 2s

  setTimeout(function(){
    client.like(userId, function(err, data) {
       if(err) {
         logger.error(err);
       } else if (!data){
         logger.error('No data returned from like');
       } else {
         logger.info('User liked. Id:' + userId);
         }
         if(data.match) logger.warn('User matched!');

         if(data.likes_remaining !== 100) logger.info('Likes remaining:' + data.likes_remaining);
         if(data.likes_remaining === 0) {
           defer.reject('No more likes remaining'); // Escape from the promise chain
       }

       defer.resolve();
    });
  }, randomNum);

  return defer.promise;
}

// Send message to any match that has not been messaged yet
function messageMatches() {
  const defer = Q.defer();

  client.getHistory(function(err, data){
    if(err) {
      logger.error(err);
    } else if (!data){
      logger.error('No message data returned');
    } else {
      var newMatches = [];
      var promiseChain = Q.fcall(function(){}); // create an empty promise to begin the chain

      data.matches.forEach(function(userData) {
        if(userData.messages.length === 0) newMatches.push(userData._id);
      });

      newMatches.forEach(function(userId) {
        let nextPromise = function() {
          return message(userId);
        };

        promiseChain = promiseChain.then(nextPromise); // add the next promise onto the chain
      });

      promiseChain.then(function(){
        logger.warn('Messaged ' + newMatches.length + ' user(s)');
        defer.resolve();
      }).catch(function(err){
        defer.reject(err);
      });
    }
   });

   return defer.promise;
}

function message(id) {
  const defer = Q.defer();
  const message = randomMessage();
  const randomNum = randomNumber(2000, 5000); // Between 2s & 5s

  setTimeout(function(){
    client.sendMessage(id, message, function(err) {
      if(err) {
        defer.reject(err);
      } else {
        logger.info('Message sent to user: ' + message);
        defer.resolve();
      }
    });
  }, randomNum);

  return defer.promise;
}
