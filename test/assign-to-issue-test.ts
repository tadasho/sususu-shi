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
  let fetchUserList: sinon.SinonStub;
  let postMessage: sinon.SinonStub;

  beforeEach(() => {
    authenticate = sinon.stub();
    addAssigneesToIssue = sinon.stub().returns(Promise.resolve());
    fetchUserList = sinon.stub()
      .returns(Promise.resolve(new Map([['tadaSlackId', 'tadaSlack']])));
    postMessage = sinon.stub().returns(Promise.resolve());
    assignToIssue = proxyquire('../src/assign-to-issue', {
      './slack': { fetchUserList, postMessage },
      'github': function GitHubApi() {
        this.authenticate = authenticate;
        this.issues = { addAssigneesToIssue };
      }
    }).assignToIssue;
  });

  it('should return Promise', () => {
    return assignToIssue(
      {
        accessToken: 'ACCESS_TOKEN',
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
        assert(postMessage.callCount === 1);
        assert(postMessage.getCall(0).args[0] === 'ACCESS_TOKEN');
        assert(fetchUserList.callCount === 1);
        assert(fetchUserList.getCall(0).args[0] === 'ACCESS_TOKEN');
      });
  });
});
