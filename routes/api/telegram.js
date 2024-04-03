const bot = require("../../config/telegram");
const TelegramID = require("../../model/TelegramID");

const router = require("express").Router();

router.post("/send-message", async (req, res) => {
    try {
        const { msg } = req.body;
        const users = await TelegramID.find({});
        if (!msg) {
            return res.json({ success: false, msg: "no message sent" });
        }
        users.forEach(async user => {
            await bot.sendMessage(user.telegramID, msg);
        })
        return res.json({ success: true })
    } catch (err) {
        return res.json({ success: false, msg: "Something went wrong" });
    }
});


module.exports = router;