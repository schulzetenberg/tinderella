const config = require('config');

const messages = config.get('messages');

module.exports = function() {
  return messages[Math.floor(Math.random() * messages.length)];
};
