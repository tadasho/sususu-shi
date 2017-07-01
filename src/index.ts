import { assignToIssue } from './assign-to-issue';
import { Config, initConfig } from './config';
import { createReviewPullRequest } from './create-review-pull-request';
import { slackProcess } from './slack-process';

/*
@XXX assign YYY#ZZZ
@XXX review YYY#ZZZ

https://api.slack.com/tutorials/events-api-using-aws-lambda
*/

type Handler = (config: Config, data: any) => Promise<any>;

const event: Handler = (config: Config, data: any): Promise<any> => {
  // FIXME: wrong promise chain.
  return Promise.resolve(null)
    .then((value) => {
      return value === null
        ? slackProcess(config, data.event)
        : value;
    })
    .then((value) => {
      return value === null
        ? assignToIssue(config, data.event)
        : value;
    })
    .then((value) => {
      return value === null
        ? createReviewPullRequest(config, data.event)
        : value;
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
        return () => Promise.resolve();
    }
  };

// Verify Url - https://api.slack.com/events/url_verification
const verify: Handler = (config: Config, data: any): Promise<any> => {
  if (data.token === config.verificationToken) {
    return Promise.resolve(data.challenge);
  } else {
    return Promise.reject('verification failed');
  }
};

// Lambda handler
const handler = (data: any, context: any, callback: any) => {
  const config = initConfig();
  getHandler(data.type)(config, data)
    .then((value) => callback(null, value))
    .catch((error) => callback(error));
};

export { handler };
