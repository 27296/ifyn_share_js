"nodejs";

const title = "捷途"
const $ = new Env(title);
msg = ""
var errinfo = {
    resultCode: -1
}
const debug = 0 //0为关闭调试，1为打开调试,默认为0
let path = "JT_DATA";
let ckStr = process.env[path];
let version = 0.1




//账号@密码   如果有微信  则  账户@密码@微信tokken



const headers = {
    "Host": "app.jetour.com.cn",
    "accept-language": "zh-cn",
    "agent": "Jetour/2.9.0 Dalvik/2.1.0 (Linux; U; Android 10; IN2020 Build/QKQ1.191222.002)",
    "sign": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTk5Nzc0MzQsInVzZXIiOiJ7XCJwaG9uZVwiOlwiMTc2MDg1NDcwMzJcIixcInVzZXJJZFwiOlwiNDg1ZmU2MTZkY2IzNDdlNGFjZDBlN2VmOTNlZjNmY2FcIixcInVzZXJuYW1lXCI6XCLosKLnibnniblcIn0iLCJ1c2VyX25hbWUiOiLosKLnibnnibkiLCJqdGkiOiJlOGY4MjdlOC1lNDMxLTRkYzYtYTczZi04MjZjOGZmNjcxYmEiLCJjbGllbnRfaWQiOiJhbmRyb2lkIiwic2NvcGUiOlsiYWxsIl19.ZMOZUm7R_NAP_y4Uh0NMJe5fbbmr_NZDVP_-iVI4sx8",
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": "okhttp/3.14.7",
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
    $.dottedLine("登录")
    var time = new Date().getTime();
    var 明文 = `cfc653b2a176349f${pwd}${myaccount}94c8f8cd7196dee00e7e531ddd86c757${time}`
    var sign = await $.sha256(明文);
    headers.sign = sign;
    var data = `username=${myaccount}&password=${pwd}&did=cfc653b2a176349f`
    let url = {
        url: `https://app.jetour.com.cn/jaccount/login?timestamp=${time}`,
        headers: headers,
        body: data,
        timeout: 5 * 1000
    }
    let 登录 = await $.post(url, `登录`)
    if ($.safeGet(登录) || $.isobject(登录)) {
        delete headers.sign;
        headers.token = 登录.token;
        msg += "🔔登录:成功" + "    \n\n";
        console.log("🔔登录:成功");
        await start()
    } else {
        console.log("🔔" + JSON.stringify(登录))
    }
}



async function signin() {

    let url = {
        url: "https://app.jetour.com.cn/api/user/checkin",
        headers: headers,
        body: "",
        timeout: 5 * 1000
    }
    let sign = await $.post(url, `签到`)
    if (sign.resultCode != -1) {
        msg += "🔔签到成功:" + sign.credit + "    \n\n";
        console.log("🔔签到成功:", sign.credit)
    } else {
        msg += "🔔签到失败:" + sign + "    \n\n";

        console.log("🔔签到失败:", sign)

    }

}




async function share() {
    delete headers.sign;
    let url = {
        url: "https://app.jetour.com.cn/api/posts/news?lastPostId=&size=20&type=2",
        headers: headers,
        timeout: 5 * 1000
    }
    let 列表 = await $.get(url, `列表`)
    if ($.safeGet(列表) || $.isobject(列表)) {
        for (var i = 0; i < 5; i++) {
            await 分享(列表[i].id);
            await detail(列表[i].id);
            await reply(列表[i].id)
            await 浏览(列表[i].id);
        }
    }
}





async function 分享(postid) {

    let url = {
        url: `https://app.jetour.com.cn/api/posts/${postid}/share`,
        headers: headers,
        timeout: 5 * 1000
    }
    let 提交 = await $.get(url, `分享`)
    if ($.safeGet(提交) || $.isobject(提交)) {
        msg += "🔔分享:" + 提交.title + "    \n\n";

        console.log("🔔分享:", 提交.title)
    } else {
        msg += "🔔分享:" + 提交 + "    \n\n";

        console.log("分享", 提交)

    }
}


async function 浏览(postid) {

    let url = {
        url: "https://app.jetour.com.cn/api/credit/browseAddCredit",
        headers: headers,
        body: `postId=${postid}`,
        timeout: 5 * 1000
    }
    let 提交 = await $.put(url, `浏览`)
    msg += "🔔浏览:成功" +"    \n\n";

    console.log("🔔浏览:成功", 提交)

}




async function detail(postid) {
    let url = {
        url: `https://app.jetour.com.cn/api/posts/${postid}/detail`,
        headers: headers,
        timeout: 1 * 1000
    }
    let 积分 = await $.get(url, "积分")

}



async function reply(postid) {
    let url = {
        url: `https://app.jetour.com.cn/api/posts/${postid}/replies/page?replyId=0&size=20`,
        headers: headers,
        timeout: 1 * 1000
    }
    let 积分 = await $.get(url, "积分")

}



async function integral() {

    let url = {
        url: "https://app.jetour.com.cn/api/user/creditV2",
        headers: headers,
        timeout: 5 * 1000
    }
    let 积分 = await $.get(url, "积分")

    if ($.safeGet(积分) || $.isobject(积分)) {
        msg += "🔔总积分:" + 积分.credit + "    \n\n";
        console.log("🔔总积分:", 积分.credit)
    }
}






////固定代码==================================================================================



async function wyy() {
    let url = {
        url: `https://keai.icu/apiwyy/api`,
        timeout: 5 * 1000
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
                    $.log(t.url);
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
