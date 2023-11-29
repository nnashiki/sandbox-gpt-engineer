# sandbox-gpt-engineer
gpt-engineer を試してみる。

## 初期実装
- 直下に gpt-engineer を clone する。
  - `git clone https://github.com/AntonOsika/gpt-engineer.git`
- `mkdir -r projects`
- `cp -r gpt-engineer/projects/example/ projects/my-new-project`
- my-new-project/prompt に開発のためのプロンプトを記述する。
- `gpt-engineer projects/my-new-project`
- 生成したアプリケーションの実装方法で実装を行う

## 修正
- feedback ファイルに修正内容を書き込む
- gpt-engineer projects/my-new-project --steps use_feedback
