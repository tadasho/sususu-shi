import * as fs from 'fs';
import * as GitHubApi from 'github';
import * as https from 'https';
import * as qs from 'querystring';

import { slackProcess } from './slack-process';
import { assignToIssue } from './assign-to-issue';
import { createReviewPullRequest } from './create-review-pull-request';

/*
@XXX assign YYY#ZZZ
@XXX review YYY#ZZZ

https://api.slack.com/tutorials/events-api-using-aws-lambda
*/

const VERIFICATION_TOKEN = process.env.NODE_SLACK_VERIFICATION;
const ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;
const GITHUB_USERNAME = process.env.NODE_GITHUB_USERNAME;
const GITHUB_PASS = process.env.NODE_GITHUB_PASS;
const GITHUB_TEAM = process.env.NODE_GITHUB_TEAM;

const github = new GitHubApi();

const users: any = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

// Verify Url - https://api.slack.com/events/url_verification
function verify(data: any, callback: any) {
    if (data.token === VERIFICATION_TOKEN) callback(null, data.challenge);
    else callback("verification failed");
}

// Lambda handler
function handler(data:any, context: any, callback: any) {
    switch (data.type) {
        case "url_verification": verify(data, callback); break;
        case "event_callback":
            slackProcess(data.event, callback);
            assignToIssue(data.event, callback);
            createReviewPullRequest(data.event, callback);
            break;
        default: callback(null);
    }
}

export { handler, slackProcess, assignToIssue, createReviewPullRequest };
