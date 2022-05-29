const title = "奇瑞新能源"
const $ = new Env(title);
msg = ""
var errinfo = {
    resultCode: -1
}
const debug = 0 //0为关闭调试，1为打开调试,默认为0
let path = "QRXNY_DATA";
let ckStr = process.env[path];
let version = 0.1



//请求头
const headers = {
    "App-Id": "chery_ev_app",
    "User-Agent": "version=1.0.8 systemName=Android buildVersion=297 systemVersion=10 model=Android Phone modelName=OnePlus",
    "Authorization": "",
    "Content-Type": "application/json; charset=UTF-8",
    "Host": "qrappser.cheryev.cn",
    "Connection": "Keep-Alive"
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
        await login(myaccount, pwd)


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
    hours = new Date().getHours()
    if (hours <= 12) {
        $.dottedLine("签到")
        await signin();
    } else {
        $.dottedLine("下午时间不签到,请安排上午")
    }
    $.dottedLine("分享")
    await share();
    if (hours <= 12) {
        $.dottedLine("积分")
        await integral();
    }
}





async function login(myaccount, pwd) {
    $.dottedLine("登录")
    delete headers.Authorization;
    var data = {
        "account": myaccount,
        "password": pwd
    }
    let url = {
        url: "https://qrappser.cheryev.cn/cheryev/crm/user/login",
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let 登录 = await $.post(url, `登录`)
    if (登录.resultCode == 0) {
        msg += "🔔登录:成功" + "    \n\n";
        console.log("🔔登录:成功");
        userid = 登录.data.user.userId;
        headers.Authorization = "Bearer " + 登录.data.token.accessToken;
        await start()
    } else {
        console.log("🔔" + 登录.data)
    }
}



async function signin() {
    var data = {
        "userId": `${userid}`
    }
    let url = {
        url: "https://qrappser.cheryev.cn/cheryev/crm/user/checkin",
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let sign = await $.post(url, `签到`)

    if (sign.resultCode == 0) {
        msg += "🔔签到:" + sign.resultMsg + "    \n\n";
        console.log("🔔签到:", sign.resultMsg)
    } else {
        msg += "🔔签到:" + sign.resultMsg + "    \n\n";

        console.log("🔔签到:", sign.resultMsg)

    }

}




async function share() {

    var data = {
        "size": "10",
        "lastPostId": "-1",
        "updateTime": "0",
        "type": "1"
    }
    let url = {
        url: "https://qrappser.cheryev.cn/cheryev/content/post/api/v1/postList/query",
        headers: headers,
        body: JSON.stringify(data),
        timeout: 5 * 1000
    }
    let 列表 = await $.post(url, `列表`)
    if (列表.resultCode == 0) {
        for (var i = 0; i < 2; i++) {
            await 分享(列表.data[i].postId);

        }
    }
}





async function 分享(postid) {

    let url = {
        url: "https://qrappser.cheryev.cn/cheryev/content/post/api/v1/post/" + postid + "/share",
        headers: headers,
        body: "{}",
        timeout: 5 * 1000,
    }
    let 提交 = await $.post(url, `分享`)
    if (提交.resultCode == 0) {
        msg += "🔔分享:" + 提交.resultMsg + "    \n\n";

        console.log("🔔分享:", 提交.resultMsg)
    } else {
        msg += "🔔分享:" + 提交.resultMsg + "    \n\n";

        console.log("分享", 提交.resultMsg)

    }
}




async function integral() {

    let url = {
        url: `https://qrappser.cheryev.cn/cheryev/crm/user/profile/${userid}`,
        headers: headers,
        body: "{}",
        timeout: 5 * 1000
    }
    let 积分 = await $.post(url, "积分")

    if (积分.resultCode == 0) {
        msg += "🔔总积分:" + 积分.data.totalPoints + "    \n\n";
        console.log("🔔总积分:", 积分.data.totalPoints)
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
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log()
        }
    }(t, e)
}
