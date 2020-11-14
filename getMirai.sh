#!/bin/sh
mkdir mirai/content
wget https://github.com/project-mirai/mirai-repo/raw/master/shadow/mirai-console/mirai-console-1.0-M4.jar -O mirai/content/mirai-console-1.0-M4.jar
wget https://github.com/project-mirai/mirai-repo/raw/master/shadow/mirai-console-pure/mirai-console-pure-1.0-M4.jar -O mirai/content/mirai-console-pure-1.0-M4.jar
wget https://github.com/project-mirai/mirai-repo/raw/master/shadow/mirai-core-qqandroid/mirai-core-qqandroid-1.3.0.jar -O mirai/content/mirai-core-qqandroid-1.3.0.jar
mkdir mirai/plugins
wget https://github.com/project-mirai/mirai-api-http/releases/download/v1.8.4/mirai-api-http-v1.8.4.jar -O mirai/plugins/mirai-api-http-v1.8.4.jar
wget https://github.com/zkonge/mirai-console-wrapper/releases/download/v0.1.1/mirai-console-wrapper-0.1.1.jar -O mirai/mirai-console-wrapper-0.1.1.jar