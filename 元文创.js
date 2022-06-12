"nodejs";

const title = "元文创"
const $ = new Env(title);
msg = "";
var errinfo = {
    resultCode: -1
}
const debug = 0 //0为关闭调试，1为打开调试,默认为0
let path = "YWC_DATA";
let ckStr = process.env[path];

let version = 0.1






//账号@uuid


const  headers= {
     "Host": "www.ylsc.art",
     "Connection": "keep-alive",
     "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; OPPO R9s Plus Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36",
     "Content-Type": "application/x-www-form-urlencoded",
     "Accept": "*/*",
     "Origin": "https://www.ylsc.art",
     "X-Requested-With": "com.mmbox.browser",
     "Sec-Fetch-Site": "same-origin",
     "Sec-Fetch-Mode": "cors",
     "Sec-Fetch-Dest": "empty",
     "Referer": "https://www.ylsc.art/pages/luckdraw/luckdraw",
     "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
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
        pwd = ckArr[index].split("@")[1];
        msg += `\n🔔账号[${num}]: ${myaccount}\n`
        $.debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${myaccount}`);
        await start();


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





async function start() {
    $.dottedLine("签到")
    await signin();
    $.dottedLine("抽奖")
    await lottery();
}






async function lottery() {
    let url = {
        url: "https://www.ylsc.art/api/intedeb/takeShop",
        headers: headers,
        body:`uuid=${pwd}&type=`,
        timeout: 1 * 1000
    }
    let sign = await $.post(url, `抽奖`)
    if (sign.code == 200) {
        msg += "🔔抽奖成功" + "    \n\n";
        console.log("🔔抽奖成功")
    } else {
        msg += "🔔抽奖失败:" + sign.message + "    \n\n";

        console.log("🔔抽奖失败:", sign.message)

    }

}











async function signin() {
    let url = {
        url:"https://www.ylsc.art/api/intedeb/signIn",
        headers: headers,
        body:`uuid=${pwd}`,
        timeout: 1 * 1000
    }
    let sign = await $.post(url, `签到`)
    if (sign.code == 200) {
        msg += "🔔签到成功" + "    \n\n";
        console.log("🔔签到成功")
    } else {
        msg += "🔔签到失败:" + sign.message + "    \n\n";

        console.log("🔔签到失败:", sign.message)

    }

}






////固定代码==================================================================================



async function wyy() {
    let url = {
        url: `https://keai.icu/apiwyy/api`,
        timeout: 1 * 1000
    }
    await $.get(url, "网易云")
        .then(function(response) {
            data = response;
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



function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
    class s {
        constructor(t) {
            this.env = t
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }
        get(t, e) {
            const axios = require("axios");
            return new Promise(async (resolve) => {
                if (debug) {
                    $.log(`\n 【debug】=============== 这是 ${e} 请求 url ===============`);
                    $.log(t.url);
                }
                await $.wait(t.timeout);
                await axios.get(t.url, {
                    headers: t.headers
                }).then(function(response) {
                    try {
                        if (debug) {
                            $.log(`\n 【debug】=============== 这是 ${e} 返回 data ===============`);
                            $.log(JSON.stringify(response.data));
                        }
                    } catch (e) {}
                    if ($.safeGet(response.data)) {
                        re = JSON.parse(response.data);
                        resolve(re);
                    } else if ($.isobject(response.data)) {
                        resolve(response.data);
                    } else {
                        resolve(response.data);
                    }
                }).catch(function(error) {
                    resolve(errinfo);
                })
            })
        }
        post(t, e) {
            const axios = require("axios");
            return new Promise(async (resolve) => {
                if (debug) {
                    $.log(`\n 【debug】=============== 这是 ${e} 请求 url ===============`);
                    $.log(JSON.stringify(t));
                }
                await $.wait(t.timeout);
                await axios.post(t.url, t.body, {
                    headers: t.headers
                }).then(function(response) {
                    try {
                        if (debug) {
                            $.log(`\n 【debug】=============== 这是 ${e} 返回 data ===============`);
                            $.log(JSON.stringify(response.data));
                        }
                    } catch (e) {}
                    if ($.safeGet(response.data)) {
                        re = JSON.parse(response.data);
                        resolve(re);
                    } else if ($.isobject(response.data)) {
                        resolve(response.data);
                    } else {
                        resolve(response.data);
                    }
                }).catch(function(error) {
                    console.log("发现错误:",error.message)
                    resolve(errinfo);
                })
            })
        }
        delete(t, e) {
            const axios = require("axios");
            return new Promise(async (resolve) => {
                if (debug) {
                    $.log(`\n 【debug】=============== 这是 ${e} 请求 url ===============`);
                    $.log(t.url);
                }
                await $.wait(t.timeout);
                await axios.delete(t.url, {
                    headers: t.headers
                }).then(function(response) {
                    try {
                        if (debug) {
                            $.log(`\n 【debug】=============== 这是 ${e} 返回 data ===============`);
                            $.log(JSON.stringify(response.data));
                        }
                    } catch (e) {}
                    if ($.safeGet(response.data)) {
                        re = JSON.parse(response.data);
                        resolve(re);
                    } else if ($.isobject(response.data)) {
                        resolve(response.data);
                    } else {
                        resolve(response.data);
                    }
                }).catch(function(error) {
                    resolve(errinfo);
                })
            })
        }
        put(t, e) {
            const axios = require("axios");
            return new Promise(async (resolve) => {
                if (debug) {
                    $.log(`\n 【debug】=============== 这是 ${e} 请求 url ===============`);
                    $.log(t.url);
                }
                await $.wait(t.timeout);
                await axios.put(t.url, t.body, {
                    headers: t.headers
                }).then(function(response) {
                    try {
                        if (debug) {
                            $.log(`\n 【debug】=============== 这是 ${e} 返回 data ===============`);
                            $.log(JSON.stringify(response.data));
                        }
                    } catch (e) {}
                    if ($.safeGet(response.data)) {
                        re = JSON.parse(response.data);
                        resolve(re);
                    } else if ($.isobject(response.data)) {
                        resolve(response.data);
                    } else {
                        resolve(response.data);
                    }
                }).catch(function(error) {
                    resolve(errinfo);
                })
            })
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator));
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t));
        }
        md5(t) {
            const crypto = require("crypto");
            return crypto.createHash('md5').update(t).digest('hex').toLowerCase();
        }
        sha1(t) {
            const crypto = require("crypto");
            return crypto.createHash('sha1').update(t).digest('hex').toLowerCase();
        }
        sha256(t) {
            const crypto = require("crypto");
            return crypto.createHash('sha256').update(t).digest('hex').toLowerCase();
        }
        dottedLine(t) {
            msg += `\n========= ${t} =========\n`;
            console.log(`\n========= ${t} =========\n`);
        }
        AesEncrypt(key, iv, data) {
            const crypto = require("crypto");
            var clearEncoding = 'utf8';
            var cipherEncoding = 'base64';
            var cipherChunks = [];
            var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
            cipher.setAutoPadding(true);

            cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
            cipherChunks.push(cipher.final(cipherEncoding));

            return cipherChunks.join('');
        }
        getCks(t, e) {
            return new Promise((resolve, reject) => {
                let ckArr = [];
                if (t) {
                    if (t.indexOf("\n") != -1) {
                        t.split("\n").forEach((item) => {
                            ckArr.push(item);
                        });
                    } else {
                        ckArr.push(t);
                    }
                    resolve(ckArr);
                } else {
                    console.log(`\n 【${title}】：未填写变量 ${e}`);
                }
            })
        }
        debugLog(t) {
            if (debug) {
                console.log(t);
            }
        }
        safeGet(t) {
            if (typeof t == 'string') {
                try {
                    var obj = JSON.parse(t);
                    if (typeof obj == 'object' && obj) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            }
        }
        isobject(t) {
            if (typeof t == 'object') {
                return true;
            }
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log()
        }
    }(t, e)
}
