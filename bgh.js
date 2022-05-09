"nodejs";

const title = "bingo荟"
const $ = new Env(title);
msg = ""
var errinfo = {
    code: -1
}
const debug = 0 //0为关闭调试，1为打开调试,默认为0
let path = "BGH_DATA";
let ckStr = process.env[path]
let version = 0.1



//请求头
const headers = {
    "Host": "mall.dchmotor.com.cn",
    "Connection": "keep-alive",
    "authorization": "",
    "charset": "utf-8",
    "clientauthorization": "",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; IN2020 Build/QKQ1.191222.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/3211 MMWEBSDK/20220303 Mobile Safari/537.36 MMWEBID/5246 MicroMessenger/8.0.21.2120(0x28001557) Process/appbrand0 WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
    "content-type": "application/x-www-form-urlencoded",
    "Referer": "https://servicewechat.com/wxe187408ca824ca4b/102/page-frame.html",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
}









//当前时间

async function tips(ckArr, version) {
    console.log(`\n版本:${version}`);
    console.log(`\n================================================\n脚本执行 - 北京时间(UTC+8): ${new Date(
		new Date().getTime() +
		new Date().getTimezoneOffset() * 60 * 1000 +
		8 * 60 * 60 * 1000
	).toLocaleString()} \n================================================\n`);
    await wyy();
    console.log(`\n=================== 共找到 ${ckArr.length} 个账号 ===================`);
    $.debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);
}






//开始运行

