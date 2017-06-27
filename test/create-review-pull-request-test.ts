import * as assert from 'assert';
import * as mocha from 'mocha';

import { createReviewPullRequest } from '../src';

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
