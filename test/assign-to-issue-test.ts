import * as assert from 'assert';
import * as mocha from 'mocha';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import { assignToIssue as assignToIssueT } from '../src/assign-to-issue';
import { Config } from '../src/config';

describe('assignToIssue', () => {
  let assignToIssue: typeof assignToIssueT;
  let authenticate: sinon.SinonStub;
  let addAssigneesToIssue: sinon.SinonStub;
  let fetch: sinon.SinonStub;
  let postMessageJson: sinon.SinonStub;
  let userListJson: sinon.SinonStub;

  beforeEach(() => {
    authenticate = sinon.stub();
    addAssigneesToIssue = sinon.stub().returns(Promise.resolve());
    postMessageJson = sinon.stub().returns(Promise.resolve());
    userListJson = sinon.stub().returns(Promise.resolve({
      members: [{ id: 'tadaSlackId', name: 'tadaSlack' }], ok: true
    }));
    fetch = sinon.stub();
    fetch.onCall(0).returns(Promise.resolve({ json: userListJson }));
    fetch.onCall(1).returns(Promise.resolve({ json: postMessageJson }));
    assignToIssue = proxyquire('../src/assign-to-issue', {
      'github': function GitHubApi() {
        this.authenticate = authenticate;
        this.issues = { addAssigneesToIssue };
      },
      'node-fetch': { default: fetch }
    }).assignToIssue;
  });

  it('should return Promise', () => {
    return assignToIssue(
      {
        githubPass: 'PASS',
        githubTeam: 'TEAM',
        githubUsername: 'USER',
        githubUsernames: new Map([['tadaSlack', 'tadaGitHub']])
      } as Config, // FIXME
      {
        bot_id: false,
        text: '@tadaSlackId assign sususu-shi#1'
      }).then((value) => {
        assert(value === null);
        assert(authenticate.callCount === 1);
        assert(authenticate.getCall(0).args[0].type === 'basic');
        assert(addAssigneesToIssue.callCount === 1);
        assert(addAssigneesToIssue.getCall(0).args[0]
          .assignees === 'tadaGitHub');
        assert(postMessageJson.callCount === 1);
        assert(fetch.callCount === 2);
        assert((fetch.getCall(0).args[0] as string).endsWith('users.list'));
        assert((fetch.getCall(1).args[0] as string).startsWith('https:'));
      });
  });
});
