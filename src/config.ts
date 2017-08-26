import * as fs from 'fs';

type GitHubUsername = string;
type SlackUsername = string;
type GitHubUsers = Map<SlackUsername, GitHubUsername>;

interface Config {
  accessToken: string;
  githubPass: string;
  githubTeam: string;
  githubUsername: string;
  githubUsernames: GitHubUsers;
  verificationToken: string;
}

const loadGitHubUsernames = (): Map<SlackUsername, GitHubUsername> => {
  const jsonString = fs.readFileSync('./users.json', { encoding: 'utf8' });
  const users: { [slack: string]: string; } = JSON.parse(jsonString);
  return new Map(
    Object
      .keys(users)
      .map((slack: string): [string, string] => {
        return [slack, users[slack]];
      }));
};

const initConfig = (): Config => {
  return {
    accessToken: process.env.NODE_SLACK_ACCESS,
    githubPass: process.env.NODE_GITHUB_PASS,
    githubTeam: process.env.NODE_GITHUB_TEAM,
    githubUsername: process.env.NODE_GITHUB_USERNAME,
    githubUsernames: loadGitHubUsernames(),
    verificationToken: process.env.NODE_SLACK_VERIFICATION
  };
};

export { Config, initConfig };
