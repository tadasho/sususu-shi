import * as assert from 'assert';
import * as mocha from 'mocha';

import { handler, slackProcess, assignToIssue, createReviewPullRequest } from '../src';

// test function handler
describe('handler', function () {
    it('nullコールバック', function () {
        handler({
            type: 'event_callback',
            event: {
                text: 'tada assign sususu-shi#1',
                bot_id: false
            }
        }, null, function (error) {
            assert(error === null);
        });
    });
});

// test function slackProcess
describe('slackProcess', function() {
    it('slackProcess', function() {
        assert(slackProcess);
    });
    it('関数である', function() {
        assert(typeof slackProcess === 'function');
    });
    it('nullコールバック', function () {
        slackProcess({
            text: 'aws lambda',
            bot_id: false
        }, function (error) {
            assert(error === null);
        });
    });
});

// test function assignToIssue
describe('assignToIssue', function () {
    it('assignToIssue', function () {
        assert(assignToIssue);
    });
    it('関数である', function () {
        assert(typeof assignToIssue === 'function');
    });
    it('nullコールバック', function () {
        assignToIssue({
            text: '@tada assign sususu-shi#1',
            bot_id: false
        }, function (error) {
            assert(error === null);
        });
    });
});

// test function createReviewRequest
describe('createReviewPullRequest', function () {
    it('createReviewPullRequest', function () {
        assert(createReviewPullRequest);
    });
    it('関数である', function () {
        assert(typeof createReviewPullRequest === 'function');
    });
    it('nullコールバック', function() {
        createReviewPullRequest({
            text: '@tada review sususu-shi#1',
            bot_id: false
        }, function(error) {
            assert(error === null);
        });
    });
});
