const { default: Bot } = require("el-bot");
const {Message}=require("mirai-ts");
module.exports = (ctx) => {
    const mirai = ctx.mirai;
    mirai.on("message", (msg) => {
        if(msg.plain=='test'){}
  });
};
