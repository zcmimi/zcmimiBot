"use strict";
require("dotenv").config();
const { resolve } = require("path");
const { utils } = require("el-bot");

module.exports = {
    qq: parseInt(process.env.BOT_QQ),// 你可以直接解析 mirai-api-http 的配置
    db: {
        enable: false,// 默认关闭
        uri: process.env.BOT_DB_URI,
        analytics: true,
    },
    config: utils.config.parse(resolve(__dirname, "./index.yml")),
    setting: utils.config.parse(resolve(__dirname, "../mirai/config/MiraiApiHttp/setting.yml")),
    webhook: {// webhook
        enable: true,
        path: "/webhook",
        port: 7777,
        secret: "mimi040322",
    },
};
