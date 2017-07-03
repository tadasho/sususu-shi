import fetch from 'node-fetch';

const fetchUserList = (token: string): Promise<Map<string, string>> => {
  interface SlackUser {
    id: string;
    name: string;
  }
  interface SlackUserList {
    members: SlackUser[];
    ok: boolean;
  }
  const body = JSON.stringify({ token });
  const headers = { 'Content-Type': 'application/json' };
  const method = 'POST';
  const url = 'https://slack.com/api/users.list';
  return fetch(url, { body, headers, method })
    .then((response) => response.json())
    .then(({ members, ok }: SlackUserList) =>
      ok ? Promise.resolve(members) : Promise.reject(new Error('ok is false')))
    .then((members: SlackUser[]) =>
      members.reduce(
        (map: Map<string, string>, { id, name }) => map.set(id, name),
        new Map<string, string>()));
};

const postMessage = (
  token: string,
  channel: string,
  text: string
): Promise<void> => {
  interface SlackPostMessage {
    ok: boolean;
  }
  const body = JSON.stringify({
    channel,
    text,
    token
  });
  const headers = { 'Content-Type': 'application/json' };
  const method = 'POST';
  const url = 'https://slack.com/api/chat.postMessage';
  return fetch(url, { body, headers, method })
    .then((response) => response.json())
    .then(({ ok }: SlackPostMessage) =>
      ok ? Promise.resolve(void 0) : Promise.reject(new Error('ok is false')));
};

export { fetchUserList, postMessage };
