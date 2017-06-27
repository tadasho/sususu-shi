import * as https from 'https';
import * as qs from 'querystring';

const ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
const slackProcess = (event: any): Promise<any> => {
  // test the message for a match and not a bot
  if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
    const text: string = `<@${event.user}> isn't AWS Lambda awesome?`;
    const message: any = {
      channel: event.channel,
      text,
      token: ACCESS_TOKEN
    };

    const query: string = qs.stringify(message); // prepare the querystring
    https.get(`https://slack.com/api/chat.postMessage?${query}`);
  }
  return Promise.resolve(null);
};

export { slackProcess };
