"use strict";
const {Message}=require("mirai-ts");
const {tex2img}=require("./turn");
const fs=require("fs");
var latex={
    re:"/latex (.+)"
};
module.exports=async(ctx)=>{
    const config=ctx.el.config;
    const mirai=ctx.mirai;
    latex={...latex,...config.latex};
    const rule=new RegExp(latex.re);
    mirai.on("message",async(msg)=>{
        var match=msg.plain.match(rule),tex;
        if(match){;
            tex=match.pop();
            try{var img=await tex2img(tex);}
            catch(e){msg.reply("error");console.log(e);return;}
            var png=await img.png();
            await png.toFile("./tmp/latex.png");
            var stream=fs.createReadStream("./tmp/latex.png");
            var upload=await mirai.api.uploadImage(
                msg.type=='GroupMessage'?"group":"friend",
                stream
            );
            msg.reply([Message.Image(upload.imageId)]);
        }
    });
};