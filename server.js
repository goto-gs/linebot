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

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    let replyText = '';
    if (event.message.text === '武田') {
        replyText = '紀之';
    } else {
        replyText = '知らない人ですね';
    }
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText //実際に返信の言葉を入れる箇所
    });
}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);
