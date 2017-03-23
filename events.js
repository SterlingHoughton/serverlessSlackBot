
const getSlackEvent = event => ({ slack: JSON.parse(event.body) });

const respond = callback => (event) => {
  const response = { statusCode: 200 };
  if (event.slack.type === 'url_verification') {
    response.body = event.slack.challenge;
  }
  callback(null, response);
  return event;
};

const verifyToken = (event) => {
  if (event.slack.token !== process.env.VERIFICATION_TOKEN) {
    throw new Error('InvalidToken');
  }
  return event;
};

module.exports.handler = (event, context, callback) => 
  Promise.resolve(event) // Start promise chain
    .then(getSlackEvent) // Get Slack event payload
    .then(respond(callback)) // Respond OK to Slack
    .then(verifyToken) // Verify the token
    // .then(getTeam) // Get team data from DDB
    // .then(checkForMention) // Check message contains a mention of our bot
    // .then(invokeAction) // Invoke action function
    .catch(callback);
