# sandbox-gpt-engineer
gpt-engineer を試してみる。

## 初期実装
- 直下に gpt-engineer を clone する。
  - `git clone https://github.com/AntonOsika/gpt-engineer.git`
- `mkdir -r projects`
- `cp -r gpt-engineer/projects/example/ projects/my-new-project`
- my-new-project/prompt に開発のためのプロンプトを記述する。
- `gpt-engineer projects/my-new-project gpt-4-1106-preview`
- 生成したアプリケーションの実装方法で実装を行う

## 修正
- 以下の手順は間違い
  - feedback ファイルに修正内容を書き込む
  - `gpt-engineer projects/my-new-project gpt-4-1106-preview --steps use_feedback`
- `gpt-engineer projects/my-new-project -i`