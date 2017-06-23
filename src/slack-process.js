"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require('https'), qs = require('querystring'), ACCESS_TOKEN = process.env.NODE_SLACK_ACCESS;
// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function slackProcess(event, callback) {
    // test the message for a match and not a bot
    if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
        var text = "<@" + event.user + "> isn't AWS Lambda awesome gorilla?";
        var message = {
            token: ACCESS_TOKEN,
            channel: event.channel,
            text: text
        };
        var query = qs.stringify(message); // prepare the querystring
        https.get("https://slack.com/api/chat.postMessage?" + query);
    }
    callback(null);
}
exports.slackProcess = slackProcess;
