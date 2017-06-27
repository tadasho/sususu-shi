import * as assert from 'assert';
import * as mocha from 'mocha';

import { slackProcess } from '../src/slack-process';

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
