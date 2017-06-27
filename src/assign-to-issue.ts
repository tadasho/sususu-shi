import * as https from 'https';
import * as GitHubApi from 'github';
import * as qs from 'querystring';

var github = new GitHubApi();

const ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;
const GITHUB_USERNAME = process.env.NODE_GITHUB_USERNAME;
const GITHUB_PASS = process.env.NODE_GITHUB_PASS;
const GITHUB_TEAM = process.env.NODE_GITHUB_TEAM;

// Hear @XXX review YYY#ZZZ and assign to issue
function assignToIssue(event: any, callback: any) {
    var re: any = /^\s*[@]?([^:,\s]+)[:,]?\s*assign\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i;
    if (!event.bot_id && re.test(event.text)) {
        var str: string = event.text;
        var found: string[] = str.match(re);
        /*
        @userName assign yourRepositoryName#1234
        found[1] -> userName
        found[3] -> yourRepositoryName
        found[4] -> 1234
        */
        var assignee: any = {
            owner: GITHUB_TEAM,
            repo: found[3],
            number: found[4],
            assignees: found[1],
        }
        var text: string = "Assigned " + found[1] + " to " + GITHUB_TEAM + "/" + found[3] + " issue#" + found[4];
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
        github.issues.addAssigneesToIssue(assignee);
    }
    callback(null);
}

export { assignToIssue };