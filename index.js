
const TelegramBot = require('node-telegram-bot-api');

const token = '445138642:AAFLiCODZoPEXR9mAznxd5cfWkJwcTuMvgc';

const bot = new TelegramBot(token, { polling: true });

const tasks = require ('./tasks.js');

const users = {};



const startMenu =JSON.stringify({
  
    inline_keyboard:[
  
        [{ text:'Я готов!', callback_data:'getTask'}]
    ]
});


bot.onText(/\/start/, (msg, match) => {
    users[msg.chat.id]={task:0};
    bot.sendMessage(msg.chat.id,'Привет дорогой друг');
    bot.sendMessage(msg.chat.id,'Я пришлю тебе случайное задание и ты должен его решить! Ты готов быть самым умным (НЕТ)',{reply_markup: startMenu});    
});

bot.onText(/.+/,(msg,match) =>{
     if(users[msg.chat.id].task!=0){    
        if(users[msg.chat.id].task.answer==msg.text){
            bot.sendMessage(msg.chat.id,'Все правильно! Хочешь еще ?',{reply_markup: startMenu});   
          users[msg.chat.id].task=0;            
        }
        else bot.sendMessage(msg.chat.id,'Неправильно :(');
    }
});

 bot.on('callback_query',cbQuery =>{

    const chatId = cbQuery.message.chat.id; 
    const msgId = cbQuery.message.message_id;

    if (cbQuery.data == 'getTask'){
      users[chatId].task=tasks[0];
      bot.editMessageText("Загружаю задание",{chat_id: chatId, message_id: msgId});
      bot.answerCallbackQuery(cbQuery.id,"",false);
      bot.sendPhoto(chatId,__dirname+'/./images/'+users[chatId].task.img);
    }
});

console.log('Сервер запущен');