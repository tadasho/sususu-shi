import * as assert from 'assert';
import * as mocha from 'mocha';

import { Data, handler } from '../src';

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
    } as Data;
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
    } as Data;
    handler(data, null, (error) => {
      assert(error === 'verification failed');
      done();
    });
  });

  afterEach(() => {
     process.env.NODE_SLACK_VERIFICATION = originalToken;
  });
});

describe.skip('data.type = event_callback', () => {
  // TODO
});
