"use strict";
const {Message}=require("mirai-ts");
const fs=require("fs");
const { group } = require("console");
var numberBomb={
    create:{re:"数字炸弹 创建"},
    join:{re:"数字炸弹 加入"},
    start:{re:"数字炸弹 开始"},
    select:{re:"数字炸弹 选择 ([0-9]+)"},
    exit:{re:"数字炸弹 退出"},
    help:
`
数字炸弹 创建
`
};
class game{
    constructor(L,R,V=false){
        this.L=L;this.R=R;
        if(!V)V=L+Math.floor(Math.random()*(R-L+1));
        this.V=V;
        this.players=[];this.now=0;
    }
    join(ID){this.players.push(ID);}
    get ID(){return this.players[this.now];}
    start(){
        return {
            L:this.L,R:this.R,
            ID:this.players[this.now]
        }
    }
    select(v){
        if(v==this.V)return false;
        else if(v<this.L||v>this.R)return this.start();
        else{
            if(v<this.V)this.L=v;else this.R=v;
            this.now=(this.now+1)%this.players.length;
            return this.start();
        }
    }
}
module.exports=(ctx)=>{
    const config=ctx.el.config;
    const mirai=ctx.mirai;
    numberBomb={...numberBomb,...config.numberBomb};
    const rule={
        create:new RegExp(numberBomb.create.re),
        join:new RegExp(numberBomb.join.re),
        start:new RegExp(numberBomb.start.re),
        select:new RegExp(numberBomb.select.re),
        exit:new RegExp(numberBomb.exit.re),
    }
    var groups={};
    mirai.on("message",(msg)=>{
        if(msg.type!="GroupMessage")return;
        var match,groupId=msg.sender.group.id,senderId=msg.sender.id;
        if(msg.plain.match(rule.create)){
            groups[groupId]=new game(1,100);
            groups[groupId].join(senderId);
            msg.reply([Message.Plain("已创建\n玩家列表: "),Message.At(senderId)]);
        }
        else if(msg.plain.match(rule.join)){
            if(groups[groupId]){
                groups[groupId].join(senderId);
                var messageChain=[Message.Plain("已加入\n玩家列表: ")];
                for(var i of groups[groupId].players)
                    messageChain.push(Message.At(i));
                msg.reply(messageChain);
            }
            else msg.reply("请先创建");
        }
        else if(match=msg.plain.match(rule.start)){
            if(groups[groupId]){
                var res=groups[groupId].start();
                if(res)msg.reply([Message.At(res.ID),Message.Plain(`[${res.L},${res.R}]`)]);
            }
            else msg.reply("请先创建");
        }
        else if(match=msg.plain.match(rule.select)){
            if(groups[groupId]){
                if(senderId!=groups[groupId].ID){
                    msg.reply([Message.At(senderId),Message.Plain('还没轮你')]);
                    return;
                }
                var res=groups[groupId].select(Number(match.pop()));
                if(res)msg.reply([Message.At(res.ID),Message.Plain(`[${res.L},${res.R}]`)]);
                else{
                    msg.reply([Message.At(senderId),Message.Plain('恭喜中奖')]);
                    groups[groupId]=false;
                }
            }
            else msg.reply("请先创建");
        }
        else if(match=msg.plain.match(rule.exit)){
            groups[groupId]=false;
            msg.reply("已退出");
        }
    });
};