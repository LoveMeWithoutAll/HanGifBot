const TelegramBot = require('node-telegram-bot-api');
const token = '331577450:AAGDlpOzGyeJ3fjFPXc35ydg8PPni9nLtYs';
const bot = new TelegramBot(token, {polling: true});

var Bing = require('node-bing-api')({ accKey: "423008762e8f4cfa953d5304aa8b7863" });

function bingImageSearch(query, callback){
    Bing.images(query, {
    top: 4,   // Number of results (max 50) 
    imageType: 'AnimatedGif'
    }, function(error, res, body){
        console.log('여기서 시작. 검색어는 ' + query);
        callback(body.value);
    });
}

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    
    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
   const chatId = msg.chat.id;
   
   bot.sendMessage(chatId, '이 봇은 인라인봇입니다.');
   bot.sendMessage(chatId, '채팅창에 @hangifbot 검색어 를 입력하세요!');
});

bot.getMe().then(function(me){
   console.log('it is me: ' +me) ;
});

bot.on('inline_query', function(msg)
{
    if(msg.query == '') return;
    
    var q_query = msg.query;
    var qs = require('querystring');
    q_query = qs.escape(q_query);
    
    bingImageSearch(q_query, function(q_result){
        
        var q_id = msg.id;
        var results = []; 
        
        if( q_result == undefined ) return bot.answerInlineQuery(q_id, results);
        
        for (var i = 0; i < q_result.length; ++i) {
            var InlineQueryResultGif = {
                'type': 'gif', 
                'gif_url': q_result[i].contentUrl,
                'thumb_url': q_result[i].thumbnailUrl,
                'id': q_result[i].imageId,
                'caption': qs.unescape(q_query),
                'gif_width': 48,
                'gif_height': 48
            };
            results.push(InlineQueryResultGif);
        }
        console.log(results);
        bot.answerInlineQuery(q_id, results);
    });
});

bot.on('chosen_inline_result', function(msg)
{
    console.log('Chosen:' + msg);
});
