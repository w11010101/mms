mui.init();

//17服务器
var mmschnDN = "http://172.16.15.17:20300/api/";
var mmschnYun = "http://172.16.15.17:";
var mmschnYun1 = "http://172.16.15.17/";
var mmschnsregister = "http://172.16.15.17";
var mmschnwebsocket = "172.16.15.17:20500/"; //websocket
//云服务器
// var mmschnDN = "http://mms.xzxyun.com:20300/api/";
// var mmschnYun = "http://mms.xzxyun.com:";
// var mmschnYun1 = "http://mms.xzxyun.com/";
// var mmschnsregister = "http://register.xzxyun.com";
// var mmschnwebsocket = "mms.xzxyun.com:20500/"; //websocket

var mmsappurl = {
	signIn: mmschnsregister + ":20000/valid/logon/pad", // 登录
	register: mmschnsregister + ":20000/reg/phone/register",
	// webSocket: "mms.xzxyun.com:20500/1000/",
	download: mmschnYun + "40000/support/client_update/download?fn=", // 下载
	update: mmschnDN + "mms_chn_client_update/latest", // 更新
	STNvalid: mmschnsregister + ":20100/api/user_valid/valid", // STN 有效性
	org: mmschnsregister + ":20000/auth/org/agent?STN=", // 绑定机构
	sync: mmschnDN + "mms_chn_user_sync/sync",
	captcha: mmschnsregister + ":20000/reg/phone/captcha?phone=", // 验证码
	downImg: mmschnDN + "mms_chn_file_download/app_download_files", // 下载图片
	uploadImg: mmschnDN + "mms_chn_file_upload/app_upload", // 上传图片
	channelagent: mmschnwebsocket + ":20000",
	channellogin: mmschnsregister + ":20000/valid/logon/index",
	channellogins: mmschnsregister + ":20100/api/user_valid/valid",
	channelloginv: mmschnsregister + ":20100/api/user_valid/fetch",
	msg: {
		noticeList: mmschnDN + "mms_chn_notice_query/get_by_receiver", // 通告列表
		noticeInfo: mmschnDN + "mms_chn_notice_query/notice", // 公告详情
		chatList: mmschnDN + "mms_chn_con_query/latest_cons_list", // 会话列表
		replaies: mmschnDN + "mms_chn_con_query/replies", // 会话内容列表
		reply: mmschnDN + "mms_chn_con_operate/reply", // 回复
		createChat: mmschnDN + "mms_chn_con_operate/add", // 创建会话
		mailList: mmschnDN + "mms_chn_org_query/channel_contacts", // 通讯录
		mailListSubset: mmschnDN + "mms_chn_user_query/contacts", // 二级通讯录
		chatPerson: mmschnDN + "mms_chn_con_query/get_receivers_list", // 会话成员
		chatAddPerson: mmschnDN + "mms_chn_con_operate/add_receivers", // 添加会话成员
		batchDel: mmschnDN + "mms_chn_notice_operate/batch_delete", // 批量删除
		exitChat: mmschnDN + "mms_chn_con_operate/exit", // 推出绘画组
	},
	service: {
		serviceList: mmschnDN + "mms_chn_mission_query/channel_user", // 服务列表
		drafts: mmschnDN + "mms_chn_mission_query/my_drafts", // 草稿箱
		delDrafts: mmschnDN + "mms_chn_mission_operate/delete_drafts", // 删除草稿箱
		mission: mmschnDN + "mms_chn_mission_query/mission", // 
		process: mmschnDN + "mms_chn_mission_query/process", // 服务进度
		remark: mmschnDN + "mms_chn_mission_operate/remark", //  
		confirm: mmschnDN + "mms_chn_mission_operate/confirm", // 已解决
		noSolve: mmschnDN + "mms_chn_mission_operate/set_unsolved", // 未解决
		build: mmschnDN + "mms_chn_mission_operate/build", // 保存草稿
		Submit: mmschnDN + "mms_chn_mission_operate/submit", // 提交
		serMission: mmschnDN + "mms_chn_mission_query/mission", // 根据id获取受理任务信息
		serAccept: mmschnDN + "mms_chn_mission_operate/accept", //受理任务
		serOrgOtype: mmschnDN + "mms_chn_user_query/by_org_otype", //根据id获取分配任务信息人员列表
		serAllot: mmschnDN + "mms_chn_mission_operate/allot", //受理任务
		serExecute: mmschnDN + "/mms_chn_mission_operate/execute_start", //执行任务
		serExecuted: mmschnDN + "/mms_chn_mission_operate/executed", //执行完成
		serOrgContacts: mmschnDN + "/mms_chn_user_query/contacts" //获取渠道下用户
	},
	statistics: mmschnDN + "mms_chn_mission_analyse/channel_user", // 统计
	more: {
		chatGroup: mmschnDN + "mms_chn_con_query/cons", // 会话组
		editPWD: mmschnsregister + ":20000/valid/pwd/index?req_syscode=syn_mms&stn=", // 修改密码
		gruopName: mmschnDN + "mms_chn_group_query/by_atype", // 分组
		faq: mmschnDN + "mms_chn_faq_query/by_group", // 常见问题
		titleFaq: mmschnDN + "mms_chn_faq_query/by_group_title", // 根据标题搜索常见问题
		manual: mmschnDN + "mms_chn_manual_query/by_group", // 手册
		titleManual: mmschnDN + "mms_chn_manual_query/by_group_title", // 根据标题搜索手册
		note: mmschnDN + "mms_chn_note_query/by_user_id", // 笔记列表
		download: mmschnYun + "40000/support/manual/download?fn=", // 下载
		downManual: mmschnYun1 + "support/manual/app_download?fn=", // 手册下载
		library: mmschnDN + "mms_chn_library_query/by_group", // 知识库
		libraryInfo: mmschnDN + "mms_chn_library_query/library", // 知识库详情
		titleLibrary: mmschnDN + "mms_chn_library_query/by_group_title", // 根据标题搜索知识库
		noteAdd: mmschnDN + "/mms_chn_note_operate/add", //添加笔记
		noteEdit: mmschnDN + "/mms_chn_note_query/note", //编辑笔记
		noteEditSub: mmschnDN + "/mms_chn_note_operate/update", //提交编辑的笔记
		noteAtype: mmschnDN + "/mms_chn_group_query/by_pid_atype", //发布获取类型列表（系统设备其它）
		notePublish: mmschnDN + "/mms_chn_note_operate/publish_note", //发布笔记
		delNote: mmschnDN + "mms_chn_note_operate/delete", // 删除笔记
		custOrgs: mmschnDN + "/mms_chn_org_query/cust_orgs", //客户名录 渠道方列表
		custOrgsUser: mmschnDN + "/mms_chn_user_query/by_org_id", //客户名录 渠道方列表
		orgsUnrelated: mmschnDN + "/mms_chn_org_query/cust_orgs_unrelated", //查询可添加的用户
		orgsAdd: mmschnDN + "/mms_chn_relation_operate/add", //添加机构关系
		orguser: mmschnDN + "/mms_chn_user_query/by_org_id", //获取用户管理用户列表
		orgDel: mmschnDN + "/mms_chn_user_operate/chn_verify", //删除用户
		modifyOtype: mmschnDN + "/mms_chn_user_operate/chn_modify_otype", //提交编辑用户
	}
}
// 创建页面
function jump(href, paramet, aniShow) {
	if(href && ~href.indexOf(".html")) {
		mui.openWindow({
			url: href,
			id: href,
//			styles: {
//				top: newpage - top - position, //新页面顶部位置
//				bottom: newage - bottom - position, //新页面底部位置
//				width: newpage - width, //新页面宽度，默认为100%
//				height: newpage - height, //新页面高度，默认为100%
//				......
//			},
			extras:paramet,
			createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: aniShow||"slide-in-right", //页面显示动画，默认为”slide-in-right“；
//				duration: animationTime, //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
				extras: {} //窗口动画是否使用图片加速
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				title: '正在加载...', //等待对话框上显示的提示内容
				options: {
//					width: waiting - dialog - widht, //等待框背景区域宽度，默认根据内容自动计算合适宽度
//					height: waiting - dialog - height, //等待框背景区域高度，默认根据内容自动计算合适高度
//					......
				}
			}
		})
	}
}
//判断当前打开页面
//1000,弹出提示
//1021,会话列表页
//1023,聊天会话
//1011,公告列表页
localStorage.setItem(getInterimID + "-page-ide", 1000);
// 选择第一个元素
function queryElement(t) {
	return document.querySelector(t);
}
// 选择所有元素
function queryAllElement(t) {
	return document.querySelectorAll(t);
}
// 创建一个元素
function createElement(t) {
	return document.createElement(t);
}
// 返回上一页
var old_back = mui.back;
if(localStorage.getItem("interimID") != null) {
	var str1 = localStorage.getItem("interimID");
	var getInterim = JSON.parse(str1);
	var getInterimID = getInterim.user_id; //用户id
	var getInterimName = getInterim.name; //用户名称
	var getInterimorgid = getInterim.org_id; //用户所在机构id
	var getInterimphone = getInterim.phone; //用户账号
	var getInterimorgname = getInterim.org_name; //用户所在机构名称
}
// common ajax  ================================
var fail_callback = function(data) {
	if(data.statusText == "timeout") {
		mui.toast("网络超时，请检查后重试");
	} else {}
};
var str = localStorage.getItem("device_info");
var getinfos = JSON.parse(str);

