import * as assert from 'assert';
import * as mocha from 'mocha';

import { assignToIssue } from '../src/assign-to-issue';

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
