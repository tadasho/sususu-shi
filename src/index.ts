import { assignToIssue } from './assign-to-issue';
import { Config, initConfig } from './config';
import { createReviewPullRequest } from './create-review-pull-request';
import { slackProcess } from './slack-process';

/*
@XXX assign YYY#ZZZ
@XXX review YYY#ZZZ

https://api.slack.com/tutorials/events-api-using-aws-lambda
*/
type Callback = (error: any, result?: string) => void;
type Context = any;
type Data = EventCallbackData | UrlVerificationData;
interface EventCallbackData {
  event: {};
  type: 'event_callback';
}
interface UrlVerificationData {
  challenge: string;
  token: string;
  type: 'url_verification';
}
type Handler = (config: Config, data: Data) => Promise<string>;

const event: Handler = (
  config: Config,
  data: EventCallbackData
): Promise<string> => {
  return Promise.all([
    slackProcess(config, data.event),
    createReviewPullRequest(config, data.event),
    assignToIssue(config, data.event)
  ]).then((_) => {
    return '';
  });
};

const getHandler =
  (dataType: 'event_callback' | 'url_verification'): Handler => {
    switch (dataType) {
      case 'url_verification':
        return verify;
      case 'event_callback':
        return event;
      default:
        return () => Promise.resolve('');
    }
  };

// Verify Url - https://api.slack.com/events/url_verification
const verify: Handler = (
  { verificationToken }: Config,
  data: UrlVerificationData
): Promise<string> => {
  if (data.token === verificationToken) {
    return Promise.resolve(data.challenge);
  } else {
    return Promise.reject('verification failed');
  }
};

// Lambda handler
const handler = (data: Data, context: Context, callback: Callback): void => {
  const config = initConfig();
  getHandler(data.type)(config, data)
    .then((value) => callback(null, value))
    .catch((error) => callback(error));
};

export { Data, handler };
