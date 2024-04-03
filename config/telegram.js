const TelegramBot = require('node-telegram-bot-api');
const TelegramID = require('../model/TelegramID');

const botToken = process.env.TELEGRAMID;
const bot = new TelegramBot(botToken, { polling: true });

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const resp = msg.text;
    console.log(chatId);
    if (resp.toLocaleLowerCase() === '/start' || resp.toLocaleLowerCase() === "start") {
        const idExists = await TelegramID.findOne({ telegramID: chatId });
        if (!idExists) {
            const newID = new TelegramID({
                telegramID: chatId
            });
            await newID.save();
        }
        bot.sendMessage(chatId, chatId);
    }
});

module.exports = bot;
