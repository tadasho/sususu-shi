import * as GitHubApi from 'github';
import * as https from 'https';
import fetch from 'node-fetch';
import * as qs from 'querystring';

import { Config } from './config';

const fetchSlackUserList = (token: string): Promise<Map<string, string>> => {
  interface SlackUser {
    id: string;
    name: string;
  }
  interface SlackUserList {
    members: SlackUser[];
    ok: boolean;
  }
  const body = JSON.stringify({ token });
  const headers = { 'Content-Type': 'application/json' };
  const method = 'POST';
  const url = 'https://slack.com/api/users.list';
  return fetch(url, { body, headers, method })
    .then((response) => response.json())
    .then(({ members, ok }: SlackUserList) =>
      ok ? Promise.resolve(members) : Promise.reject(new Error('ok is false')))
    .then((members: SlackUser[]) =>
      members.reduce(
        (map: Map<string, string>, { id, name }) => map.set(id, name),
        new Map<string, string>()));
};

// Hear @XXX review YYY#ZZZ and assign to issue
const assignToIssue = (
  {
    accessToken,
    githubPass,
    githubTeam,
    githubUsername,
    githubUsernames
  }: Config,
  event: any): Promise<any> => {
  const github = new GitHubApi();
  const re: any = /^\s*[@]?([^:,\s]+)[:,]?\s*assign\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i;
  if (!event.bot_id && re.test(event.text)) {
    const str: string = event.text;
    const found: string[] = str.match(re);
    /*
    @userName assign yourRepositoryName#1234
    found[1] -> userName
    found[3] -> yourRepositoryName
    found[4] -> 1234
    */
    const text: string = 'Assigned ' + found[1] + ' to ' + githubTeam + '/' + found[3] + ' issue#' + found[4];
    const message: any = {
      channel: event.channel,
      text,
      token: accessToken
    };

    return fetchSlackUserList(accessToken)
      .then((slackUserList) => {
        const slackUsername = slackUserList.get(found[1]);
        const githubUsernameToAssign = githubUsernames.get(slackUsername);
        github.authenticate({
          password: githubPass,
          type: 'basic',
          username: githubUsername
        });
        const assignee: any = {
          assignees: githubUsernameToAssign,
          number: found[4],
          owner: githubTeam,
          repo: found[3]
        };
        return github.issues.addAssigneesToIssue(assignee);
      }).then(() => {
        const query: string = qs.stringify(message); // prepare the querystring
        return fetch(`https://slack.com/api/chat.postMessage?${query}`);
      }).then((response) => {
        // console.log(response);
        return response.json();
      }).then((obj) => {
        // console.log(obj);
        return null;
      });
  } else {
    return Promise.resolve(null);
  }
};

export { assignToIssue };
