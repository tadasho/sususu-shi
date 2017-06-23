const https: any = require('https'),
      qs: any = require('querystring'),
      ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function slackProcess(event: any, callback: any) {
    // test the message for a match and not a bot
    if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
        var text: string = `<@${event.user}> isn't AWS Lambda awesome gorilla?` ;
        var message: any = { 
            token: ACCESS_TOKEN,
            channel: event.channel,
            text: text
        };

        var query: string = qs.stringify(message); // prepare the querystring
        https.get(`https://slack.com/api/chat.postMessage?${query}`);
    }

    callback(null);
}

export { slackProcess };