function getAjax(urls, datas, setSuccess, fail_callback) {
	if(localStorage.getItem("STN") == undefined) {
		var token = "";
	} else {
		var token = localStorage.getItem("STN");
	}
	var imei = getinfos.uids;
	var auth = "";
	auth = "Basic " + window.btoa(token + ":" + imei);
//	console.log(auth)
	mui.ajax(urls, {
		data: datas,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000, //超时时间设置为10秒； 
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", auth);
		},
		success: function(data) {
			setSuccess(data);
		},
		error: function(xhr, type, errorThrown) {
			var err = {
				msg: "exception",
				textStatus: type
			};
			fail_callback(err);
		}
	});
}
// 空列表提示
//function mmsNothing(){
//	if(mui(".mui-active .mui-pull-bottom-tips").length){
//		mui(".mui-active .mui-pull-bottom-tips")[0].style.display = "none";
//	}
//	
//	var createDiv = createElement("div")
//	createDiv.classList.add("mms-nothing");
//	createDiv.innerHTML= '<img src="../../../img/nothing.png"/>空空如也';
//	return createDiv;
//}
mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({
		'popGesture': 'none'
	});
	var allW = plus.webview.all();
	//	compatibleAdjust();
	// 顶部状态蓝颜色修改
	if(allW.length > 2) {
		mui.later(function() {
			plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");
			plus.navigator.setStatusBarBackground('#0A569D');
		}, 500);
	}
	// 监听本地存储的变化
	window.addEventListener("storage", storageListener, false);
})

