import * as GitHubApi from 'github';
import * as https from 'https';
import fetch from 'node-fetch';
import * as qs from 'querystring';

import { Config } from './config';

const github = new GitHubApi();

// Hear @XXX review YYY#ZZZ and assign to issue
const assignToIssue = (
  {
    accessToken,
    githubPass,
    githubTeam,
    githubUsername
  }: Config,
  event: any): Promise<any> => {
  const re: any = /^\s*[@]?([^:,\s]+)[:,]?\s*assign\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i;
  if (event.bot_id || !re.test(event.text)) 
    return Promise.resolve(null);

  const str: string = event.text;
  const found: string[] = str.match(re);
  /*
  @userName assign yourRepositoryName#1234
  found[1] -> userName
  found[3] -> yourRepositoryName
  found[4] -> 1234
  */
  const assignee: any = {
    assignees: found[1],
    number: found[4],
    owner: githubTeam,
    repo: found[3]
  };
  const text: string = 'Assigned ' + found[1] + ' to ' + githubTeam + '/' + found[3] + ' issue#' + found[4];
  const message: any = {
    channel: event.channel,
    text,
    token: accessToken
  };

  github.authenticate({
    password: githubPass,
    type: 'basic',
    username: githubUsername // のちにslackとgithubの紐付けが必要
  });
  return github.issues.addAssigneesToIssue(assignee).then(() => {
    const query: string = qs.stringify(message); // prepare the querystring
    return fetch(`https://slack.com/api/chat.postMessage?${query}`);
  }).then((response) => {
    // console.log(response);
    return response.json();
  }).then((obj) => {
    console.log(obj);
    return null;
  });
};

export { assignToIssue };
