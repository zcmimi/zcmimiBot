const { default: Bot } = require("el-bot");
const { Message } = require("mirai-ts");
var helpText=
`
百度 <关键词> 
谷歌 <关键词>
来份色图
来点<xxx>笑话
一言
土味情话
/latex <LATEX表达式>
数字炸弹 创建/加入/开始/选择 <数字>/取消
`
module.exports = async(ctx) => {
    const mirai = ctx.mirai;
    mirai.on("message", async(msg) => {
        if (msg.plain=='help')msg.reply(helpText);
    });
};
