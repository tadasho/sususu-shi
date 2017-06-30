import * as assert from 'assert';
import * as mocha from 'mocha';

import { assignToIssue } from '../src/assign-to-issue';
import { Config } from '../src/config';

describe('assignToIssue', () => {
  it.skip('should return Promise', () => { // FIXME
    return assignToIssue(
      {
        githubPass: 'PASS',
        githubTeam: 'TEAM',
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
