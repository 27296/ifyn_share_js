"nodejs";

const title = "广汽传祺"
const $ = new Env(title);
const debug = 0 //0为关闭调试，1为打开调试,默认为0
//////////////////////
let ckStr = process.env.GQCQ_DATA;
let msg = "";
let ck = "";
/////////////////////////////////////////////////////////
const crypto = require("crypto");

module.exports = {
    md5: (str) => {
        return crypto.createHash('md5').update(str).digest('hex').toLowerCase();
    },
    sha1: (str) => {
        return crypto.createHash('sha1').update(str).digest('hex').toLowerCase();
    }
};





async function tips(ckArr) {
    console.log(`\n版本: 0.1 -- 22/5/2`);
    // console.log(`\n 脚本已恢复正常状态,请及时更新! `);
    // msg += `\n 脚本已恢复正常状态,请及时更新! `

    console.log(`\n脚本测试中,有bug及时反馈! \n`);
    msg += `\n脚本测试中,有bug及时反馈! \n`

    console.log(`\n================================================\n脚本执行 - 北京时间(UTC+8): ${new Date(
		new Date().getTime() +
		new Date().getTimezoneOffset() * 60 * 1000 +
		8 * 60 * 60 * 1000
	).toLocaleString()} \n================================================\n`);

    await wyy();

    console.log(`\n============== 共找到 ${ckArr.length} 个账号 ==============\n`);
    debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);
}

