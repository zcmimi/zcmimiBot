"use strict";
const {Message}=require("mirai-ts");
const googleTTS = require('./google-tts-api/index');
const request=require("superagent");
const fs=require('fs');
const fff=require('fluent-ffmpeg');

function hasCN(str){return /.*[\u4e00-\u9fa5]+.*$/.test(str);}
function hasJP(str){return /.*[\u3040-\u309F\u30A0-\u30FF]+.*$/.test(str);}
function hasKOR(str){return /.*[\uAC00-\uD7A3]+.*$/.test(str);}
function lang(text){
    if(hasCN(text))return 'zh';
    if(hasJP(text))return 'ja';
    if(hasKOR(text))return 'ko';
    return 'en';
}
async function google(text){
    return await googleTTS(text,lang(text),1);
}
function baidu(text){
    return `https://fanyi.baidu.com/gettts?lan=${lang(text)}&text=${encodeURI(text)}&spd=3&source=web`;
}
const headers={
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
}
async function trans(src,dst){
    await fff(src).save(dst);
}
module.exports=(ctx)=>{
    const config=ctx.el.config;
    const mirai=ctx.mirai;
    const rule=new RegExp("/tts (\\S+)","g");
    mirai.on("message",(msg)=>{
        var x=false;
        while(x=rule.exec(msg.plain)){
            // msg.reply(`正在tts "${x[x.length-1]}" , 请稍等...`);
            var text=x[x.length-1];
            // msg.reply([Message.Voice(null,baidu(text))]);
            // request.get(baidu(text)).set(headers).end(async(err,res)=>{
            //     fs.writeFileSync('./tmp/tts.mp3',res.body);
            //     var voice=await mirai.api.uploadVoice(
            //         msg.type=='GroupMessage'?"group":"friend",
            //         fs.createReadStream('./tmp/tts.mp3')
            //     );
            //     console.log(voice);
            //     msg.reply([Message.Voice(voice.voiceId)]);
            // });
            // return;
            try{google(x[x.length-1]).then(url=>{
                console.log(url);
                request.get(url).set(headers).end(async(err,res)=>{
                    fs.writeFileSync('./tmp/tts.mpga',res.body);
                    await trans('./tmp/tts.mpga','./tmp/tts.amr');
                    
                    var voice=await mirai.api.uploadVoice(
                        msg.type=='GroupMessage'?"group":"friend",
                        fs.createReadStream('./tmp/tts.amr')
                    );
                    console.log(voice);
                    msg.reply([Message.Voice(voice.voiceId)]);
                });
            });}
            catch(e){console.log(e);msg.reply("出错了,请重试qwq");}
        }
    });
};