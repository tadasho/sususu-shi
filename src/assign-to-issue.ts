import * as GitHubApi from 'github';
import * as https from 'https';
import * as qs from 'querystring';

const github = new GitHubApi();

const ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;
const GITHUB_USERNAME = process.env.NODE_GITHUB_USERNAME;
const GITHUB_PASS = process.env.NODE_GITHUB_PASS;
const GITHUB_TEAM = process.env.NODE_GITHUB_TEAM;

// Hear @XXX review YYY#ZZZ and assign to issue
const assignToIssue = (event: any): Promise<any> => {
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
    const assignee: any = {
      assignees: found[1],
      number: found[4],
      owner: GITHUB_TEAM,
      repo: found[3]
    };
    const text: string = 'Assigned ' + found[1] + ' to ' + GITHUB_TEAM + '/' + found[3] + ' issue#' + found[4];
    const message: any = {
      channel: event.channel,
      text,
      token: ACCESS_TOKEN
    };

    const query: string = qs.stringify(message); // prepare the querystring
    https.get(`https://slack.com/api/chat.postMessage?${query}`);

    github.authenticate({
      password: GITHUB_PASS,
      type: 'basic',
      username: GITHUB_USERNAME // のちにslackとgithubの紐付けが必要
    });
    github.issues.addAssigneesToIssue(assignee);
  }
  return Promise.resolve(null);
};

export { assignToIssue };
