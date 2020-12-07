"use strict";
const {Message}=require("mirai-ts");
const googleTTS = require('google-tts-api');
const request=require("superagent");
const fs=require('fs');
const {exec, execSync}=require('child_process');

function hasCN(str){return /.*[\u4e00-\u9fa5]+.*$/.test(str);}
function hasJP(str){return /.*[\u3040-\u309F\u30A0-\u30FF]+.*$/.test(str);}
function hasKOR(str){return /.*[\uAC00-\uD7A3]+.*$/.test(str);}
function lang(text,google=false){
    if(hasJP(text))return google?'ja':'jp';
    if(hasKOR(text))return 'ko';
    if(hasCN(text))return 'zh';
    return 'en';
}
async function google(text){
    return await googleTTS(text,lang(text,1),1);
}
function baidu(text){
    return `https://fanyi.baidu.com/gettts?lan=${lang(text)}&text=${encodeURI(text)}&spd=3&source=web`;
}
const headers={
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
}
var tts={
    baidu:"/tts (.+)",
    google:"/tts google (.+)"
}
module.exports=async(ctx)=>{
    const config=ctx.el.config;
    const mirai=ctx.mirai;
    tts={...tts,...config.tts};
    const rule={
        baidu:new RegExp(tts.baidu),
        google:new RegExp(tts.google),
    }
    mirai.on("message",async(msg)=>{
        var match;
        if(match=msg.plain.match(rule.google)){
            try{var url=await google(match.pop());}
            catch(e){console.log(e);msg.reply("出错了,请重试qwq");}
            reply(url);
        }
        else if(match=msg.plain.match(rule.baidu)){
            reply(baidu(match.pop()));
        }
        function reply(url){
            request.get(url).set(headers).end(async(err,res)=>{
                fs.writeFileSync('./tmp/tts.mp3',res.body);
                execSync("ffmpeg -i ./tmp/tts.mp3 -ac 1 -ar 8000 ./tmp/tts.amr -y");
                var voice=await mirai.api.uploadVoice(
                    msg.type=='GroupMessage'?"group":"friend",
                    fs.createReadStream('./tmp/tts.amr')
                );
                console.log(voice);
                msg.reply([Message.Voice(voice.voiceId)]);
            });
        }
    });
};