function storageListener(e) {
	var getPkg = localStorage.getItem(getInterimID + "-msg");
	var getPkg = JSON.parse(getPkg);
	var msg = JSON.stringify(getPkg);
	if(e.key == getInterimID + "-msg") {
		var topW = plus.webview.getTopWebview();
		var topWId = topW.id;
		var currentW = plus.webview.currentWebview();
		var currentWId = currentW.id;
		if(currentWId == "HBuilder") return;
		if(topW != currentW) return;
		judgePtype(getPkg);

	} else {
		if(plus.os.name == "iOS") {
			if(!e.detail.key) return;
			if(e.detail.key == getInterimID + "-msg") {
				judgePtype(getPkg);
			}
		}
	}
}

// 判断消息类型
function judgePtype(getPkg) {
	console.log("getPkg.ptype = " + getPkg.ptype)
	if(getPkg.ret) {
		if(getPkg.ptype == 1011) {
			getPkg.title = "新公告";

			judge_notice_list_page(getPkg);
		} else if(getPkg.ptype == 1021) {
//			getPkg.title = "新会话";
//
//			judge_conv_page(getPkg);
		} else if(getPkg.ptype == 1023) {
//			getPkg.title = "新回复";
//
//			judge_conv_page(getPkg);
		} else if(getPkg.ptype == 1024) {
//			getPkg.title = "新会话";
//
//			notice_push(getPkg);
		}
	}
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * 监听网络连接
 */

document.addEventListener("netchange", function() {
	var types = {};
	types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
	types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
	types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
	types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
	types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
	types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
	types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
}, false);

//判断是否在当前会话页面,1023
function judge_conv_page(msg) {
	var pageIDE = localStorage.getItem(getInterimID + "-page-ide");
	var content = JSON.parse(msg.content);
	console.log("pageIDE = " + pageIDE);
	switch(pageIDE) {
		case "1023":
			//在会话页面，并且是当前的会话页面（同时有3个会话，可能我在1会话页面，这时会话2有新的回复），不提示，直接把内容插入
			//每次进一个会话页面，修改conv_page_id属性值为对应的会话ID

			Insert_reply(content, msg);
			break;
		case "1021":

			//在会话列表页面，不提示，直接插入列表
			Insert_chat_list(content);
			break;
		default:
			notice_push(msg);
			break;
	}
}
// 判断是否在公告列表页面
function judge_notice_list_page(msg) {
	var pageIDE = localStorage.getItem(getInterimID + "-page-ide");
	var this_page = plus.webview.currentWebview();
	if(pageIDE == 1011) {
		//在公告列表页面，不提示，直接插入列表
		var notice_list = Insert_notice_list_html(msg.content);
		mui("#msg-list")[0].insertBefore(notice_list, mui("#msg-list li:first-child")[0]);
	} else {
		notice_push(msg);
	}
}

// 插入公告里列表
function Insert_notice_list_html(data) {
	var getdata = JSON.parse(data);
	var createLi = createElement("li");
	var html = "";
	createLi.classList.add("mui-table", "mui-table-view-cell", "mui-media");
	html = '<div class="mui-input-row mui-checkbox mui-left mui-col-xs-2 coustom-dis-no"><input name="checkbox" value="Item 1" type="checkbox" onchange="editCheckbox(this)"></div>';
	html += '<a class="mui-slider-handle  " href="msg-info.html" getids="' + getdata.sid + '"><img class="mui-media-object mui-pull-left" src="../img/icon2.png">';
	html += '<div class="mui-media-body" read="true">' + getdata.title + '<i>' + get_date(getdata.reg_time) + '</i><p class="mui-ellipsis">' + getdata.content + '</p></div></a>';
	createLi.innerHTML = html;
	return createLi;
}
////把内容插入会话详情页面
function Insert_reply(content, msg) {
	if(content != null) {
		var reply = content.reply || content;
		// 判断来信息的会话是不是当前显示的会话!
		var currentChatId = localStorage.getItem((getInterimID || interimid) + "currentChatId");
		if(currentChatId != (reply.sid||content.id)) {
			// 不是
			notice_push(msg);
		} else {
			// 是
			if(reply.reply != null) {
				// 如果接收到的是自己发的，就不插入；
				if(reply.sender_id == undefined) return;
				if(reply.sender_id != getInterimID) {
					var other_html = Insert_reply_html(content);
					if(queryElement("#conv_scroll")) {
						queryElement("#conv_scroll").appendChild(other_html);
					} else {}
					scrollBottom();
				} else {
					console.log("错误2")
				}
			} else {
				console.log("错误1")
			}
		}
	} else {
		console.log("错误0")
	}
}

function Insert_reply_html(parameter) {
	var chat_box = createElement("div");
	var header = createElement("img");
	var info_box = createElement("div");
	var time = createElement("span");
	var content = createElement("p");
	var reply = parameter.reply;
	chat_box.classList.add("msg-chat-other", "msg-chat-box", "mui-clearfix");
	header.setAttribute("src", "../img/super-man.jpg");
	info_box.classList.add("msg-chat-content", "msg-chat-content-other");
	time.innerHTML = reply.sender + " " + get_date(reply.reg_time);

	info_box.appendChild(time);

	if(parameter.reply.ctype == 1) {
		var imgArr = [];
		imgArr.push(reply.content)
		content.classList.add("img-box");
		var content_img = createElement("img");
		content_img.classList.add("add-img");
		content_img.setAttribute("src", down_imgs(imgArr)[0]);
		content_img.setAttribute("data-preview-src", "");
		content_img.setAttribute("data-preview-group", "1");
		content.appendChild(content_img);
	} else {
		content.innerHTML = reply.content;
	}
	info_box.appendChild(content)
	chat_box.appendChild(header);
	chat_box.appendChild(info_box);
	return chat_box;
}
////把会话插入会话列表页面
function Insert_chat_list(content) {
	if(content != null) {
		var reply = content.reply;
		if(reply != null) {
			var chatId = content.id;
			if(mui("#item2mobile li").length) {
				mui.each(mui("#item2mobile li"), function(i, e) {
					if(mui("a", e)[0].getAttribute("getids") == chatId) {
						e.remove();
					}
				})
				mui(".msg-session-lists")[0].insertBefore(Insert_chat_list_html(content), mui(".msg-session-lists li")[0]);
			} else {
				mui(".msg-session-lists")[0].appendChild(Insert_chat_list_html(content))
			}
			// 本地存储 会话列表
			sessionList_save();
		}
	}
}
// 插入会话列表
function Insert_chat_list_html(data) {

	var content = data.reply;
	var html = "";
	var createLi = createElement("li");
	createLi.classList.add("mui-table", "mui-table-view-cell", "mui-media");
	createLi.setAttribute("beginTime", content.reg_time);
	var time = new Date(content.reg_time);
	var getM = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
	var getH = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
	var getD = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
	var getMin = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
	var replyTime = time.getFullYear() + "-" + getM + "-" + getD + " " + getH + ":" + getMin;
	html += '<div class="mui-input-row mui-checkbox mui-left mui-col-xs-2 coustom-dis-no"><input name="checkbox" value="Item 1" type="checkbox" onchange="editCheckbox(this)"></div>';
	html += '<a getids="' + data.id + '" href="msg-chat.html"><img class="mui-media-object mui-pull-left" src="../img/icon16.png">';
	html += '<div class="mui-media-body"><label>' + data.title + '</label><i reg_time="' + content.reg_time + '">' + replyTime + '</i><p class="mui-ellipsis">' + content.content + '</p></div></a>';
	createLi.innerHTML = html;

	return createLi;
}

// ******************************************************************
// 模仿 imitate js 构造函数
// implementJS 执行函数
// js 模仿 淡入淡出效果
// fade_out 淡出
// fade_in 淡入
// js拓展方法 jsFadeIn
// js拓展方法 jsFadeOut
// ******************************************************************
function imitateJS(obj) {
	this.init = new Object();
	var animate;
	// 淡出
	this.fade_out = function(time, callback) {
		if(!obj) return;
		if(obj.length == undefined) {
			_out(obj);
		} else {
			for(var i = 0; i < obj.length; i++) {
				_out(obj[i]);
			}
		}

		function _out(this_obj) {
			// var this_obj = obj;
			if(this_obj.style.display == "block" || this_obj.style.display == "") {
				this_obj.style.opacity = 1;
			}
			var s = 1;
			if(parseFloat(this_obj.style.opacity) >= 1) {
				animate = setInterval(function() {
					if(s <= 1 && s > 0.8) {
						s = s - 1 / (time / 3.6);
						this_obj.style.opacity = s;
					} else if(s <= 0.8 && s > 0) {
						s = s - 1 / (time / 4.4);
						this_obj.style.opacity = s;
					} else if(s <= 0) {
						clearInterval(animate);
						this_obj.removeAttribute("stype");
						this_obj.setAttribute("style", "display:none");
						if(callback != undefined) {
							callback.apply(this_obj);
						}
					}
				}, 2)
			}
		}
		return obj;
	}

	// 淡入
	this.fade_in = function(time, callback) {
		if(obj.length == undefined) {
			_in(obj);
		} else {
			for(var i = 0; i < obj.length; i++) {
				_in(obj[i]);
			}
		}

		function _in(this_obj) {
			// var this_obj = obj;
			if(this_obj.style.display == "" || this_obj.style.display == "none") {
				this_obj.style.display = "block";
				this_obj.style.opacity = 0;
			}
			var s = 0;
			if(parseFloat(this_obj.style.opacity) <= 1) {
				animate = setInterval(function() {
					if(s >= 0 && s <= 0.7) {
						s = s + 1 / (time / 4.4);
						this_obj.style.opacity = s;
					} else if(s > 0.7 && s < 1) {
						s = s + 1 / (time / 3.5);
						this_obj.style.opacity = s;
					} else if(s > 1) {
						clearInterval(animate);
						this_obj.removeAttribute("stype");
						this_obj.setAttribute("style", "display:block");
						if(callback != undefined) {
							callback.apply(this_obj);
						}
					}
				}, 2)
			}
		}
		return obj;
	}

	// 判断是否有某个className
	this.has_class = function(query_name) {
		var i = obj.classList.length;
		while(i--) {
			if(obj.classList[i] === query_name) {
				return true;
			}
		}
		return false;
	}
	this.js_hide = function() {
		obj.style.display = "none";
		return obj;
	}
	this.js_show = function() {
		obj.style.display = "block";
		return obj;
	}
	// 除自己之外的同辈元素
	this.siblings = function(query_name) {

	}
	// 删除选定元素 
	// 支持单个元素和多个元素删除
	this.del = function(query_name) {
		if(obj.length) {
			for(var x = 0; x < obj.length; x++) {
				obj[x].remove();
			}
		} else {
			obj.remove();
		}
	}
}
// 模拟 jq hasClass 功能方法
function hasClassName(objName, className) {
	var start = objName.substr(0, 1);
	if(start == "#") {
		var obj = document.getElementById(objName.substr(1));
	} else if(start == ".") {
		var obj = document.querySelector(objName);
	} else {
		var obj = document.getElementsByTagName(objName)[0];
	}
	var class_list = obj.className.split(" ");
	for(var i in class_list) {
		if(class_list[i] == className) {
			return true;
		}
	}
}
// 模拟 removeClass 
function removeClassName(objName, className) {
	var start = objName.substr(0, 1);
	if(start == "#") {
		var obj = document.getElementById(objName.substr(1));
	} else if(start == ".") {
		var obj = document.querySelector(objName);
	} else {
		var obj = document.getElementsByTagName(objName)[0];
	}
	var class_list = obj.className.split(" ");
	obj.classList.remove(className);

}

function implementJS(obj) {
	// 选择器
	if(typeof obj === "object") {
		o = obj;
	} else if(obj.indexOf(" ") > 0) {
		var selector_arr = del_space(obj.split(" "));
		// 循环次数
		o = for_subset(selector_arr[0]);
		// o = subset(selector_arr);
	} else if(obj.indexOf("+") > 0) {
		var selector_arr = obj.split("+");
		// o = subset(selector_arr);
	} else {
		o = itself(obj);
	}
	var implement = new Object();
	imitateJS.call(implement, o);

	implement.eq = function(num) {
		if(num == null) {
			return false;
		} else {
			imitateJS.call(o, o[num]);
			return o;
		}
	}
	// id & class & tags 
	function itself(obj_text) {
		var selector_sign = obj_text.substr(0, 1);
		var doc;
		if(selector_sign == "#") {
			doc = document.getElementById(obj_text.substr(1));
		} else if(selector_sign == ".") {
			doc = document.querySelectorAll(obj_text);
			if(doc.length <= 1) {
				doc = document.querySelector(obj_text);
			}
		} else {
			doc = document.getElementsByTagName(obj_text)[0];
		}
		return doc;
	}
	// 循环次数
	function for_subset(obj_arr) {
		for_query_child(obj_arr);

		function for_query_child(obj_arr) {
			var queryObj = document.querySelector(obj_arr);
			var l = queryObj.childNodes.length - 1;
			var thatObj = "";
			for(var x = l; x >= 0; x--) {
				var queryChild = queryObj.childNodes[x].children;
				if(queryChild != undefined) {
					if(queryChild.length > 0) {} else {
						return false;
					}
				}
			}
		}

		if(obj_arr.length > 2) {
			for(var x = 0; x < obj_arr.length - 1; x++) {
				return find_subset(obj_arr[x], obj_arr[x + 1]);
			}
		} else {
			return find_subset(obj_arr[0], obj_arr[1]);
		}
	}
	// 在P_obj 里查找 C_obj
	function find_subset(p_str, s_str) {
		var h_str = s_str.substr(0, 1);
		var p_obj = itself(p_str);
		var s_obj = itself(s_str);
		var c_obj = p_obj.children;
		switch(h_str) {
			case "#":
				for(var i = 0; i < c_obj.length; i++) {
					var getId = c_obj[i].getAttribute("id");
					if(getId == s_str.substr(1)) {
						return c_obj[i];
					}
				}
				break;
			case ".":
				for(var i = 0; i < c_obj.length; i++) {
					var y = c_obj[i].classList.length;
					var c_obj_class = c_obj[i].classList;
					while(y--) {
						if(c_obj_class[y] === s_str.substr(1)) {
							return c_obj[i];
						}
					}
				}
				break;
			default:
				// tag name
				break;
		}

	}
	// subset 子集 选择 或 同级 +  
	function subset(selector_arr) {

	}
	// del_space 删除空格
	function del_space(selector_arr) {
		if(typeof selector_arr === "object") {
			var _arr = new Array;

			for(var i in selector_arr) {
				if(selector_arr[i] != "") {
					// selector_arr.splice(i,1);
					_arr[_arr.length] = selector_arr[i];
				}
			}
			return _arr;
		} else if(typeof selector_arr === "string") {
			// return selector_arr.replace(/\s/g, "");
		}
	}
	return implement;
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * 页面跳转
 */
var aniShow = "pop-in";
//只有ios支持的功能需要在Android平台隐藏；
if(mui.os.android) {
	var list = document.querySelectorAll('.ios-only');
	if(list) {
		for(var i = 0; i < list.length; i++) {
			list[i].style.display = 'none';
		}
	}
	//Android平台暂时使用slide-in-right动画
	if(parseFloat(mui.os.version) < 4.4) {
		aniShow = "slide-in-right";
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 日期
 */
// 格局化日期：yyyy-MM-dd 
function formatDate(date) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth();
	var myweekday = date.getDate();
	if(mymonth < 10) mymonth = "0" + mymonth;
	if(myweekday < 10) myweekday = "0" + myweekday;
	return(myyear + "-" + mymonth + "-" + myweekday);
}
//获得本周的开端日期 
function getWeekStartDate() {
	var dayNames = new Array("0", "1", "2", "3", "4", "5", "6");
	if(dayNames[nowDayOfWeek] == 0) {
		var nowDay = getDate - nowDayOfWeek - 6;
	} else {
		var nowDay = getDate - (dayNames[nowDayOfWeek] - 1)
	}
	var weekStartDate = new Date(getYear, getMonth, nowDay);
	return formatDate(weekStartDate)

}
//获得本周的停止日期 
function getWeekEndDate() {
	var dayNames = new Array("0", "1", "2", "3", "4", "5", "6");
	if(dayNames[nowDayOfWeek] == 0) {
		var nowDay = getDate - nowDayOfWeek;
	} else {
		var nowDay = getDate + (dayNames.length - dayNames[nowDayOfWeek])
	}
	var weekEndDate = new Date(getYear, getMonth, nowDay);
	return formatDate(weekEndDate);
}
// 判断当月多少天
function getLastDate(getY, getM) {
	var year = parseInt(getY);
	var month = parseInt(getM);
	// 闰年
	var leap_year = false;
	if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
		leap_year = true;
	switch(month) {
		case 2:
			if(leap_year) {
				return 29;
			} else {
				return 28;
			}
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			return 31;
		default:
			return 30;
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * 接受推送消息
 */
function notice_push(getMsg) {
	var push_msg = JSON.parse(getMsg.content);
	createLocalPushMsg(getMsg, push_msg);
	plus.push.addEventListener("click", function(msg) {
		var interimid = JSON.parse(localStorage.getItem("interimID")).user_id;
		var msg = JSON.parse(localStorage.getItem((getInterimID || interimid) + "-msg"));
		var push_msg = JSON.parse(msg.content);
		var currentW = plus.webview.currentWebview();
		var topW = plus.webview.getTopWebview();
		if(plus.os.name == "iOS"){
			if(currentW.id != topW.id) return;
		}
		msg.msg_chat_id = push_msg.id;
		msg.msg_chat_title = push_msg.title;
		var currentChatId = localStorage.getItem((getInterimID || interimid) + "currentChatId");
		if(currentChatId != push_msg.id && topW.id.indexOf("msg-chat.html") >= 0) {
			var allW = plus.webview.all();
			// 遍历所有的窗口对象，找出会话详情的窗口，效用自定义事件 closeThisChat
			mui.each(allW,function(i,e){
				if(e.id.indexOf("msg-chat.html")>=0){
					mui.fire(e,"closeThisChat",{
						targetFile: targetPage(msg),
						msg: msg
					});
				}
			})
		} else {
			jump(targetPage(msg), msg);
		}
		// 提示点击的内容
		localStorage.removeItem(getInterimID + "-locationHref");
	}, false);
}
// 通知栏点击要跳转的页面
function targetPage(getMsg) {
	if(getMsg.ptype == 1023) {
		var pageName = "msg-chat.html";
		var url = "_www/html/msg/html/" + pageName
		localStorage.setItem(getInterimID + "-page-ide", 1023);
	} else {
		var pageName = "msg.html";
		var url = "_www/html/msg/html/" + pageName
		localStorage.setItem(getInterimID + "-page-ide", 1011);
	}
	var path = plus.io.convertLocalFileSystemURL(url);
	if(plus.os.name = 'iOS') {
		var targetP = "file://" + path;
	} else {
		var targetP = "file://" + path;
	}
	return targetP;
}
// 再次打开的目标页面，索要执行的操作
window.addEventListener("targerJumpPage", function(event) {
	console.log("targerJumpPage");
	var getDetail = event.detail;
	mui.later(function() {
		jump(getDetail.targetFile, getDetail.msg);
	}, 1000);
}, false)
// 会话详情返回后的自定义事件，来判断是否弹通知栏
window.addEventListener("backPageIde",function(event){
	console.log("backPageIde");
	var getDetail = event.detail;
	if(getDetail.prevW.id.indexOf("msg.html")>=0){
		console.log("是msg.html");
		if(queryElement("#item1mobile").classList.contains("mui-active")) {
			localStorage.setItem(getInterimID + "-page-ide", 1011);
		} else {
			localStorage.setItem(getInterimID + "-page-ide", 1021);
			insert_chatList();
		}
	}else{
		console.log("不是msg.html");
		localStorage.setItem(getInterimID + "-page-ide", 1000);
	}
})
/**
 * 本地创建一条推动消息
 */
function createLocalPushMsg(getMsg, pushMsg) {
	var options = {
		cover: false
	};
	var payload = "";
	if(getMsg.ptype == 1023) {
		var content = JSON.parse(getMsg.content);
		var str = "[" + content.title + "]: " + content.reply.content
	} else {
		var content = JSON.parse(getMsg.content);
		var str = "[" + getMsg.title + "]: " + content.title;
	}

	plus.push.createMessage(str)

	if(plus.os.name == "iOS") {

	}
}
//  保存最新一条的会话消息   ****************************************************************
function save_newChat(chat) {
	var interimid = JSON.parse(localStorage.getItem("interimID")).user_id;
	var locals = localStorage.getItem(interimid + "-chatList");
	var addId = chat.id;
	var localObj = JSON.parse(locals);
	// 遍历 删除重复，并新建数组把其他的存进去
	mui.each(localObj, function(i, e) {
		if(e.id == addId) {
			localObj.splice(i, 1); // 删除相同
		}
	})
	localObj.unshift(chat);
	localStorage.setItem(interimid + "-chatList", JSON.stringify(localObj));
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * 获取本机设备
 */

function log_get_devices() {
	//localStorage 存储
	var setinfos = new Object;
	setinfos.sn = plus.device.uuid.toLowerCase();
	//		setinfos.sn = plus.device.imei.toLowerCase(); // imei
	setinfos.imei = plus.device.imei.toLowerCase();
	setinfos.uids = plus.device.uuid.toLowerCase(); // uuid
	setinfos.dcode = plus.device.vendor;
	setinfos.infos = plus.device.model;
	setinfos.code = "syn_mms";
	setinfos.getip = getIp();

	var str1 = JSON.stringify(setinfos);
	localStorage.setItem("device_info", str1);
	//获取 本机 ip地址 start
	function getIp() {
		var ip = "127.0.0.1";
		if(plus.os.name == "Android") {
			var Context = plus.android.importClass("android.content.Context");
			var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");
			var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
			var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo");
			var wifiInfo = wifiManager.getConnectionInfo();
			ip = intToIp(wifiInfo.getIpAddress());
		} else if(plus.os.name == "iOS") {

		}
		return ip;
	}

	function intToIp(i) {　　
		return(i & 0xFF) + "." + ((i >> 8) & 0xFF) + "." + ((i >> 16) & 0xFF) + "." + ((i >> 24) & 0xFF);
	}

}

// 转换时间
var get_date = function(date, format) {
	var validDate = date.substr(0, 19);
	var timePart = [];
	mui.each(validDate.split("T"), function(i, e) {
		if(i == 0) {
			for(var x in e.split("-")) {
				timePart.push(e.split("-")[x]);
			}
		} else {
			for(var x in e.split(":")) {
				timePart.push(e.split(":")[x]);
			};
		}
	})
	var getY = timePart[0];
	var getM = timePart[1];
	var getD = timePart[2];
	var getH = timePart[3];
	var getMin = timePart[4];
	var getS = timePart[5];
	var getTime = 0;
	switch(format) {
		case "ymd": // 只显示年月日
			getTime = getY + "-" + getM + "-" + getD;
			break;
		case "mdhm": // 只显示月日时分
			getTime = getM + "-" + getD + " " + getH + ":" + getMin;
			break;
		case "ymdhm": // 只显示年月日时分
			getTime = getY + "-" + getM + "-" + getD + " " + getH + ":" + getMin;
			break;
		default: // 不传全部显示 年月日 时分秒
			getTime = getY + "-" + getM + "-" + getD + " " + getH + ":" + getMin;
			break;
	}
	return getTime;
}
// 获取当前时间
function get_current_time(){
	var time = new Date();
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var min = time.getMinutes();
	var s = time.getSeconds();
	var currentTime = y + "-" + (m > 10 ? m : "0" + m) + "-" + (d > 10 ? d : "0" + d) + "T" + (h > 10 ? h : "0" + h) + ":" + (min > 10 ? min : "0" + min) + ":" + (s > 10 ? s : "0" + s);
	return currentTime;
}
// 滑动到底部
function scrollBottom() {
	var getObj = mui(".mui-scroll-wrapper").scroll();
	setTimeout(function() {
		getObj.refresh(true);
		getObj.scrollToBottom(500);
	}, 200)
}