var fs = require("fs");
console.log("build start");
var html = fs.readFileSync("./src/index.html", "utf-8");

function includeCss() {
    var links = html.matchAll(/\<link[^\>]*\>/g);
    if (links) {
        for (let link of links) {
            var href = link[0].match(/href="([^"]*)"/);
            if (href) {
                var css = fs.readFileSync("./src/" + href[1], "utf-8");
                html = html.replace(link[0], "<style>" + css + "</style>");
                console.log("打包css成功: " + href[1]);
            }
        }
    }
}

function includeJs() {
    var scripts = html.matchAll(/\<script[^\>]*\>[\s\S]*?\<\/script\>/g);
    if (scripts) {
        for (let script of scripts) {
            var src = script[0].match(/src="([^"]*)"/);
            if (src) {
                var js = fs.readFileSync("./src/" + src[1], "utf-8");
                html = html.replace(script[0], function () {
                    return "<script>" + js + "</script>";
                });
                console.log("打包js成功: " + src[1]);
            }
        }
    }
}

function includeIni() {
    var files = fs.readdirSync("./src/assets/config/");
    for (let file of files) {
        var ini = fs.readFileSync("./src/assets/config/" + file, "utf-8");
        ini = JSON.stringify(ini);
        html = html.replace(
            '[global]',
            `\r\n<script>window["${file}"] = ${ini};</script>\r\n[global]`
        );
        console.log("打包ini成功: " + file);
    }
}

function version() {
    var version = new Date().getTime().toString();
    html = html.replace(/\{version\}/g, version);
    fs.writeFileSync("./dist/version.txt", version);
    console.log("打包版本号成功: " + version);
}

if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist");
}

includeCss();
includeJs();
includeIni();
version();


fs.writeFileSync("./dist/红警地图单位属性查看器.html", html);
fs.writeFileSync("./docs/index.html", html);
// console.log('html:', html);
console.log("build end");