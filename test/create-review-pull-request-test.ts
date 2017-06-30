import * as assert from 'assert';
import * as mocha from 'mocha';

import { Config } from '../src/config';
import { createReviewPullRequest } from '../src/create-review-pull-request';

describe('createReviewPullRequest', () => {
  it('should return Promise', () => {
    return createReviewPullRequest(
      {
        githubPass: 'PASS',
        githubUsername: 'USER'
      } as Config, // FIXME,
      {
        bot_id: false,
        text: '@tada review sususu-shi#1'
      }).then((value) => {
        assert(value === null);
      });
  });
});
