import * as assert from 'assert';
import * as mocha from 'mocha';

import { assignToIssue } from '../src/assign-to-issue';
import { Config } from '../src/config';

describe('assignToIssue', () => {
  it('should return Promise', () => {
    return assignToIssue(
      {
        githubPass: 'PASS',
        githubUsername: 'USER'
      } as Config, // FIXME
      {
        bot_id: false,
        text: '@tada assign sususu-shi#1'
      }).then((value) => {
        assert(value === null);
      });
  });
});
