# sususu-shi

```
% git clone https://github.com/tadasho/sususu-shi.git
% cd sususu-shi/
% npm install
```

rewrite `events-exmple` at line 14 of package.json to your function name.

```
% npm run build && npm run deploy
```

```
% NODE_GITHUB_TEAM='XXX' NODE_GITHUB_PASS='YYY' NODE_GITHUB_USERNAME='ZZZ' npm run watch
```


## 環境変数

- `NODE_GITHUB_PASS`
- `NODE_GITHUB_TEAM`
- `NODE_GITHUB_USERNAME`
- `NODE_SLACK_ACCESS`
- `NODE_SLACK_VERIFICATION`

## コマンド

- `@XXX assign YYY#ZZZ`
- `@XXX review YYY#ZZZ`
