# slack command

## how to
1. type `/[setting_command] [mail_title] | [mail_contents]` in slack  
2. 環境変数 `TO_ADDRESS`に設定されたメールアドレスにメールを送信する。
3. メール送信結果をslackに投稿する。  
![使い方サンプル](https://user-images.githubusercontent.com/12015851/49686602-11cb2100-fb3a-11e8-8ac4-da3dd6cbaacc.png)

## use tool
- ~~heroku~~ → GAS
- ~~SendGrid~~ → Gmail
- Slack

## setting
### Slack API
- Appを作成する。([Your Apps](https://api.slack.com/apps/) > Create New App)  
Basic Information > Building Apps for Slack > Add features and functionality  
  - Slash Commands  
  Command：slack command
  Request URL：`https://script.google.com/macros/s/xxxx/exec` ←GASをデプロイしたら発行されるウェブアプリURL
- Basic Informationより、Verification Token をコピーする(環境変数に使います)
- Install your app to your workspace  
  - Incomig Webhooks が設定される。  
    メール送信結果を投稿するslackチャンネルを選択し、投稿をAuthorize(許可)する。  
    Incoming Webhooks URL をコピーする。(環境変数に使います)  

### GAS
環境変数を設定する。プロジェクトの設定 > (アプリを選択) > スクリプト プロパティ  
```
# slack app
APP_VERIFICATION_TOKEN="token"
INCOMING_WEBHOOK_URL="https://hooks.slack.com/services/XXX"  

# mail
FROM_ADDRESS="from@test.com"
TO_ADDRESS="to@test.com"
```
