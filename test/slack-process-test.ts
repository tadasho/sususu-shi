import * as assert from 'assert';
import * as mocha from 'mocha';

import { slackProcess } from '../src/slack-process';

describe('slackProcess', () => {
  it('should return Promise', () => {
    return slackProcess({
      bot_id: false,
      text: 'aws lambda'
    }).then((value) => {
      assert(value === null);
    });
  });
});
