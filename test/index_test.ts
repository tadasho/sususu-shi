import * as assert from 'assert';
import * as mocha from 'mocha';

import { handler } from '../src';

describe('data.type = url_verification', () => {
  let originalToken; // FIXME: let -> const

  beforeEach(() => {
    originalToken = process.env.NODE_SLACK_VERIFICATION;
    process.env.NODE_SLACK_VERIFICATION = 'valid token';
  });

  it('is OK', (done) => {
    const data = {
      challenge: 'challenge1',
      token: 'valid token',
      type: 'url_verification'
    };
    handler(data, null, (error, value) => {
      assert(error === null);
      assert(value === 'challenge1');
      done();
    });
  });

  it('is NG', (done) => {
    const data = {
      challenge: 'challenge1',
      token: 'invalid token',
      type: 'url_verification'
    };
    handler(data, null, (error) => {
      assert(error === 'verification failed');
      done();
    });
  });

  afterEach(() => {
     process.env.NODE_SLACK_VERIFICATION = originalToken;
  });
});

// test function handler
describe('handler', () => {
  it('nullコールバック', () => {
    handler({
      event: {
        bot_id: false,
        text: 'tada assign sususu-shi#1'
      },
      type: 'event_callback'
    }, null, (error) => {
      assert(error === null);
    });
  });
});
