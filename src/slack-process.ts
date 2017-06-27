import * as https from 'https';
import * as qs from 'querystring';

const ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function slackProcess(event: any, callback: any) {
    // test the message for a match and not a bot
    if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
        const text: string = `<@${event.user}> isn't AWS Lambda awesome?` ;
        const message: any = {
            token: ACCESS_TOKEN,
            channel: event.channel,
            text: text
        };

        const query: string = qs.stringify(message); // prepare the querystring
        https.get(`https://slack.com/api/chat.postMessage?${query}`);
    }

    callback(null);
}

export { slackProcess };
