'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '3e997dc5d850387373d71219ad6ab5ca',
    channelAccessToken: '2dyszR/lMQoQawMFQ1p/U5rx5YgFUflUWEE0TUoIfFAfjx8u9/iMkR0ChMuNlSwlW4v37fEcKzw+sEl0P2CZ0d4YTwnmqHG0z7ObkIeQwbLDumRAlP7sjyvYvaEojw8Qwv4Ea0UtKz0agNtI559ppQdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return;
    }

    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

// botが返信する内容を決めとる関数
function handleEvent(event) {
    //送られてきたメッセージがテキスト、画像以外なら何もしない
    if (event.type !== 'message' || event.message.type !== 'text') {
        if (event.message.type !== 'image') {
            return Promise.resolve(null);
        }
    }

    // event.message.type(受信したメッセ)が画像だったときは、カワイイと言ってハートのスタンプを送る
    if (event.message.type == 'image') {
        // event.replyToken（リターンメッセージ）が配列[]になっているのがポイント
        return client.replyMessage(event.replyToken, [{
            type: 'text',
            text: 'カワイイ'
        },
        {
            type: 'sticker',
            packageId: '11538',
            stickerId: '51626495' //スタンプはIdで変更可能
        }]);
    } else {
        let replyText = '';
        if (event.message.text === '好き') {
            replyText = '俺も';
        } else if (event.message.text === '大好き') {
            replyText = '俺の方が好きだ';
        } else {
            replyText = '君の顔が見たいな。写真送ってよ。';
        }
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: replyText //返信する内容
        });
    }
}

// これはローカルの確認用で使ったやつ
// app.listen(PORT);

// ngrokはこれ
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);
