import * as GitHubApi from 'github';
import * as https from 'https';
import * as qs from 'querystring';

var github = new GitHubApi();

const ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;
const GITHUB_USERNAME = process.env.NODE_GITHUB_USERNAME;
const GITHUB_PASS = process.env.NODE_GITHUB_PASS;
const GITHUB_TEAM = process.env.NODE_GITHUB_TEAM;

// Hear @XXX review YYY#ZZZ and create review request
function createReviewPullRequest(event: any, callback: any) {
    var re: any = /^\s*[@]?([^:,\s]+)[:,]?\s*review\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i;
    if (!event.bot_id && re.test(event.text)) {
        var str: string = event.text;
        var found: string[] = str.match(re);
        /*
        @userName review yourRepositoryName#1234
        found[1] -> userName
        found[3] -> yourRepositoryName
        found[4] -> 1234
        */
        var reviewer: any = {
            owner: GITHUB_TEAM,
            repo: found[3],
            number: found[4],
            assignees: found[1], //現段階ではslack側でgithubの@アカウント名とする必要がある。のちに設定が必要
            reviewers: found[1]
        }
        var text: string = "Created ReviewRequest " + GITHUB_TEAM + "/" + found[3] + " PullRequest#" + found[4] + " to " + found[1];
        var message: any = {
            token: ACCESS_TOKEN,
            channel: event.channel,
            text: text
        };

        var query: string = qs.stringify(message); // prepare the querystring
        https.get(`https://slack.com/api/chat.postMessage?${query}`);

        github.authenticate({
            type: "basic",
            username: GITHUB_USERNAME, //のちにslackとgithubの紐付けが必要
            password: GITHUB_PASS
        });
        github.pullRequests.createReviewRequest(reviewer);
    }
    callback(null);
}

export { createReviewPullRequest };