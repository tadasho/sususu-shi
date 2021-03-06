import * as assert from 'assert';
import * as mocha from 'mocha';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import {
  fetchUserList as fetchUserListT,
  postMessage as postMessageT
} from '../src/slack';

describe('slack.fetchUserList', () => {
  let fetchUserList: typeof fetchUserListT;
  let fetch: sinon.SinonStub;
  let userListJson: sinon.SinonStub;

  beforeEach(() => {
    userListJson = sinon.stub().returns(Promise.resolve({
      members: [{ id: 'tadaSlackId', name: 'tadaSlack' }], ok: true
    }));
    fetch = sinon.stub();
    fetch.onCall(0).returns(Promise.resolve({ json: userListJson }));
    fetchUserList = proxyquire('../src/slack', {
      'node-fetch': { default: fetch }
    }).fetchUserList;
  });

  it('works', () => {
    return fetchUserList('token1')
      .then((userList) => {
        assert(userList.size === 1);
        assert(userList.get('tadaSlackId') === 'tadaSlack');
        assert(fetch.callCount === 1);
        const call = fetch.getCall(0);
        assert(call.args[0] === 'https://slack.com/api/users.list');
        assert(call.args[1].body === JSON.stringify({ token: 'token1' }));
        assert(call.args[1].method === 'POST');
        assert(call.args[1].headers['Content-Type'] === 'application/json');
      });
  });
});

describe('slack.postMessage', () => {
  let postMessage: typeof postMessageT;
  let fetch: sinon.SinonStub;

  beforeEach(() => {
    fetch = sinon.stub().returns(
      Promise.resolve({ json: () => Promise.resolve({ ok: true }) }));
    postMessage = proxyquire('../src/slack', {
      'node-fetch': { default: fetch }
    }).postMessage;
  });

  it('works', () => {
    return postMessage('token1', 'channel1', 'message1')
      .then(() => {
        assert(fetch.callCount === 1);
        const call = fetch.getCall(0);
        assert(call.args[0] === 'https://slack.com/api/chat.postMessage');
        assert(call.args[1].body === JSON.stringify({
          channel: 'channel1',
          text: 'message1',
          token: 'token1'
        }));
        assert(call.args[1].method === 'POST');
        assert(call.args[1].headers['Content-Type'] === 'application/json');
      });
  });
});
