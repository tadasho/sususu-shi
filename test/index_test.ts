import * as assert from 'assert';
import * as mocha from 'mocha';

import { handler, slackProcess, assignToIssue, createReviewPullRequest } from '../src';

// test function handler
describe('handler', () => {
  it('nullコールバック', () => {
    handler({
      type: 'event_callback',
      event: {
        text: 'tada assign sususu-shi#1',
        bot_id: false
      }
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
      text: 'aws lambda',
      bot_id: false
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
      text: '@tada assign sususu-shi#1',
      bot_id: false
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
      text: '@tada review sususu-shi#1',
      bot_id: false
    }, (error) => {
      assert(error === null);
    });
  });
});
