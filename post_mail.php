<?php

/**
 * 送信元・送信先・SendGridのAPIキーはConfig Varsにより登録(変更)可能
 * なため、様々なメール送信ができるので汎用性あります。
 */
require 'vendor/autoload.php';    //SendGridのために。dotenvは元から入ってるっぽい・・・。

$text = $_POST['text'];
$userName = $_POST['user_name'];

$arrText = explode('|', $text);
$mailTitle = $arrText[0];
$mailContent = $arrText[1];

//不正チェック
if ($_POST['token'] != getenv('APP_VERIFICATION_TOKEN')) {
    postSlack('不正tokenのため、メール送信しませんでした。', $mailTitle, $mailContent);
    return false;
}

//メール送信(SendGrid)
$statusCode = sendMail($mailTitle, $mailContent);

$sendResult = ($statusCode == 202) ? 'メール送信に成功しました。' : 'メール送信に失敗しました。';
$sendResult .= "({$userName} さんにより実行されました。)[$statusCode]";

//slackにメール送信結果を投稿する
postSlack($sendResult, $mailTitle, $mailContent);


/**
 * SendGridを使用してメール送信を行う。
 * 送信元・送信先・SendGridのAPIキーはConfig Varsにより登録
 *
 * @param string $title メール件名
 * @param string $content メール内容
 * @return integer $statusCode ステータスコード
 */
function sendMail($title, $content)
{
    $to = getenv('TO_ADDRESS');
    $from = getenv('FROM_ADDRESS');

    //herokuではメール送信できないため以下は使えない。
    /*
    $header = "From :{$from}\r\n";
    mb_language('Japanese');
    mb_internal_encoding('UTF-8');
    return mb_send_mail($to, $title, $content, $header);
    */

    //SendGridを使用する
    $email = new \SendGrid\Mail\Mail();
    $email->setFrom($from);
    $email->setSubject($title);
    $email->addTo($to);
    $email->addContent("text/plain", $content);
    $sendGrid = new \SendGrid(getenv('SENDGRID_API_KEY'));
    try {
        $response = $sendGrid->send($email);
        return $response->statusCode() . "\n";
//        print_r($response->headers());
//        print $response->body() . "\n";
    } catch (Exception $e) {
        echo 'Caught exception: '. $e->getMessage() ."\n";
    }


    //$response->headers();
    //$response->body();
}

/**
 * IncomingWebHookへPOSTし、slackへ投稿する。
 * (投稿先のchannelは　slack API > app > Incoming Webhooks より設定する)
 *
 * @param string $sendResult メール送信結果
 * @param string $title メール件名
 * @param string $contents メール内容
 */
function postSlack($sendResult, $title, $contents)
{
    $payload = array(
        'attachments' => array(
            array(
                'fallback' => $sendResult,
                'pretext' => $sendResult,
                'color' => '#A4C745',
                'fields' => array(
                    array(
                        'title' => '【件名】',
                        'value' => $title,
                        'short' => false
                    ),
                    array(
                        'title' => '【内容】',
                        'value' => $contents,
                        'short' => false
                    ),
                )
            )
        )
    );

    $IncomingWebHookURL = getenv('INCOMING_WEBHOOKURL');
    $curl = curl_init($IncomingWebHookURL);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_exec($curl);
    curl_close($curl);
}
