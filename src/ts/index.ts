/*

aws-response

https://api.slack.com/tutorials/events-api-using-aws-lambda

awsやlambdaという文字列を発見すると返信する

*/

// For Node/CommonJS
declare function require(path: string): any;
// For RequireJS/AMD
declare function define(...args: any[]): any;   

const https: any = require('https'),
      qs: any = require('querystring'),
      VERIFICATION_TOKEN = process.env.NODE_SLACK_VERIFICATION,
      ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;

// Verify Url - https://api.slack.com/events/url_verification
function verify(data: any, callback: any) {
    if (data.token === VERIFICATION_TOKEN) callback(null, data.challenge);
    else callback("verification failed");   
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function slackProcess(event: any, callback: any) {
    // test the message for a match and not a bot
    if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
        var text: string = `<@${event.user}> isn't AWS Lambda awesome caffe?`;
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

// Lambda handler
function handler(data:any, context: any, callback: any) {
    switch (data.type) {
        case "url_verification": verify(data, callback); break;
        case "event_callback": slackProcess(data.event, callback); break;
        default: callback(null);
    }
};
export { handler };