!(async () => {
    let ckArr = await getCks(ckStr, "GQCQ_DATA");

    await tips(ckArr);

    for (let index = 0; index < ckArr.length; index++) {
        let num = index + 1;
        console.log(`\n========= 开始【第 ${num} 个账号】=========\n`);
        headers = {
            "token": "",
            "channel": "unknown",
            "platformNo": "Android",
            "osVersion": "12",
            "version": "3.5.1",
            "imei": "",
            "imsi": "",
            "deviceModel": "",
            "deviceType": "Android",
            "registrationID": "",
            "verification": "signature",
            "reqTs": "",
            "reqNonc": "",
            "reqSign": "",
            "Host": "gsp.gacmotor.com",
            "Connection": "Keep-Alive",
            "User-Agent": "okhttp/3.10.0",
            "Accept-Encoding": "gzip",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        myaccount = ckArr[index].split("@")[0];
        pwd = ckArr[index].split("@")[1];
        headers.token = pwd;
        msg += `账号[${num}]: ${myaccount}` + "\n"
        debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${myaccount}`);
        await tasklist();


    }
    PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN;
    if (PLUS_TOKEN != "") {
        pushplus(title, PLUS_TOKEN, msg)
    } else {
        console.log("🔔默认用pushplus推送,请在配置文件里填写")


    }

})()
.catch((e) => $.logErr(e))
    .finally(() => $.done());





async function encrypt() {
    headers.reqNonc = randomString_(6);
    headers.reqTs = new Date().getTime();
    var reqSign明文 = "signature" + headers.reqNonc + headers.reqTs + "17aaf8118ffb270b766c6d6774317a133.5.1";
    headers.reqSign = module.exports.md5(reqSign明文);
    headers.imei = 86 + randomString_(13);
    headers.imsi = randomString_(15);
    headers.deviceModel = "A" + randomString_(4) + "M";
    headers.registrationID = randomString(32);

}



async function signin() {
    let url = {
        url: "https://gsp.gacmotor.com/gateway/app-api/sign/submit",
        headers: headers,
    }
    await encrypt()
    let ret = await httpGet(url, `签到`, 5 * 1000)
        .then(response => {
            if (response.errorCode == 200) {
                msg += "🔔签到成功" + response.data.operationValue + "    \n\n";
                console.log("🔔签到成功:", response.data.operationValue)
            } else {
                console.log(response.errorMessage);
            }
        })
        .catch(error => {
            console.log(error);
        })
    await $.wait(5 * 1000);
}


async function comment(postId) {
    let url = {
        url: "https://gsp.gacmotor.com/gw/app/community/api/comment/add",
        headers: headers,
        body:"commentType=0&postId=" + postId + "&commentContent="+getQuote()+"&commentId=0&commentatorId=MTU4MzYyNQ%3D%3D&isReplyComment=1"
    }
    await encrypt()
    let ret = await httpPost(url, `评论`, 10 * 1000)
        .then(response => {
            if (response.errorCode == 20000) {
                msg += "🔔评论成功" + "    \n\n";
                console.log("🔔评论成功")
            } else {

                console.log(response);
            }
        })
        .catch(error => {
            console.log(error);
        })
    await $.wait(20 * 1000);
}



async function Forward(postId) {
    
    let url = {
        url: "https://gsp.gacmotor.com/gw/app/community/api/post/forward",
        headers: headers,
        body:"postId="+postId+"&userId="
    }
    await encrypt()
    let ret = await httpPost(url, `转发`, 10 * 1000)
        .then(response => {
            if (response.errorCode == 20000) {
                msg += "🔔转发成功" + "    \n\n";
                console.log("🔔转发成功")
            } else {
                console.log(response);
            }
        })
        .catch(error => {
            console.log(error);
        })
    await $.wait(10 * 1000);
}


async function tasklist() {
    msg += `\n========= 查询任务 =========\n`;
    console.log(`\n========= 查询任务 =========\n`);

    let url = {
        url: "https://gsp.gacmotor.com/gw/app/community/api/mission/getlistv1?place=1",
        headers: headers,
        body: ""
    }
    await encrypt()
    let task = await httpPost(url, `任务列表`, 10 * 1000)
    if (task.errorCode == 20000) {
        msg += "🔔查询成功:任务数量 " + task.data.length + "    \n\n";
        console.log("🔔查询成功:", "任务数量", task.data.length);
        for (ee = 0; ee < task.data.length; ee++) {
            var finishedNum = task.data[ee].finishedNum;
            var total = task.data[ee].total;
            if (total - finishedNum != 0) {
                switch (ee) {
                    case 0:
                        msg += `\n========= 签到 =========\n`;
                        console.log(`\n========= 签到 =========\n`);

                        await signin();
                        break;
                    case 1:
                        msg += `\n========= 发帖 =========\n`
                        console.log(`\n========= 发帖 =========\n`);

                        for (tt = 0; tt < 2; tt++) {
                            await post(encodeURIComponent(randomString发帖(40)))
                        }
                        break;
                    case 2:
                        msg += `\n========= 评论 =========\n`
                        console.log(`\n========= 评论 =========\n`);

                        await Commentlist()
                        break;
                    case 3:
                        msg += `\n========= 转发 =========\n`
                        console.log(`\n========= 转发 =========\n`);

                        await Forwardlist()
                        break;

                }
            } else {
                switch (ee) {
                    case 0:
                        msg += `\n========= 签到 =========\n`;
                        console.log(`\n========= 签到 =========\n`);

                        msg += "🔔签到已完成" + "    \n\n";
                        console.log("🔔签到已完成")
                        await $.wait(2 * 1000)
                        break;
                    case 1:
                        msg += `\n========= 发帖 =========\n`;
                        console.log(`\n========= 发帖 =========\n`);

                        msg += "🔔发帖已完成" + "    \n\n";
                        console.log("🔔发帖已完成")
                        await $.wait(2 * 1000)

                        break;
                    case 2:
                        msg += `\n========= 评论 =========\n`;
                        console.log(`\n========= 评论 =========\n`);

                        msg += "🔔评论已完成" + "    \n\n";
                        console.log("🔔评论已完成")
                        await $.wait(2 * 1000)

                        break;
                    case 3:
                        msg += `\n========= 转发 =========\n`;
                        console.log(`\n========= 转发 =========\n`);

                        msg += "🔔转发已完成" + "    \n\n";
                        console.log("🔔转发已完成")
                        await $.wait(2 * 1000)

                        break;

                }
            }
        }
        msg += `\n========= 积分 =========\n`;
                        console.log(`\n========= 积分 =========\n`);
                       
        await integral();
    } else {
        msg += "🔔数据已失效" + "    \n\n";
        console.log(task, "🔔数据已失效，请重新登录")
    }
}



async function integral() {
    let url = {
        url: "https://gsp.gacmotor.com/gateway/app-api/my/statsV3",
        headers: headers
    }
    await encrypt()
    let 积分 = await httpPost(url, `积分`, 10 * 1000)
    if (积分.errorCode == 200) {
        msg += "🔔总积分:" + 积分.data.pointCount + "    \n\n";
        console.log("🔔总积分:", 积分.data.pointCount)
    }
}



async function Delete(postId) {
    let url = {
        url: "https://gsp.gacmotor.com/gw/app/community/api/post/delete?postId=" + postId,
        headers: headers,
        body: ""
    }
    await encrypt()
    let ret = await httpPost(url, `删除`, 10 * 1000)
        .then(response => {
            if (response.errorCode == 20000) {
                  msg += "🔔删帖完成" + "    \n\n";
                 console.log("🔔删帖成功")
            } else {
                console.log(response.errorMessage);
            }
        })
        .catch(error => {
            console.log(error);
        })

    await $.wait(70 * 1000);
}



async function post(内容) {
    let url = {
        url: "https://gsp.gacmotor.com/gw/app/community/api/topic/appsavepost",
        headers: headers,
        body:'postId=&postType=2&columnId=&postContent=%5B%7B%22text%22%3A%22' + 内容 + '%22%7D%5D&coverImg=https%3A%2F%2Fpic-gsp.gacmotor.com%2Fapp%2F69a7a6aa-a664-426a-b98d-ff27d28f7187.png&publishedTime=&contentWords=' + 内容 + '&contentImgNums=1&lng=&lat=&address=&cityId='
    }
    await encrypt()
    let post = await httpPost(url, `发帖`, 10 * 1000)
    if (post.errorCode == 20000) {
        msg += "🔔发帖成功" + "    \n\n";
        console.log("🔔发帖成功");
        var postId = post.data.postId;
        await $.wait(30 * 1000);
        await Delete(postId);
    } else {
        console.log(post);

    }
}


async function Commentlist() {
    let url = {
        url: "https://gsp.gacmotor.com/gw/app/community/api/post/appdigestlist",
        headers: headers,
    }
    await encrypt()
    let list = await httpGet(url, `列表`, 10 * 1000)
    if (list.errorCode == 20000)
        for (var a = 0; a < 2; a++) {
            var postId = list.data[a].postId;
            await comment(postId);
        }
    else console.log(list.errorMessage)

}


async function Forwardlist() {
    let url = {
        url: "https://gsp.gacmotor.com/gw/app/community/api/post/appdigestlist",
        headers: headers,
    }
    await encrypt()
    let list = await httpGet(url, `列表`, 10 * 1000)
    if (list.errorCode == 20000)
        for (var a = 0; a < 2; a++) {
            var postId = list.data[a].postId
            await Forward(postId);
        }
    else console.log(list.errorMessage)

}



function getQuote() {
    var quoteArr = [
        '666666',
        '加油赚钱！买车',
        '买车还得是广汽',
        '哦耶耶,在线打卡',
        '兄弟们,早上好',
        '听我说,谢谢你',
        '我觉得挺好',
        '唉,说多都是泪',
        '空即是色,色即是空',
        '每天无聊得只能来完成各种任务',
        '其实大家都这样',
        '没事吧,我觉得还不错',
        '理解万岁啊',
        '忙忙碌碌又是一天',
        '每天早上都有我的身影',
        '想不到吧哈哈',
        '有你的地方就有我',
        '悄悄的来看望你',
        '悄悄的来,不带走一片云彩',
        '何处相思明月楼,唉',
        '只能这么说了',
        '努力努力努力再努力',
        '每天夜班,只为换车',
        '看得出来大家都挺有钱',
        '每天上班都好累啊',
        '愿逐月华流照君',
        '鸿雁长飞光不度',
        '鱼龙潜跃水成文',
        '昨夜闲潭梦落花',
        '可怜春半不还家',
        '江水流春去欲尽',
        '江潭落月复西斜',
        '斜月沉沉藏海雾',
        '碣石潇湘无限路',
        '不知乘月几人归',
        '落月摇情满江树'
    ] // 可以通过改变数组内容 对名言或诗词进行增删
    return quoteArr[Math.floor(Math.random() * quoteArr.length)] // 数组中随机取一个元素
}






//#region 固定代码
// ============================================变量检查============================================ \\

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
            console.log(`\n 【${$.name}】：未填写变量 ${str}`)
        }

    })
}

// ============================================发送消息============================================ \\
function randomString_(e) {
    e = e || 32;
    var t = "0123456789",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function randomString发帖(e) {
    e = e || 32;
    var t = "每一个人缘分不同相爱的时间也有长短只有尽心尽力去做我能够做到的就是我会让我的爱陪你慢慢的老去,人生旅途中大家都在忙着认识各种人遇见了形形色色的人之后你才知道原来世界上除了父母不会有人掏心掏肺对你不会有人无条件完全信任你也不会有人一直对你好你早该明白天会黑人会变人生那么长路那么远你只能靠自己别无他选以为这是在丰富生命可最有价值的遇见是在某一瞬间重遇了自己那一刻你才会懂走遍世界也不过是为了找到一条走回内心的路越是在遥远的地方你的样子就更清晰越是在寒冷的时候你的笑容就更温暖越是在失落的时候你的话语就更坚定越是无言的时候我的思念其实更多！",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
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

function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

//每日网抑云
function wyy(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://keai.icu/apiwyy/api`
        }
        $.get(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data)
                console.log(`\n 【网抑云时间】: ${data.content}  by--${data.music}`);
                msg += `\n 【网抑云时间】: ${data.content}  by--${data.music}\n`

            } catch(e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}
// ============================================ get请求 ============================================ \\
async function httpGet(getUrlObject, tip, timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = getUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(
                `\n 【debug】=============== 这是 ${tip} 请求 url ===============`
            );
            console.log(url);
        }

        $.get(
            url,
            async (error, response, _data) => {
                try {
                    if (debug) {
                        console.log(
                            `\n\n 【debug】===============这是 ${tip} 返回data==============`
                        );
                        console.log(_data);
                        console.log(`======`);
                        console.log(JSON.parse(_data));
                    }
                    let result = JSON.parse(_data);
                    resolve(result);
                } catch(e) {
                    console.log(e);
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

// ============================================ post请求 ============================================ \\
async function httpPost(postUrlObject, tip, timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = postUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(
                `\n 【debug】=============== 这是 ${tip} 请求 url ===============`
            );
            console.log(url);
        }

        $.post(
            url,
            async (error, response, data) => {
                try {
                    if (debug) {
                        console.log(
                            `\n\n 【debug】===============这是 ${tip} 返回data==============`
                        );
                        console.log(data);
                        console.log(`======`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    resolve(result);
                } catch(e) {
                    console.log(e);
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

// ============================================ debug调试 ============================================ \\
function debugLog(...args) {
    if (debug) {
        console.log(...args);
    }
}
////------------------------------------------------执行

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
                body: JSON.stringify(data)
            }
            let res = await httpPost(url, `发送`, 3 * 1000);



            if (res.code == 200) {
                console.log("pushplus:发送成功");
            } else {
                console.log("pushplus:发送失败");
                console.log(res.msg);
            }
        } catch(err) {
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
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch(error){
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch(error){
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch(error){}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch(error){
                return !1
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch(t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch(t) {
                    e = ""
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch(e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch(t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            }))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
