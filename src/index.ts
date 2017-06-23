/*
@XXX assign YYY#ZZZ
@XXX review YYY#ZZZ

https://api.slack.com/tutorials/events-api-using-aws-lambda
*/

const https: any = require('https'),
      qs: any = require('querystring'),
      VERIFICATION_TOKEN = process.env.NODE_SLACK_VERIFICATION,
      ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS,
      GITHUB_USERNAME = process.env.NODE_GITHUB_USERNAME,
      GITHUB_PASS = process.env.NODE_GITHUB_PASS,
      GITHUB_TEAM = process.env.NODE_GITHUB_TEAM;

var GitHubApi: any = require("github");
var github = new GitHubApi();

var fs: any = require('fs');
var users: any = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

// Verify Url - https://api.slack.com/events/url_verification
function verify(data: any, callback: any) {
    if (data.token === VERIFICATION_TOKEN) callback(null, data.challenge);
    else callback("verification failed");   
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function slackProcess(event: any, callback: any) {
    // test the message for a match and not a bot
    if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
        var text: string = `<@${event.user}> isn't AWS Lambda awesome?` ;
        var message: any = { 
            token: ACCESS_TOKEN,
            channel: event.channel,
            text: text
        };

        var query: string = qs.stringify(message); // prepare the querystring
        https.get(`https://slack.com/api/chat.postMessage?${query}`);
    }

    callback(null);
}

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
        /*
        if (found[1] === '@tada') {
           var text1: string = 'success'; 
        } else {
            var text1: string = 'failed' + encodeURIComponent(found[1]);
            console.log(found[1]);
        }
        console.log("hello");
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
            reviewers: [found[1]]
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
};
export { handler, slackProcess, assignToIssue, createReviewPullRequest };