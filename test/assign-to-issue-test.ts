import * as assert from 'assert';
import * as mocha from 'mocha';

import { assignToIssue } from '../src/assign-to-issue';

describe('assignToIssue', () => {
  it('should return Promise', () => {
    return assignToIssue({
      bot_id: false,
      text: '@tada assign sususu-shi#1'
    }).then((value) => {
      assert(value === null);
    });
  });
});
