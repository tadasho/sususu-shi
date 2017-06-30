import * as assert from 'assert';
import * as mocha from 'mocha';

import {
  assignToIssue,
  createReviewPullRequest,
  handler,
  slackProcess
} from '../src';

// test function handler
describe('handler', () => {
  it('nullコールバック', () => {
    handler({
      event: {
        bot_id: false,
        text: 'tada assign sususu-shi#1'
      },
      type: 'event_callback'
    }, null, (error) => {
      assert(error === null);
    });
  });
});

// test function slackProcess
describe('slackProcess', () => {
  it('slackProcess', () => {
    assert(slackProcess);
  });
  it('関数である', () => {
    assert(typeof slackProcess === 'function');
  });
  it('nullコールバック', () => {
    slackProcess({
      bot_id: false,
      text: 'aws lambda'
    }, (error) => {
      assert(error === null);
    });
  });
});

// test function assignToIssue
describe('assignToIssue', () => {
  it('assignToIssue', () => {
    assert(assignToIssue);
  });
  it('関数である', () => {
    assert(typeof assignToIssue === 'function');
  });
  it('nullコールバック', () => {
    assignToIssue({
      bot_id: false,
      text: '@tada assign sususu-shi#1'
    }, (error) => {
      assert(error === null);
    });
  });
});

// test function createReviewRequest
describe('createReviewPullRequest', () => {
  it('createReviewPullRequest', () => {
    assert(createReviewPullRequest);
  });
  it('関数である', () => {
    assert(typeof createReviewPullRequest === 'function');
  });
  it('nullコールバック', () => {
    createReviewPullRequest({
      bot_id: false,
      text: '@tada review sususu-shi#1'
    }, (error) => {
      assert(error === null);
    });
  });
});
