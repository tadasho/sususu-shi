interface Config {
  accessToken: string;
  githubPass: string;
  githubTeam: string;
  githubUsername: string;
  verificationToken: string;
}

const initConfig = (): Config => {
  return {
    accessToken: process.env.NODE_SLACK_ACCESS,
    githubPass: process.env.NODE_GITHUB_PASS,
    githubTeam: process.env.NODE_GITHUB_TEAM,
    githubUsername: process.env.NODE_GITHUB_USERNAME,
    verificationToken: process.env.NODE_SLACK_VERIFICATION
  };
};

export { Config, initConfig };
