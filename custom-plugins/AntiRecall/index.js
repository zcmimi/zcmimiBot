"use strict";
const { default: Bot } = require("el-bot");
const { config } = require("el-bot/dist/utils");
const { Message } = require("mirai-ts");
/**
 *
 * @param {Bot} ctx
 */
var AntiRecall={
    re:"防撤回|AntiRecall",
    auto:{
        group:[],
        friend:[]
    }
},auto={
    group:new Set(),
    friend:new Set(),
},cache={
    group:{},
    friend:{},
};
module.exports = (ctx) => {
    const config=ctx.el.config;
    const mirai = ctx.mirai;
    AntiRecall={...AntiRecall,...config.AntiRecall};
    for(var i of AntiRecall.auto.group)auto.group.add(i);
    for(var i of AntiRecall.auto.friend)auto.friend.add(i);
    const rule=new RegExp(AntiRecall.re);
    async function reply(msg){
        var t=await mirai.api.messageFromId(msg.messageId);
        var messageChain=[Message.Plain(msg.operator.memberName+"撤回了一条消息: "),...t.messageChain];
        mirai.api.sendGroupMessage(messageChain,msg.operator.group.id,msg.messageId);
    }
    mirai.on("GroupRecallEvent",(msg)=>{
        var groupId=msg.operator.group.id;
        if(auto.group.has(groupId))reply(msg);
        else{
            if(!cache.group[groupId])cache.group[groupId]=[msg];
            else cache.group[groupId].push(msg);
        };
    });
    
    mirai.on("message",(msg)=>{
        if(msg.plain.match(rule)){
            if(msg.type=="GroupMessage"){
                var t=cache.group[msg.sender.group.id];
                if(t&&t.length>0)reply(t.pop());
                else msg.reply('暂无');
            }
            if(msg.type=="FriendMessage")reply(cache.friend[msg.operator]);
        }
        if(msg.plain=='自动防撤回')
            auto.group.add(msg.sender.group.id),
            msg.reply('已开启');
        if(msg.plain=='关闭自动防撤回')
            auto.group.delete(msg.sender.group.id),
            msg.reply('已关闭');
    });
    mirai.on("FriendRecallEvent", async (x) => {
        var t = await mirai.api.messageFromId(x.messageId);
        var messageChain = [Message.Plain("你撤回了一条消息: "), ...t.messageChain];
        mirai.api.sendFriendMessage(messageChain, x.operator,x.messageId);
    });
};
