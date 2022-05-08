"nodejs";
logs = "";
title = "bingo荟";
msg = ""
var crypto = require("crypto");
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let ckStr = process.env.BGH_DATA;
const debug = 0 //0为关闭调试，1为打开调试,默认为0
//////////////////////



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






async function tips(ckArr) {
    console.log(`【${title}】：开始运行`)
    console.log(`\n版本: 0.1 -- 22/5/2`);
    console.log(`\n脚本测试中,有bug及时反馈! \n`);
    msg += `\n脚本测试中,有bug及时反馈! \n`

    console.log(`\n================================================\n脚本执行 - 北京时间(UTC+8): ${new Date(
		new Date().getTime() +
		new Date().getTimezoneOffset() * 60 * 1000 +
		8 * 60 * 60 * 1000
	).toLocaleString()} \n================================================\n`);

    await wyy();
    console.log(`\n=================== 共找到 ${ckArr.length} 个账号 ===================`);
    debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);

}

!(async () => {
    let ckArr = await getCks(ckStr, "BGH_DATA");

    await tips(ckArr);

    for (let index = 0; index < ckArr.length; index++) {
        let num = index + 1;
        console.log(`\n========= 开始【第 ${num} 个账号】=========\n`);
        myaccount=ckArr[index].split("@")[0];
        authorization = ckArr[index].split("@")[1];
        clientauthorization = ckArr[index].split("@")[2];
        headers.authorization = authorization;
        headers.clientauthorization = clientauthorization;
        msg += `账号[${num}]: ${myaccount}` + "\n"
        debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${myaccount}`);
        await dotask();


    }
    PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN;
    if (PLUS_TOKEN != "") {
        pushplus(title, PLUS_TOKEN, msg)
    } else {
        console.log("🔔默认用pushplus推送,请在配置文件里填写")


    }

})()
.catch((e) => console.log(e))







async function dotask() {
    msg += `\n========= 签到 =========\n`
    console.log(`\n========= 签到 =========\n`);

    await signin();
    msg += `\n========= 积分 =========\n`
    console.log(`\n========= 积分 =========\n`);

    await integral();
}



async function signin() {
    let url = {
        method: "get",
        url: "https://mall.dchmotor.com.cn/service/markting/signin",
        headers: headers,
        timeout: 5 * 1000
    }
    await bzhttp(url)
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
        method: "get",
        url: "https://mall.dchmotor.com.cn/service/member/point/index",
        headers: headers,
        timeout: 5 * 1000
    }
    await bzhttp(url)
        .then(function(response) {
            if (response.success == 1) {
                msg += "🔔总积分:" + response.content.point + "\n"
                console.log("🔔总积分:", response.content.point);
            }
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })

}










////固定代码------------------------------------------------执行

function pushplus(title, token, msg) {
    return new Promise(async (resolve) => {
        try {
            let url = "http://www.pushplus.plus/send"
            let data = {
                "token": token,
                "title": title,
                "content": msg.replace(/\n/g, "<br>"),
                "temple": "html"
            }
            let res = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.code == 200) {
                console.log("pushplus:发送成功");
            } else {
                console.log("pushplus:发送失败");
                console.log(res.data.msg);
            }
        } catch (err) {
            console.log("pushplus酱：发送接口调用失败");
            console.log(err);
        }
        resolve();
    });
}








function bzhttp(url) {

    return new Promise(async (resolve) => {
        if (debug) {
            console.log(
                `\n 【debug】=============== 这是 ${url.method} 请求 url ===============`
            );
            console.log(url);
        }
        await sleep(url.timeout)
        try {
            axios = require("axios")
            var errinfo = {
                "success": -1
            }

            if (url.method == "get") res = await axios.get(url.url, {
                headers: url.headers
            })
            if (url.method == "post") res = await axios.post(url.url, url.body, {
                headers: url.headers
            })
            if (url.method == "delete") res = await axios.delete(url.url, {
                headers: url.headers
            })
            if (debug) {
                console.log(
                    `\n 【debug】=============== 这是 ${url.method} 返回 data ===============`
                );
                console.log(res.data);
            }
            if (safeGet(res.data)) {
                re = JSON.parse(res.data);
                console.log(re)
                resolve(re)
            } else {
                resolve(res.data)
            }
        } catch (e) {
            console.log(e)
            resolve(errinfo)
        }
    })
}



function safeGet(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
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


////------------------------------------------------


async function getCks(ck, str) {


    return new Promise((resolve, reject) => {

        let ckArr = []
        if (ck) {
            if (ck.indexOf("\n") != -1) {

                ck.split("\n").forEach((item) => {
                    ckArr.push(item);
                });
            } else {
                ckArr.push(ck);
            }
            resolve(ckArr)
        } else {
            console.log(`\n 【${title}】：未填写变量 ${str}`)
        }

    })
}


//每日网抑云
async function wyy() {
    let url = {
        method: "get",
        url: `https://keai.icu/apiwyy/api`,
        timeout: 10 * 1000,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        }

    }
    await bzhttp(url)
        .then(function(response) {
            data = response
            console.log(`\n 【网抑云时间】: ${data.content}  by--${data.music}`);
            msg += `\n 【网抑云时间】: ${data.content}  by--${data.music}\n`
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })

}

/**
 * 随机数生成
 */

function randomString(e) {
    e = e || 32;
    var t = "abcdef1234567890",
        a = t.length,
        n = "";

    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}

/**
 * 随机整数生成
 */

// ============================================ debug调试 ============================================ \\
function debugLog(...args) {
    if (debug) {
        console.log(...args);
    }
}
////------------------------------------------------执行
