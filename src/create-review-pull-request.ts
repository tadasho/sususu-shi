import * as GitHubApi from 'github';
import * as https from 'https';
import * as qs from 'querystring';

import { Config } from './config';

const github = new GitHubApi();

// Hear @XXX review YYY#ZZZ and create review request
const createReviewPullRequest = (
  {
    accessToken,
    githubPass,
    githubTeam,
    githubUsername
  }: Config,
  event: any): Promise<any> => {
  const re: any = /^\s*[@]?([^:,\s]+)[:,]?\s*review\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i;
  if (!event.bot_id && re.test(event.text)) {
    const str: string = event.text;
    const found: string[] = str.match(re);
    /*
    @userName review yourRepositoryName#1234
    found[1] -> userName
    found[3] -> yourRepositoryName
    found[4] -> 1234
    */
    const reviewer: any = {
      assignees: found[1], // 現段階ではslack側でgithubの@アカウント名とする必要がある。のちに設定が必要
      number: found[4],
      owner: githubTeam,
      repo: found[3],
      reviewers: [found[1]]
    };
    const text: string = 'Created ReviewRequest ' +
      githubTeam + '/' + found[3] +
      ' PullRequest#' + found[4] + ' to ' + found[1];
    const message: any = {
      channel: event.channel,
      text,
      token: accessToken
    };

    const query: string = qs.stringify(message); // prepare the querystring
    https.get(`https://slack.com/api/chat.postMessage?${query}` as any); // FIXME

    github.authenticate({
      password: githubPass,
      type: 'basic',
      username: githubUsername // のちにslackとgithubの紐付けが必要
    });
    github.pullRequests.createReviewRequest(reviewer);
  }
  return Promise.resolve(null);
};

export { createReviewPullRequest };
