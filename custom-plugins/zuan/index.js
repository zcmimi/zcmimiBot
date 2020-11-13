"use strict";
const {Message}=require("mirai-ts");
const zuan=require("./zuan");
function get(){
    return zuan[Math.floor(Math.random()*zuan.length)];
}
module.exports=(ctx)=>{
    const config=ctx.el.config;
    const mirai=ctx.mirai;
    const rule=new RegExp("祖安对线");
    mirai.on("message",(msg)=>{
        if(msg.plain.match(rule))msg.reply(get());
    });
};