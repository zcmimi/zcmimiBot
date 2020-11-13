"use strict";
const {Message}=require("mirai-ts");
const fs=require("fs");
var numberBomb={
    create:{re:"数字炸弹 创建"},
    join:{re:"数字炸弹 加入"},
    start:{re:"数字炸弹 开始"},
};
var L,R,V,players;
function create(){
    L=1,R=100;
    V=L+Math.floor(Math.random()*(R-L+1));
    players=[];
}
function join(id){
    
}
function start(){
    
}
module.exports=(ctx)=>{
    const config=ctx.el.config;
    const mirai=ctx.mirai;
    numberBomb={...numberBomb,...config.numberBomb};
    const rule={
        create:new RegExp(numberBomb.create.re),
        join:new RegExp(numberBomb.join.re),
        start:new RegExp(numberBomb.start.re),
    }
    mirai.on("message",async(msg)=>{
        if(msg.plain.match(rule.create)){

        }
        else if(msg.plain.match(rule.join())){

        }
    });
};