// https://api.slack.com/apps/AENV5LULV/general
import {Utils} from "./_utils";

const slackToken = PropertiesService.getScriptProperties().getProperty('SLACK_VERIFICATION_TOKEN');
const toAdress = PropertiesService.getScriptProperties().getProperty('TO_ADDRESS');
const fromAdress = PropertiesService.getScriptProperties().getProperty('FROM_ADDRESS');
const incomingWebhookUrl = PropertiesService.getScriptProperties().getProperty('INCOMING_WEBHOOK_URL');

function doPost(e): void
{
  const utils = new Utils();

  const postDataContents = e.postData.contents; //token=xxx&text=title%7Ccontent&user_name=kin29.com
  const postDataObject = utils.toObjectFromQuery(postDataContents);
  const postedToken = postDataObject.token;
  const text = postDataObject.text;
  const decodedText = decodeURIComponent(text);
  const userName = postDataObject.user_name;

  const arrText = decodedText.split('|');
  const mailTitle = arrText[0];
  const mailContent = arrText[1];

  //不正チェック
  if (postedToken != slackToken) {
      postSlack('不正tokenのため、メール送信しませんでした。', mailTitle, mailContent);
  }
  //メール送信
  sendGoogleMail(mailTitle, mailContent);

  const sendResult = "メール送信に成功しました。(" + userName + ") さんにより実行されました。";
  //slackにメール送信結果を投稿する
  postSlack(sendResult, mailTitle, mailContent);
}


function sendGoogleMail(title, content): void
{
  const options = {
    'from': fromAdress,
  };
  GmailApp.sendEmail(toAdress, title, content, options);
}


function postSlack(sendResult, title, contents): void
{
  let data = {
    'attachments': [
      {
        'fallback': sendResult,
        'pretext': sendResult,
        'color': '#A4C745',
        'fields': [
          {
            'title': '【件名】',
            'value':  title,
            'short': false
          },
          {
            'title': '【内容】',
            'value':  contents,
            'short': false
          }
        ]
      }
    ]
  };
  let options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };

  UrlFetchApp.fetch(incomingWebhookUrl, options);
}
