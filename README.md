# slack command

## how to
1.type `/[setting_command] [mail_title] | [mail_contents]` in slack  
2.環境変数 `TO_ADDRESS`に設定されたメールアドレスにメールを送信する。(herokuの場合：SendGridを使用する)  
3.メール送信結果をslackに投稿する。  
![使い方サンプル](https://user-images.githubusercontent.com/12015851/49686602-11cb2100-fb3a-11e8-8ac4-da3dd6cbaacc.png)

## use tool
- heroku
- SendGrid
- slack

## setting
- slack API
    - Appを作成する。([Your Apps](https://api.slack.com/apps/) > Create New App)  
    Basic Information > Building Apps for Slack > Add features and functionality  
      - Slash Commands  
      Request URL に　`https://XXXX/post_mail.php`を設定する。  
      - Incomig Webhooks  
      Incoming Webhooks URL をコピーする。(環境変数に使います)  
      - Permission  
      Redirect URLsを設定する。  
    - Basic Informationより、Verification Token をコピーする(環境変数に使います)(環境変数に使います)
    - Install your app to your workspace  
 
- sendgrid
    - API keyを取得する。([SendGridダッシュボード](https://app.sendgrid.com/) > Setting > API Keys より)

- heroku
    - 環境変数を設定する。([herokuアプリ一覧](https://dashboard.heroku.com/apps/) > (アプリを選択) > Settings のConfig Vars）  
    ```
    # slack app
    APP_VERIFICATION_TOKEN="token"
    INCOMING_WEBHOOKURL="https://hooks.slack.com/services/XXX"  
    
    # sendgrid
    SENDGRID_API_KEY="test"  
    
    # mail
    FROM_ADDRESS="from@test.com"
    TO_ADDRESS="to@test.com"
    ```
 

## memo
.envで環境変数を管理する場合は、phpdotenv を導入する必要がある。  
heroku > Setting > Config Vars を使用する場合は不要。  
```
$ composer require vlucas/phpdotenv 
```