!(async () => {
    let ckArr = await $.getCks(ckStr, path);
    await tips(ckArr, version);
    for (let index = 0; index < ckArr.length; index++) {
        let num = index + 1;
        console.log(`\n========= 开始【第 ${num} 个账号】=========\n`);

        myaccount = ckArr[index].split("@")[0];
        authorization = ckArr[index].split("@")[1];
        clientauthorization = ckArr[index].split("@")[2];
        headers.authorization = "Bearer " + authorization;
        headers.clientauthorization = "Bearer " + clientauthorization;
        msg += `\n🔔账号[${num}]: ${myaccount}\n`
        $.debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${myaccount}`);
        await dotask();


    }
    PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN;
    if (PLUS_TOKEN != "") {
        pushplus(title, PLUS_TOKEN, msg)
    } else {
        console.log("🔔默认用pushplus推送,请在配置文件里填写")


    }


})()
.catch((e) => $.log(e))
    .finally(() => $.done());





async function dotask() {
    $.dottedLine("签到")
    await signin();
    $.dottedLine("积分")
    await integral();
}



async function signin() {
    let url = {
        url: "https://mall.dchmotor.com.cn/service/markting/signin",
        headers: headers,
        timeout: 5 * 1000
    }
    await $.get(url, "签到")
        .then(function(response) {
            if (response.success == 1) {
                msg += "🔔签到:成功" + "\n"
                console.log("🔔签到:成功");
            } else {
                console.log("🔔签到:" + response.message)
            }
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })

}

async function integral() {
    let url = {
        url: "https://mall.dchmotor.com.cn/service/member/point/index",
        headers: headers,
        timeout: 5 * 1000
    }
    await $.get(url, "积分")
        .then(function(response) {
            if (response.success == 1) {
                msg += "🔔总积分:" + response.content.point + "\n"
                console.log("🔔总积分:", response.content.point);
            } else {
                console.log("🔔总积分:" + response.message)
            }
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })

}






////固定代码==================================================================================



async function wyy() {
    let url = {
        url: `https://keai.icu/apiwyy/api`,
        timeout: 5 * 1000
    }
    await $.get(url, "网易云")
        .then(function(response) {
            data = response
            console.log(`\n 【网抑云时间】: ${data.content}  by--${data.music}`);
            msg += `\n 【网抑云时间】: ${data.content}  by--${data.music}\n`


        })
        .catch(function(error) {
            console.log(error);
        })

}


function pushplus(title, token, msg) {
    return new Promise(async (resolve) => {

        try {

            let data = {
                "token": token,
                "title": title,
                "content": msg.replace(/\n/g, "<br>"),
                "temple": "html"
            }
            let url = {
                url: "http://www.pushplus.plus/send",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                timeout: 5 * 1000
            }
            let res = await $.post(url, `发送`);
            if (res.code == 200) {
                console.log("pushplus:发送成功");
            } else {
                console.log("pushplus:发送失败");
                console.log(res.msg);
            }
        } catch (err) {
            console.log("pushplus酱：发送接口调用失败");
            console.log(err);
        }
        resolve();
    });
}



function Env(t, e) {    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);    class s {        constructor(t) {            this.env = t        }    }    return new class {        constructor(t, e) {            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)        }        get(t, e) {            const axios = require("axios");            return new Promise(async (resolve) => {                if (debug) {                    $.log(                        `\n 【debug】=============== 这是 ${e} 请求 url ===============`                    );                    $.log(t.url);                }                await $.wait(t.timeout);                await axios.get(t.url, {                        headers: t.headers                    })                    .then(function(response) {                        try {                            if (debug) {                                $.log(                                    `\n 【debug】=============== 这是 ${e} 返回 data ===============`                                );                                $.log(JSON.stringify(response.data));                            }                        } catch (e) {}                        if ($.safeGet(response.data)) {                            re = JSON.parse(response.data);                            resolve(re);                        } else {                            resolve(response.data);                        }                    })                    .catch(function(error) {                        resolve(errinfo);                    })            })        }        post(t, e) {            const axios = require("axios");            return new Promise(async (resolve) => {                if (debug) {                    $.log(                        `\n 【debug】=============== 这是 ${e} 请求 url ===============`                    );                    $.log(t.url);                }                await $.wait(t.timeout);                await axios.post(t.url,t.body, {                        headers: t.headers                    })                    .then(function(response) {                        try {                            if (debug) {                                $.log(                                    `\n 【debug】=============== 这是 ${e} 返回 data ===============`                                );                                $.log(JSON.stringify(response.data));                            }                        } catch (e) {}                        if ($.safeGet(response.data)) {                            re = JSON.parse(response.data);                            resolve(re);                        } else {                            resolve(response.data);                        }                    })                    .catch(function(error) {                        resolve(errinfo);                    })            })        }        delete(t, e) {            const axios = require("axios");            return new Promise(async (resolve) => {                if (debug) {                    $.log(                        `\n 【debug】=============== 这是 ${e} 请求 url ===============`                    );                    $.log(t.url);                }                await $.wait(t.timeout);                await axios.delete(t.url, {                        headers: t.headers                    })                    .then(function(response) {                        try {                            if (debug) {                                $.log(                                    `\n 【debug】=============== 这是 ${e} 返回 data ===============`                                );                                $.log(JSON.stringify(response.data));                            }                        } catch (e) {}                        if ($.safeGet(response.data)) {                            re = JSON.parse(response.data);                            resolve(re);                        } else {                            resolve(response.data);                        }                    })                    .catch(function(error) {                        resolve(errinfo);                    })            })        }        log(...t) {            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator));        }        wait(t) {            return new Promise(e => setTimeout(e, t));        }        md5(t) {            const crypto = require("crypto");            return crypto.createHash('md5').update(t).digest('hex').toLowerCase();        }        sha1(t) {            const crypto = require("crypto");            return crypto.createHash('sha1').update(t).digest('hex').toLowerCase();        }        sha256(t) {            const crypto = require("crypto");            return crypto.createHash('sha256').update(t).digest('hex').toLowerCase();        }        dottedLine(t) {            msg += `\n========= ${t} =========\n`;            console.log(`\n========= ${t} =========\n`);        }                getCks(t, e) {            return new Promise((resolve, reject) => {                let ckArr = [];                if (t) {                    if (t.indexOf("\n") != -1) {                        t.split("\n").forEach((item) => {                            ckArr.push(item);                        });                    } else {                        ckArr.push(t);                    }                    resolve(ckArr);                } else {                    console.log(`\n 【${title}】：未填写变量 ${e}`);                }            })        }        debugLog(t) {            if (debug) {                console.log(t);            }        }        safeGet(t) {            if (typeof t == 'string') {                try {                    var obj = JSON.parse(t);                    if (typeof obj == 'object' && obj) {                        return true;                    } else {                        return false;                    }                } catch (e) {                    return false;                }            }        }        done(t = {}) {            const e = (new Date).getTime(),                s = (e - this.startTime) / 1e3;            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log()        }    }(t, e)}
