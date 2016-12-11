const twit = require('twit');
const moment = require('moment');
const config = require('./config.js');

const Twitter = new twit(config);

const screenNames = [];

function log(s) {
  const time = moment().format();
  console.log(time, s);
}

function onSearch(err, data) {
  if (err) {
    log(err);
  } else {
    const filteredStatuses = data.statuses
      .filter(s => !s.retweeted_status)
      .filter(s => !screenNames.includes(s.user.screen_name));
    if (filteredStatuses.length > 0) {
      reply(filteredStatuses[0]);
    } else {
      log('No-one to tweet');
    }
  }
}

function reply(status) {
  const id = status.id_str;
  const screenName = status.user.screen_name;
  const text = `@${screenName} Quack.`;
  const params = {
    status: text,
    in_reply_to_status_id: id,
  };
  screenNames.push(screenName);
  log(`Tweeting @${screenName}`);
  Twitter.post('statuses/update', params);
}

function searchAndReply() {
  const params = {
    q: '"what the duck"',
    result_type: 'recent',
    lang: 'en',
  };

  Twitter.get('search/tweets', params, onSearch);
}

searchAndReply();
setInterval(searchAndReply, 60000);
