const { default: Bot } = require("el-bot");
const { Message } = require("mirai-ts");
const fs=require("fs");
module.exports = async(ctx) => {
    const mirai = ctx.mirai;
    mirai.on("message", async(msg) => {
        if (msg.plain == 'test') {
            var voice=await mirai.api.uploadVoice("group",fs.createReadStream("./tmp/tts.amr"));
            console.log(voice);
            msg.reply([Message.Voice(voice.voiceId)]);
        }
    });
};
