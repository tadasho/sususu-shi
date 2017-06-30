import * as assert from 'assert';
import * as mocha from 'mocha';
import * as proxyquire from 'proxyquire';

import { assignToIssue as assignToIssueT } from '../src/assign-to-issue';
import { Config } from '../src/config';

describe('assignToIssue', () => {
  let assignToIssue: typeof assignToIssueT;

  beforeEach(() => {
    assignToIssue = proxyquire('../src/assign-to-issue', {
      'github': class {
        public authenticate(): void {
          return;
        }

        public get issues(): { addAssigneesToIssue: any; } {
          return {
            addAssigneesToIssue() {
              return Promise.resolve();
            }
          };
        }
      },
      'node-fetch': {
        default() {
          return Promise.resolve({
            json() {
              return Promise.resolve();
            }
          });
        }
      }
    }).assignToIssue;
  });

  it('should return Promise', () => {
    return assignToIssue(
      {
        githubPass: 'PASS',
        githubTeam: 'TEAM',
        githubUsername: 'USER'
      } as Config, // FIXME
      {
        bot_id: false,
        text: '@tada assign sususu-shi#1'
      }).then((value) => {
        assert(value === null);
      });
  });
});
