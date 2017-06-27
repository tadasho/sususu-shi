import * as assert from 'assert';
import * as mocha from 'mocha';

import { createReviewPullRequest } from '../src';

describe('createReviewPullRequest', () => {
  it('should return Promise', () => {
    return createReviewPullRequest({
      bot_id: false,
      text: '@tada review sususu-shi#1'
    }).then((value) => {
      assert(value === null);
    });
  });
});
