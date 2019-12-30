$('#textarea_id')


.typetype("想给你这封信很久了.", {
        callback: function() {

        }
    }).typetype("\n\n坐在电脑面前想了许久，写了许多字", {
        callback: function() {

        }
    }).typetype("\n反复斟酌", {
        callback: function() {

        }
    }).typetype("\n只希望你看到这封信的时候不会尴尬", {
        callback: function() {

        }
    }).typetype("\n也希望这封信是一种愉悦的语气进行述说", {
        callback: function() {

        }
    }).typetype("\n因为每日写这封信的心情不一", {
        callback: function() {

        }
    }).typetype("\n在办公室远远看到你第一眼时，便希望落座于我边上", {
        callback: function() {

        }
    }).typetype("\n果不其然，内心狂喜，但不能显露于形", {
        callback: function() {

        }
    }).typetype(`\n另外加微信也是我内心经过设定的
\n其实那份需求文档已经没用
\n可能我是个心机boy
\n应该说就是
\n……
\n对……`, {
        callback: function() {

        }
    }).typetype(`\n与你相识之后
\n自己愈发地像一只孔雀\n每天极力的想表现出最好的自己\n但是与此同时\n这夸张了我的一方面\n你所见到的可能是我所想表现出来的一面\n期间也不断认识到自我\n这也是我写信的缘由\n可以客观的坦白自己\n神父我有罪……`, {
        callback: function() {

        }
    }).typetype(`\n之后\n我展现出了热情的一面\n不知是否因此而吓到你\n我便学着你的方式与你相处\n直到现在
`, {
        callback: function() {

        }
    }).typetype(`
\n从前认为\n喜欢就应该是像太阳\n热烈而勇敢\n现在觉得\n喜欢也可以是森林中藏在树后的草梗\n即使被遮挡了光\n也存于世`, {
        callback: function() {

        }
    }).typetype(`\n另外一直很想告诉你\n你属于我从小喜欢的类型\n接触久了之后我才发现`, {
        callback: function() {

        }
    }).typetype(`
\n看了一部好电影\n听到一首好听的乐曲\n想分享与你\n但却怕尴尬、怕打扰\n继而如此
`, {
        callback: function() {

        }
    }).typetype(`
\n上次想跟你说的事\n……\n话到嘴边\n终究咽了下去\n我脑海中一直浮现着那句\n这段关系你想多久就保持多久\n虽然你两个星期后便反悔了……\n当时有种:\n我欲与君相知，长命无绝衰\n有点像是……em……\n紫薇！你在哪！（尔康鼻孔.jpg）\nHahahahaha`, {
        callback: function() {

        }
    }).typetype(`

\n这段话又是隔了几个星期才写下\n说到底还是想说\n我即将经历一场所没有经历过的事——婚礼\n即使我知道接下来的生活可能会后悔\n最终还是没能让自己更自私些`, {
        callback: function() {

        }
    }).typetype(`
\n要是早点认识\n该有多好
`, {
        callback: function() {

        }
    }).typetype(`

\n现在是12 / 29号\n昨天有点想去找你\n谢谢围巾呀\n冬天很暖和\n就差了点阳光`, {
        callback: function() {

        }
    })
    .typetype("\n另外真的好喜欢你！", {
        t: 200,
        e: 0.2, // the default error rate is 0.04
    })
    .delay(3000)
    .backspace(8, {
        t: 500, // 删除间隔时间 （毫秒）
        keypress: function() {},
        callback: function() {

        }
    })



var timer = setInterval(() => {
    $('#textarea_id').scrollTop($('#textarea_id')[0].scrollHeight);
}, 1000);
setTimeout(() => {
    clearInterval(timer)
}, 180 * 1000);

function music() {
    var Audio = document.getElementsByTagName("audio")[0];

    Audio.addEventListener("ended", function(event) {}, false);

    // 兼容 ios系统 微信
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        Audio.play();

    } else {
        /*监听客户端抛事件 WeixinJSBridgeReady*/
        if (document.addEventListener) {

            document.addEventListener("WeixinJSBridgeReady", function() {
                Audio.play();
            }, false);
        } else if (document.attachEvent) {

            document.attachEvent("WeixinJSBridgeReady", function() {
                Audio.play();

            });

            document.attachEvent("onWeixinJSBridgeReady", function() {

                Audio.play();

            });

        }

    }

    // 兼容safari
    var voiceStatu = true;
    document.addEventListener("touchstart", function(e) {
        if (voiceStatu) {
            Audio.play();
            voiceStatu = false;
        }
    }, false);
}
music()