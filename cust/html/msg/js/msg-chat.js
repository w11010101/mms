mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		// swipe: true, //默认为true
		// drag: true, //默认为true
		//		 hold:true,//默认为false，不监听
		// release:false//默认为false，不监听
	}
})
localStorage.setItem(getInterimID + "-page-ide", 1023);
// 发送信息
var objs = {
	sendBtn: queryElement(".msg-btn-sends"),
	photoBtn: queryElement(".icon-camera2"),
	inputText: queryElement(".msg-input-box"),
	scrollBox: queryElement(".mui-scroll-wrapper"),
	setTitle: queryElement("#msg-conv-title"),
	contentBox: queryElement(".mui-scroll")
}
var parameter = {
	type: "text",
	bothSides: "self",
}
var pages = 0;
// 发送人
var setSender = getInterimName;
// 解决键盘收起问题
objs.sendBtn.addEventListener("touchstart", function(event) {
	event.preventDefault();
})
objs.sendBtn.addEventListener("touchmove", function(event) {
	event.preventDefault();
})
// 消息发送
objs.sendBtn.addEventListener("tap", function() {
	if(objs.inputText.value != "") {
		parameter.type = "text";
		parameter.content = objs.inputText.value;
		parameter.bothSides = "self";
		parameter.sender = setSender;
		parameter.time = get_current_time();
		objs.contentBox.appendChild(create_box(parameter));
		replies(objs.inputText.value, "text");
		objs.inputText.value = "";
	}
	scrollBottom();
	copyMsg();
})
objs.inputText.addEventListener("tap", function() {
	scrollBottom();
})
// 会话聊天的上下拉加载
mui.init();
(function($) {
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: true, // 是否滑动反弹
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	$.ready(function() {
		var objtext;
		if(mui("body")[0].classList[0] == "msg-chat") {
			objtext = ".mui-scroll";
		} else {
			objtext = ".mui-slider-group .mui-scroll";
		}
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll(objtext), function(index, pullRefreshEl) {
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							var replyId = mui("#conv_scroll .msg-chat-box")[0].getAttribute("replyId");
							// 获取会话详情
							replaies_con(getSessionId, replyId);
							scrollTop();
							self.endPullDownToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
})(mui);

// 消息列表获取
function replaies_con(id, replyId) {
	var urls = mmsappurl.msg.replaies;
	var datas = {
		sid: id,
		id: replyId ? replyId : "",
		page_size: 5,
	}
	getAjax(urls, datas, con_success, fail_callback);

	function con_success(data) {
		localStorage.setItem(getInterimID + "currentChatId", id);
		var data = data.data;
		// 判断回复对象
		if(!data.length) {
			mui.toast("无更多数据");
			return;
		}
		mui.each(data, function(i, e) {
			var imgs_arr = new Array;
			if(e.sender_id == getInterimID) {
				parameter.bothSides = "self";
			} else {
				parameter.bothSides = "other";
			}
			parameter.time = e.reg_time;
			parameter.sender = e.sender;
			parameter.replyId = e.id;
			if(e.ctype == 0) {
				parameter.type = "text";
				parameter.content = e.content;
			} else if(e.ctype == 1) {
				parameter.type = "img";
				imgs_arr[imgs_arr.length] = e.content;
				parameter.content = down_imgs(imgs_arr);
			}
			objs.contentBox.insertBefore(create_box(parameter, "load"), objs.contentBox.childNodes[0]);
		})
		copyMsg();
	}
}
// 创建聊天信息容器
function create_box(parameter, type) {
	var chat_box = createElement("div");
	var header = createElement("img");
	var info_box = createElement("div");
	var time = createElement("span");
	var content = createElement("p");
	chat_box.setAttribute("replyId", parameter.replyId);
	if(parameter.bothSides == "self") {
		chat_box.classList.add("msg-chat-my", "msg-chat-box", "mui-clearfix");
		header.setAttribute("src", "../img/qiaoba.jpg");
		info_box.classList.add("msg-chat-content", "msg-chat-content-my");
		time.innerHTML = get_date(parameter.time) + " " + parameter.sender;
	} else {
		chat_box.classList.add("msg-chat-other", "msg-chat-box", "mui-clearfix");
		header.setAttribute("src", "../img/super-man.jpg");
		info_box.classList.add("msg-chat-content", "msg-chat-content-other");
		time.innerHTML = parameter.sender + " " + get_date(parameter.time);
	}
	info_box.appendChild(time);
	if(!type) {
		var createI = createElement("i");
		createI.classList.add("msg-chat-err-icon");
		createI.innerHTML = "!";
		info_box.appendChild(createI);
		var createWait = createElement("div");
		createWait.classList.add("mui-spinner");
		info_box.appendChild(createWait);
	}
	if(parameter.type == "img") {
		content.classList.add("img-box");
		var content_img = createElement("img");
		content_img.classList.add("add-img");
		content_img.setAttribute("src", parameter.content);
		content_img.setAttribute("data-preview-src", "");
		content_img.setAttribute("data-preview-group", "1");
		content.appendChild(content_img);
	} else {
		content.innerHTML = parameter.content;
	}
	info_box.appendChild(content)
	chat_box.appendChild(header);
	chat_box.appendChild(info_box);
	return chat_box;
}
// 调用相机
mui.plusReady(function() {
	// 来不同会话时，点击通知栏消息的监听
	var currentW = plus.webview.currentWebview();
	window.addEventListener("closeThisChat", function(e) {
		console.log("closeThisChat");
		old_back();
		mui.fire(currentW.opener(), "targerJumpPage", {
			targetFile: e.detail.targetFile,
			msg: e.detail.msg
		})
	})
	// 获取上一个页面传来的出值
	var value = plus.webview.currentWebview();
	if(value.page_name) {
		create_new_chat(value);
		localStorage.removeItem(getInterimID + "-textarr");
		localStorage.removeItem(getInterimID + "-addresseeId");
		localStorage.removeItem(getInterimID + "-ses-title");
		currentW.opener().hide();
		currentW.opener().close();
	} else {
		getSessionId = value.msg_chat_id;
		replaies_con(getSessionId, 0);
		objs.setTitle.innerHTML = value.msg_chat_title;
		localStorage.setItem(getInterimID + "currentChatId", getSessionId);
		scrollBottom();
	}
	plus.webview.currentWebview().setStyle({
		softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
	});
	mui(".msg-bar-session").on("tap", ".icon-camera2", function(event) {
		var that = this;
		var btnArray = [{
			title: "拍照"
		}, {
			title: "相册"
		}];
		plus.nativeUI.actionSheet({
			title: "选择照片",
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			switch(index) {
				case 0:
					break;
				case 1:
					var cmr = plus.camera.getCamera();
					cmr.captureImage(function(path) {
						parameter.type = "img";
						parameter.bothSides = "self";
						parameter.content = plus.io.convertLocalFileSystemURL(path);
						parameter.sender = setSender;
						parameter.time = get_current_time();
						objs.contentBox.appendChild(create_box(parameter));
						// 聊天图片上传
						var suffix = suffix_img(parameter.content); // 后缀名
						setTimeout(function() {
							upLoadImg(tobase(parameter.content), suffix, "chat");
						}, 1000)
						scrollBottom();
					}, function(err) {
						mui.toast("拍照出错了");
					});
					break;
				case 2:
					plus.gallery.pick(function(path) {
						parameter.type = "img";
						parameter.bothSides = "self";
						parameter.content = path;
						parameter.sender = setSender;
						parameter.time = get_current_time();
						objs.contentBox.appendChild(create_box(parameter));
						// 聊天图片上传
						var suffix = suffix_img(parameter.content); // 后缀名
						setTimeout(function() {
							upLoadImg(tobase(parameter.content), suffix, "chat");
						}, 1000)
						scrollBottom();
					}, function(err) {
						mui.toast("图片出错了");
					}, null);
					break;
			}
		});
	}, false);
})
// replies 回复
function replies(reply_text, type) {
	localStorage.setItem(getInterimID + "-page-ide", 1023);
	var urls = mmsappurl.msg.reply;
	var datas = {
		sid: getSessionId,
		sender_id: getInterimID,
		ctype: type,
		content: reply_text
	}
	getAjax(urls, datas, replies_callback, replies_err);

	function replies_callback(data) {
		mui(".mui-spinner")[0].remove();
		var localObj = {
			id: getSessionId,
			title: queryElement("#msg-conv-title").innerHTML,
			content: reply_text,
			reg_time: data.time
		}
		save_newChat(localObj)
	}
	// 只有ios才执行，目前测试发先，ios对于本地存储的监听无效，所以重新写本地存储的监听
	if(plus.os.name != "iOS") return;
	// 重写本地存储的监听
	var orignalSetItem = localStorage.setItem;
	localStorage.setItem = function(key, newValue) {
		var setItemEvent = new Event("repliesLocalStorage");
		setItemEvent.newValue = newValue;
		setItemEvent.key = key;
		window.dispatchEvent(setItemEvent);
		orignalSetItem.apply(this, arguments);
	}
	window.addEventListener("repliesLocalStorage", function(e) {
		var pkg = JSON.parse(e.newValue);
		var allW = plus.webview.all();
		mui.each(allW, function(i, e) {
			if(e.id.indexOf("msg.html")) {
				mui.fire(e, 'storage', {
					key: e.key
				});
			}
		})
	})

	function replies_err(err, x) {
		var l = mui(".msg-chat-content").length;
		setTimeout(function() {
			mui(".msg-chat-content")[l - 1].children[2].remove();
			mui(".msg-chat-content")[l - 1].children[1].style.display = "inline-block";
		}, 2000)
	}
}
// 滑动到底部
function scrollBottom() {
	var getObj = mui(".mui-scroll-wrapper").scroll();
	setTimeout(function() {
		getObj.refresh(true);
		getObj.scrollToBottom(500);
	}, 200)
}
// 滑动到顶部
function scrollTop() {
	var getObj = mui(".mui-scroll-wrapper").scroll();
	setTimeout(function() {
		getObj.scrollTo(0,0,100);
	}, 200)
}
//图片浏览
mui.previewImage();
// 点击其他部分 来删除复制等功能
document.addEventListener("click", function(e) {
	if(e.srcElement.parentElement.classList.contains("msg-edit")) {
		e.stopPropagation();
	} else if(e.srcElement.classList.contains("msg-input-box")) {} else {
		objs.inputText.onblur;
		mui.each(mui(".msg-edit"), function(i, e) {
			e.remove();
		})
	}
})
// 回复消息复制
function copyMsg() {
	mui(".msg-chat-box").on("longtap", "p", function(e) { //longtap
		objs.inputText.blur()
		if(!judge_img_box(this)) {
			copyImg(this);
		} else {
			copyText(this);
		}
		var this_prev = this.previousElementSibling;
		if(implementJS(this_prev).has_class("msg-chat-err-icon")) {
			mui(".msg-edit-refresh")[0].style.display = "inline-block";
		} else {
			mui(".msg-edit-refresh")[0].style.display = "none";
		}
	})
	// copy img 
	function copyImg(obj) {}
	// copy text
	function copyText(obj) {
		mui.each(mui(".msg-edit"), function(i, e) {
			e.remove()
		})
		obj.parentElement.appendChild(msgEditDom());
		var thisParent = obj.parentElement.parentElement;
		var y = -thisParent.offsetTop + 30;
		var wrapper_h = mui(".msg-chat .mui-scroll-wrapper")[0].offsetHeight;
		var scroll_h = mui(".msg-chat .mui-scroll")[0].offsetHeight;
		var scrollstyle = mui(".msg-chat .mui-scroll")[0].style.transform.split(",");
		var scrolltop = Math.abs(parseInt(scrollstyle[1]));
		var toforms = thisParent.offsetTop - scrolltop + 30;
		if(scroll_h < wrapper_h) {} else {
			if(scrolltop >= scroll_h - wrapper_h) {
				if(toforms < 50) {
					to_form(y);
				}
			} else {
				if(toforms < 50) {
					to_form(y);
				}
			}
		}
		msgEdit(obj.innerHTML);
		msgRefresh(obj.innerHTML);
	}
	// judge img
	function judge_img_box(obj) {
		if(implementJS(obj).has_class("img-box")) {
			return false;
		} else {
			return true;
		}
	}

	function to_form(y) {
		var scrollObj = mui(".msg-chat .mui-scroll-wrapper").scroll();
		scrollObj.scrollTo(0, y, 100);
	}
	// 创建信息编辑dom
	function msgEditDom() {
		var createDiv = createElement("div");
		createDiv.classList.add("msg-edit");
		createDiv.setAttribute("tabindex", 1);
		var createCopy = createElement("div");
		var createRefresh = createElement("div");
		createCopy.classList.add("msg-edit-copy");
		createCopy.innerHTML = "复制";
		createRefresh.classList.add("msg-edit-refresh");
		createRefresh.innerHTML = "重发";
		createDiv.appendChild(createCopy);
		createDiv.appendChild(createRefresh);
		return createDiv;
	}
	// 编辑按钮 —— 复制
	function msgEdit(val) {
		queryElement(".msg-edit-copy").addEventListener("tap", function() {
			copyVal(val);
			mui.toast('复制成功！');
			this.parentElement.remove();
		})
	}
	// 编辑按钮 —— 重发
	function msgRefresh(val) {
		queryElement(".msg-edit-refresh").addEventListener("tap", function() {
			this.parentElement.remove();
			parameter.type = "text";
			parameter.content = val;
			parameter.bothSides = "self";
			parameter.sender = setSender;
			objs.contentBox.appendChild(create_box(parameter));
			replies(val, "text");
			scrollBottom();
			copyMsg();
		})
	}
	// 复制
	function copyVal(value) {
		if(plus.os.name == "iOS") {
			var UIPasteboard = plus.ios.importClass("UIPasteboard");
			var generalPasteboard = UIPasteboard.generalPasteboard();
			// 设置/获取文本内容:
			generalPasteboard.setValueforPasteboardType(value, "public.utf8-plain-text");
			var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
		} else {
			var Context = plus.android.importClass("android.content.Context");
			var main = plus.android.runtimeMainActivity();
			var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
			plus.android.invoke(clip, "setText", value);
		}
	}
}
// 会话参与人
//进入会话信息页
mui("header").on("tap", ".msg-chat-person", function() {
	var page_parameter = {
		chatId: getSessionId,
		chatTitle: mui("#msg-conv-title")[0].innerHTML
	}
	jump("msg-chat-person.html", page_parameter);
});
// 创建新回话
function create_new_chat(value) {
	localStorage.setItem(getInterimID + "-page-ide", 1023);
	var urls = mmsappurl.msg.createChat;
	var datas = {
		creator_id: getInterimID,
		title: value.title,
		receiver_ids: value.receiver_ids.split("|")
	}
	getAjax(urls, datas, create_new_chat_success);

	function create_new_chat_success(data) {
		mui("#msg-conv-title")[0].innerHTML = data.data.title
		getSessionId = data.id;
		queryElement("body").setAttribute("pType", "newChat");
		localStorage.setItem(getInterimID + "currentChatId", data.id);
	}
}
// 返回事件 
mui.back = function() {
	console.log("chat.js mui.back")
	var currentW = plus.webview.currentWebview();
	if(queryElement("body").getAttribute("pType")) {
		localStorage.setItem(getInterimID + "-page-ide", 1000);
	} else {
		mui.fire(currentW.opener(), "backPageIde", {
			prevW: currentW.opener()
		})
	}
	old_back();
}