"use strict";
const {utils}=require("el-bot");
const {Message}=require("mirai-ts");
const request=require("superagent");

var SearchEngine={
    google:{
        proxy:"http://127.0.0.1:7890",
        re: "/google (.+)"
    },
    baidu:{
        re:"/baidu (.+)"
    }
};
const headers={
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
}
async function baidu(keyword){
    var url=encodeURI(`https://www.baidu.com/s?wd=${keyword}`)
    console.log(url)
    var html=await request.get(url).set(headers).then(res=>res.text);
    var rule=new RegExp(`data-tools=['"]{['"]title['"]:['"]([^<]+)['"],['"]url['"]:['"]([^<]+)['"]}['"]`,'g')
    var res=[],x;
    while(x=rule.exec(html))
        res.push({title:x[1],url:x[2]})
    return res;
}
async function google(keyword){
    var url=encodeURI(`https://www.google.com/search?q=${keyword}`);
    var html=await request.get(url).set(headers).proxy(SearchEngine.google.proxy).then(res=>res.text);

    var rule=new RegExp(`<a href="([^<]+)" ping="([^<]+)"><br><h3 class="LC20lb DKV0Md"><span>([^<]+)</span></h3>`,'g')
    var res=[],x;
    while(x=rule.exec(html))
        res.push({title:x[3],url:x[1]});
    return res;
}
module.exports=(ctx)=>{
    const config=ctx.el.config;
    const mirai=ctx.mirai;
    SearchEngine={...SearchEngine,...config.SearchEngine};
    if(SearchEngine.google.proxy)require('superagent-proxy')(request);
    const rule={
        google:new RegExp(SearchEngine.google.re,'i'),
        baidu:new RegExp(SearchEngine.baidu.re,'i')
    }
    mirai.on("message",async(msg)=>{
        var match=msg.plain.match(rule.baidu),keyword;
        if(match){
            keyword=match.pop();
            msg.reply(`正在百度 "${keyword}" , 请稍等...`);
            try{var res=await baidu(keyword);}
            catch(e){console.log(e);msg.reply("出错了,请重试qwq");}
            for(var i of res)
                try{msg.reply(`${i.title}: ${i.url}`);}
                catch(e){console.log(e,i);}            
        }
        var match=msg.plain.match(rule.google);
        if(match){
            keyword=match.pop();
            msg.reply(`正在谷歌 "${keyword}" , 请稍等...`);
            try{var res=await google(keyword);}
            catch(e){console.log(e);msg.reply("出错了,请重试qwq");}
            for(var i of res)
                try{msg.reply(`${i.title}: ${i.url}`);}
                catch(e){console.log(e,i);}            
        }
    });
};