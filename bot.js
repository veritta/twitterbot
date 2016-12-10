const twit = require('twit');
const config = require('./config.js');

const Twitter = new twit(config);

const params = {
  q: '"what the duck"',
  result_type: 'recent',
  lang: 'en',
};

function onSearch(err, data) {
  if (err) {
    console.log('AAAAAAAH');
  } else {
    const filteredStatuses = data.statuses.filter(s => !s.retweeted_status);
    reply(filteredStatuses[0]);
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

  Twitter.post('statuses/update', params);
}

Twitter.get('search/tweets', params, onSearch);
