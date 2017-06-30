import * as fs from 'fs';
import * as GitHubApi from 'github';
import * as https from 'https';
import * as qs from 'querystring';

import { assignToIssue } from './assign-to-issue';
import { createReviewPullRequest } from './create-review-pull-request';
import { slackProcess } from './slack-process';

/*
@XXX assign YYY#ZZZ
@XXX review YYY#ZZZ

https://api.slack.com/tutorials/events-api-using-aws-lambda
*/

const ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;
const GITHUB_USERNAME = process.env.NODE_GITHUB_USERNAME;
const GITHUB_PASS = process.env.NODE_GITHUB_PASS;
const GITHUB_TEAM = process.env.NODE_GITHUB_TEAM;

const github = new GitHubApi();

const users: any = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

// Verify Url - https://api.slack.com/events/url_verification
const verify = (data: any): Promise<any> => {
  if (data.token === process.env.NODE_SLACK_VERIFICATION) {
    return Promise.resolve(data.challenge);
  } else {
    return Promise.reject('verification failed');
  }
};

// Lambda handler
const handler = (data: any, context: any, callback: any) => {
  switch (data.type) {
    case 'url_verification':
      verify(data)
        .then((value) => callback(null, value))
        .catch((error) => callback(error));
      break;
    case 'event_callback':
      // FIXME: wrong promise chain.
      Promise.resolve(null)
        .then((value) => {
          return value === null
            ? slackProcess(data.event)
            : value;
        })
        .then((value) => {
          return value === null
            ? assignToIssue(data.event)
            : value;
        })
        .then((value) => {
          return value === null
            ? createReviewPullRequest(data.event)
            : value;
        })
        .then((value) => callback(null, value))
        .catch((error) => callback(error));
      break;
    default: callback(null);
  }
};

export { handler, slackProcess, assignToIssue, createReviewPullRequest };
