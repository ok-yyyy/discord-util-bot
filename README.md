# discord-util-bot

個人向けの Discord Bot です。

## 環境変数

次の環境変数が必要です。

- `DISCORD_BOT_TOKEN`: Discord Bot のトークン

## ローカルでの実行

### Go で実行

```shell
export DISCORD_BOT_TOKEN=xxx
cd ./app
go run ./cmd/bot
```

### Docker で実行

```shell
docker build -t discord-util-bot .
docker run --rm --env-file .env discord-util-bot
```

## infra

infra ディレクトリには AWS CDK の定義があります。

SSM Parameter Store に `discord-util-bot/token` という名前で Discord Bot のトークンを保存している前提です。

GitHub Actions を利用して CDK の deploy やアプリケーションのビルドを行います。
そのため、GitHub Secrets にAWSアカウントIDを登録しておく必要があります。
また、 GitHub OIDC は GitHubActionsCdkRole という名前の IAM Role を利用する前提です。

## ディレクトリ構成

```
discord-util-bot/
|-- .github/workflows/  # GitHub Actions ワークフロー定義
|-- app/                # Go アプリケーション
|   |-- cmd/
|   |-- internal/
|   |-- go.mod
|   `-- go.sum
|-- infra/              # AWS CDK プロジェクト (TypeScript)
|   |-- bin/
|   `-- lib/
|-- Dockerfile
`-- README.md
```
