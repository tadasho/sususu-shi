import * as https from 'https';
import * as qs from 'querystring';

import { Config } from './config';

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
const slackProcess = ({ accessToken }: Config, event: any): Promise<any> => {
  // test the message for a match and not a bot
  if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
    const text: string = `<@${event.user}> isn't AWS Lambda awesome?`;
    const message: any = {
      channel: event.channel,
      text,
      token: accessToken
    };

    const query: string = qs.stringify(message); // prepare the querystring
    https.get(`https://slack.com/api/chat.postMessage?${query}` as any); // FIXME
  }
  return Promise.resolve(null);
};

export { slackProcess };
