"nodejs";

const title = "捷途"
const $ = new Env(title);
msg = "";
var errinfo = {
    resultCode: -1
}
const debug = 0 //0为关闭调试，1为打开调试,默认为0
let path = "JT_DATA";
let ckStr = process.env[path];

let version = 0.1






//账号@密码   如果有微信  则  账户@密码@微信tokken



const headers = {
    "user-agent": "Dart/2.15 (dart:io)",
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "host": "uaa-consumer.jetour.com.cn",
    "content-type": "application/json; charset=UTF-8",
    "agent": "android",
}




const headers2 = {
    "Host": "shop.jetour.com.cn",
    "Connection": "keep-alive",
    "charset": "utf-8",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; OPPO R9s Plus Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36",
    "content-type": "application/json",
    "token": "",
    "Referer": "https://servicewechat.com/wx31f7e5e3081d6927/66/page-frame.html",
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
        wxtoken = ckArr[index].split("@")[2];
        msg += `\n🔔账号[${num}]: ${myaccount}\n`
        $.debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${myaccount}`);
        await login(myaccount, pwd);


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
    headers.host="mobile-consumer.jetour.com.cn"
    $.dottedLine("签到")
    await signin();
    if (wxtoken) {
        $.dottedLine("微信签到")
        headers2.token = wxtoken;
        await wxsignin()
    } else {
        $.dottedLine("微信签到")
        console.log("🔔该帐号未设置微信token")
    }
    $.dottedLine("分享")
    await share();
    $.dottedLine("浏览")
    await view();
    await view2();
    $.dottedLine("积分")
    await integral();
}





async function wxsignin() {
    let url = {
        url: "https://shop.jetour.com.cn/wxapi/app/customer/signIn",
        headers: headers2,
        timeout: 5 * 1000
    }
    let sign = await $.get(url, `签到`)
    if (sign.code == 0) {
        msg += "🔔微信签到:成功" + "    \n\n";
        console.log("🔔微信签到:成功");
    }
}









async function login(myaccount, pwd) {
    headers.host="uaa-consumer.jetour.com.cn";
    $.dottedLine("登录")
    data = {
        "algorithm": "aes",
        "username": myaccount,
        "terminal": 3
    }
    let url = {
        url: `https://uaa-consumer.jetour.com.cn/api/v1/common/secret?access_token=&terminal=3`,
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let 登录 = await $.post(url, `登录`)
    if (登录.status == 200) {
        key = 登录.data.random;
        iv = 登录.data.iv;
        userid = 登录.data.openId;
        pwd = $.AesEncrypt(key, iv, pwd + "|" + key)
        await Login(myaccount, pwd)
    }
}




async function Login(a, b) {
    data = {
        "username": a,
        "password": b,
        "client_id": "bigapp",
        "source": 2,
        "terminal": 3
    }
    let url = {
        url: 'https://uaa-consumer.jetour.com.cn/api/v1/uaa/mobile/token/secret?access_token=&terminal=3',
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let 登录 = await $.post(url, `登录`)
    if (登录.status == 200) {
        msg += "🔔登录:成功" + "    \n\n";
        console.log("🔔登录:成功");
        accessToken = 登录.data.accessToken;
        userid = 登录.data.openId;
        await start()
    } else {
        console.log(登录)
    }
}


async function share() {
    data = {
        "eventCode": "SJ50005",
        "properties": {
            "share_user_id": userid,
            "share_user_name": "",
            "share_time": new Date().getTime(),
            "share_content_type": "动态",
            "share_channel": "微信好友"
        },
        "terminal": 3
    }
    let url = {
        url: "https://mobile-consumer.jetour.com.cn/web/event/event-instances?access_token=" + accessToken + "&terminal=3",
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let 分享 = await $.post(url, `分享`)
    if (分享.status == 200) {
        msg += "🔔分享:成功" + "    \n\n";
        console.log("🔔分享:成功");
    } else {
        console.log(分享)
    }
    let 分享2 = await $.post(url, `分享`)
    if (分享2.status == 200) {
        msg += "🔔分享:成功" + "    \n\n";
        console.log("🔔分享:成功");
    } else {
        console.log(分享2)
    }
}




async function view() {
    data = {
        "eventCode": "SJ50006",
        "properties": {
            "content_user_id": "1525576219696824320",
            "content_user_name": "捷途就是牛",
            "content_id": "2313440565842174312",
            "content_title": "#节油达人#分享一下八大省油小技巧",
            "content_view_time": new Date().getTime(),
            "content_duration": 18
        },
        "terminal": 3
    }
    let url = {
        url: "https://mobile-consumer.jetour.com.cn/web/event/event-instances?access_token=" + accessToken + "&terminal=3",
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let 浏览 = await $.post(url, `浏览`)
    if (浏览.status == 200) {
        msg += "🔔浏览:成功" + "    \n\n";
        console.log("🔔浏览:成功");
    } else {
        console.log(浏览)
    }
}

async function view2() {
    data={
  "eventCode": "SJ50006",
  "properties": {
    "content_user_id": "3546969435531247662",
    "content_user_name": "牡丹配芍药",
    "content_id": "2313457264675020819",
    "content_title": "#你会出于什么原因购买大圣#捷途服务质量",
    "content_view_time":new Date().getTime(),
    "content_duration": 67
  },
  "terminal": 3
}
    let url = {
        url: "https://mobile-consumer.jetour.com.cn/web/event/event-instances?access_token=" + accessToken + "&terminal=3",
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let 浏览2 = await $.post(url, `浏览`)
    if (浏览2.status == 200) {
        msg += "🔔浏览:成功" + "    \n\n";
        console.log("🔔浏览:成功");
    } else {
        console.log(浏览2)
    }
}






async function signin() {
    let url = {
        url: "https://mobile-consumer.jetour.com.cn/web/task/tasks/event-start?access_token=" + accessToken,
        headers: headers,
        body: {
            "eventCode": "SJ50001"
        },
        timeout: 5 * 1000
    }
    let sign = await $.post(url, `签到`)
    if (sign.status == 200) {
        msg += "🔔签到成功" + "    \n\n";
        console.log("🔔签到成功")
    } else {
        msg += "🔔签到失败:" + sign + "    \n\n";

        console.log("🔔签到失败:", sign)

    }

}











async function integral() {

    let url = {
        url:"https://mobile-consumer.jetour.com.cn/web/point/consumer/detail?access_token="+accessToken,
        headers: headers,
        timeout: 5 * 1000
    }
    let 积分 = await $.get(url, "积分")

    if (积分.status==200) {
        msg += "🔔总积分:" + 积分.data.payableBalance + "    \n\n";
        console.log("🔔总积分:", 积分.data.payableBalance)
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
