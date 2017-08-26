import * as GitHubApi from 'github';

import { Config } from './config';
import {
  fetchUserList as fetchSlackUserList,
  postMessage
} from './slack';

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
    /*
    @userName assign yourRepositoryName#1234
    found[1] -> userName
    found[3] -> yourRepositoryName
    found[4] -> 1234
    */
    const str: string = event.text;
    const found: string[] = str.match(re);
    const userNameToAssign = found[1];
    const repoName = found[3];
    const issueNumber = found[4];

    return fetchSlackUserList(accessToken)
      .then((slackUserList) => {
        const slackUsername = slackUserList.get(userNameToAssign);
        const githubUsernameToAssign = githubUsernames.get(slackUsername);
        github.authenticate({
          password: githubPass,
          type: 'basic',
          username: githubUsername
        });
        const assignee: any = {
          assignees: githubUsernameToAssign,
          number: issueNumber,
          owner: githubTeam,
          repo: repoName
        };
        return github.issues.addAssigneesToIssue(assignee);
      }).then(() => {
        const text: string =
          'Assigned ' + userNameToAssign + ' to ' + githubTeam + '/' + repoName + ' issue#' + issueNumber;
        return postMessage(accessToken, event.channel, text);
      }).then(() => {
        return null;
      });
  } else {
    return Promise.resolve(null);
  }
};

export { assignToIssue };
