var state = true;
// received : 收到
function received(msg) {
	if(msg == null || msg == undefined || msg == "") return;
	var pkg = JSON.parse(msg);
	if(pkg.ret) {
		console.log("------------------------------------------");
		// pkg.ptype =1001 说明是websocket连接成功，不保存；
		var interimid = JSON.parse(localStorage.getItem("interimID")).user_id;
		if(pkg.ptype != 1001) {
			var content = JSON.parse(pkg.content);
			console.log("content = " + JSON.stringify(content))
			var localObj = {
				id: content.id,
				title: content.title,
				content: content.reply?content.reply.content:"",
				reg_time: content.reply?content.reply.reg_time:content.reg_time
			}
			save_newChat(localObj);
		} else {
			// 保存一个空的对象
			if(!localStorage.getItem((getInterimID || interimid) + "-chatList")) {
				var localArr = [];
				var localObj = {};
				localArr.unshift(localObj);
				localStorage.setItem((getInterimID || interimid) + "-chatList", JSON.stringify(localArr));
			}
		}

		localStorage.setItem((getInterimID || interimid) + "-msg", msg);
		// 此处单独也是为了区分common.js里的监听storage事件，因为 监听storage操作不了当前的这个页面
		if(plus.os.name != "iOS") return;
		if(!state) return;
		state = false;
		var allw = plus.webview.all();
		var currentW = plus.webview.currentWebview();
		// 重写监听本地存储
		var orignalSetItem = localStorage.setItem;
		localStorage.setItem = function(key, newValue) {
			var setItemEvent = new Event("setItemEvent");
			setItemEvent.newValue = newValue;
			setItemEvent.key = key;
			window.dispatchEvent(setItemEvent);
			orignalSetItem.apply(this, arguments);
		}
		window.addEventListener("setItemEvent", function(e) {
			console.log("key = " + e.key)
			var pkg = JSON.parse(e.newValue);
			var topw = plus.webview.getTopWebview();
			mui.fire(topw, 'storage', {
				key: e.key
			});
		});
	}
}
var client_type = 1; //客户方app：1，渠道方app：2
function connect() {
	//将参数转换为Base64字符串
	var interim = JSON.parse(localStorage.getItem("interimID"));
	var clientid = plus.push.getClientInfo().clientid;
	var sign = window.btoa(client_type + "|" + interim.user_id + "|" + "869158020363665" + clientid);
	var wsoption = {
		path: mmschnwebsocket + sign,
		onmessage: function(msg) {
			received(msg);
		}
	}
	connectSocketServer(wsoption);
}
var ws = null;
var reconnect = "";

function connectSocketServer(option) {
	if(!option || !option.path || !option.onmessage) {
		console.log("ws: parameters error");
		return;
	}
	var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
	if(support == null) {
		return;
	}
	ws = new WebSocket("ws://" + option.path);
	// when data is comming from the server, this metod is called
	// onmessage ： 监听信息
	ws.onmessage = function(evt) {
		if(option.onmessage) {
			option.onmessage(evt.data);
		}
	};
	ws.onerror = function() {
		state = false;
		console.log("error");
	};
	// when the connection is established, this method is called
	ws.onopen = function(evt) {
		// 链接成功后
		console.log("success");
		localStorage.setItem(getInterimID + "-page-ide", 1011)
		clearInterval(reconnect);
	};
	// when the connection is closed, this method is called
	ws.onclose = function() {
		state = false;
		console.log('closed');
	}
}
// 当state 为 false时  说明websocket 断开连接 或者错误；就用定时器每隔3秒重新连接
reconnect = setInterval(tips, 3000);

function tips() {
	if(!state) {
		console.log("断开连接，从新连接");
		connect();
	}
}