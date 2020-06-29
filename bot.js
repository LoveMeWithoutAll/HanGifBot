const TelegramBot = require('telegraf');
const token = '331577450:AAGDlpOzGyeJ3fjFPXc35ydg8PPni9nLtYs';
const bot = new TelegramBot(token);

const Bing = require('node-bing-api')({ accKey: "" });

function bingImageSearch(query, callback){
    Bing.images(query, {
    top: 12,   // Number of results (max 50) 
    imageType: 'AnimatedGif'
    }, function(error, res, body){
        console.log('여기서 시작. 검색어는 ' + query);
        callback(body.value);
    });
}

bot.on('message', async ctx => {
    await ctx.reply('이 봇은 인라인봇입니다.')
    await ctx.reply('채팅창에 @hangifbot 검색어 를 입력하세요!')
});

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery}) => {
    if (inlineQuery.query == '') return;

    const q_query = inlineQuery.query;

    bingImageSearch(q_query, (q_result) => {

        const q_id = inlineQuery.id;
        let results = [];

        if (q_result == undefined) return answerInlineQuery(results);

        for (let i = 0; i < q_result.length; ++i) {
            const InlineQueryResultGif = {
                'type': 'gif',
                'gif_url': q_result[i].contentUrl,
                'thumb_url': q_result[i].thumbnailUrl,
                'id': q_result[i].imageId,
                'caption': q_query,
                'gif_width': 48,
                'gif_height': 48
            };
            results.push(InlineQueryResultGif);
        }
        console.log(results);

        answerInlineQuery(results);
    });
});

bot.on('chosen_inline_result', function(msg)
{
    console.log('Chosen:' + msg);
});

bot.launch();