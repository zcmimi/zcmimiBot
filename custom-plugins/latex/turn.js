"use strict";
const mjAPI = require("mathjax-node"),
    sharp = require('sharp');
mjAPI.config({
    MathJax: {
        // traditional MathJax configuration
    }
});
mjAPI.start();

async function tex2svg(math) {
    return await mjAPI.typeset({
        math,
        format: "TeX",// "TeX", or "inline-TeX", "MathML"
        svg: true,// mml:true, or svg:true, or html:true
        // png:true,scale: 1,
        height: 50,
    }).then(res=>res.svg);
}

async function tex2img(tex) {
    return await sharp(Buffer.from(await tex2svg(tex)),{density:300});
}
async function test() {
    var res=await tex2img("E=mc^2");
    // res.png().;
    // res.
    console.log(res);
}
// test()
module.exports={
    tex2svg,tex2img
}