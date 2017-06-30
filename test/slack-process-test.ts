import * as assert from 'assert';
import * as mocha from 'mocha';

import { Config } from '../src/config';
import { slackProcess } from '../src/slack-process';

describe('slackProcess', () => {
  it('should return Promise', () => {
    return slackProcess(
      {} as Config,
      {
        bot_id: false,
        text: 'aws lambda'
      }).then((value) => {
        assert(value === null);
      });
  });
});
