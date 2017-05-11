// 判断票据是否 存在
function log_judge_STN() {
	if(localStorage.getItem("STN") != null) {
		// STN 存在
		// 验证STN 是否有效
		var logon_info = agent1().build_logon_info(null);
		log_STN_Results(logon_info);
	} else {
		// STN 不存在
		if(localStorage.getItem("start") != null) {
			jump("login.html");
		}
	}
}
// 验证STN 是否有效
function log_STN_Results(logon_info) {
	logon_info.token = localStorage.getItem("STN");
	var urls = mmsappurl.STNvalid;
	var datas = logon_info;
	getAjax(urls, datas, results_success, fail_callback);

	function results_success(data) {
		if(data.errcode >= 0) {
			// 验证成功 获取用户信息
			log_takeme_info();
		} else if(data.errcode < 0) {
			// 验证失败  重新登录
			jump("login.html");
			localStorage.removeItem("STN");
		}
	}
}

// 查询用户信息
function log_takeme_info() {
	agent1().takeme(function(data) {
		if(data.errmsg == "票据过期") {
			mui.toast(data.errmsg);
			localStorage.removeItem("STN");
			jump("login.html");
			return false;
		}
		// 验证机构
		log_judge_org(data);
		function log_judge_org(data) {
			if(data.errcode < 0) {
				jump("login.html");

				return false
			}
			if(data.id != null && data.data.orgSnap != null) {
				var data = data.data;
				// 如果不为空， 就获取用户（认证平台中用户）
				var user_info = new Object;
				user_info.ruid = data.id;
				user_info.name = data.snapInOrg.name;
				user_info.nick_name = data.nickName;
				user_info.phone_no = data.phone;
				user_info.head_img = data.logo;
				user_info.org_name = data.orgSnap.name;
				user_info.code = data.orgSnap.code;
				user_info.org_rid = data.orgSnap.id;
				user_info.org_otype = data.orgSnap.code.indexOf("_univ")>0?1:2;
				user_info.cap = data.orgSnap.cap;
				// 如果有机构   就同步
				log_sync_info(user_info);
			} else {
				// 未绑定机构提示
				log_is_org();
			}
		}
	})
}

// 是否要绑定机构
function log_is_org() {
	var btnArray = ['确认', '取消'];
	mui.confirm('您还未绑定机构，若想使用此功能将会进行机构绑定! ', '是否要跳转至绑定页面？？', btnArray, function(e) {
		if(e.index == 0) {
			//确定
			log_create();
		} else {
			//取消
			//localStorage.removeItem("STN");
			var currentW = plus.webview.currentWebview();
			if(currentW.id == "login.html") {
				currentW.reload(true);
			} else {
				jump("login.html");
			}
		}
	});
}
// 创建并显示新窗口
function log_create() {
	var w = plus.webview.create(mmsappurl.org + localStorage.getItem("STN")+"&req_syscode=syn_mms");
	w.show(); // 显示窗口
	// 监听页面关闭 
	w.addEventListener("close", function(e) {
		// 监听创建窗口的关闭状态
		if(hasClassName("body", "login")) {
			plus.webview.currentWebview().reload(true);
		}else{
			jump("login.html");
		}
		w = null;
	}, false);
}
// 客户方同步操作
function log_sync_info(datas) {
	var urls = mmsappurl.sync;
	getAjax(urls, datas, log_sync_info_success, fail_callback);

	function log_sync_info_success(data) {
		if(data.errcode == 0 && data != null) {
			// 同步借口调用 成功
			var data = data.data;
			log_save_user_info(data);
		} else if(data.errcode == -5104) {
			//身份错误，请使用“渠道方”账号登录
			if(queryElement("body").classList.contains("login")) {
				mui.toast("身份错误，请使用“渠道方”账号登录");
				mui("#password")[0].value = "";
				mui("#log-btn").button('reset');
			}
			jump("login.html");
		} else {
			// 同步借口调用 失败;
			jump("reg-prompt.html");
			localStorage.setItem("audited", 0);
		}
	}
}
// 存储用户信息
function log_save_user_info(data) {
	var contact = new Object;
	contact.user_id = data.id;
	contact.org_id = data.org_id;
	contact.phone = data.phone_no;
	contact.name = data.name;
	contact.org_name = data.org_name;
	var str = JSON.stringify(contact);
	localStorage.setItem(contact.user_id + "-user", str);
	localStorage.setItem("interimID", str);
	// 连接websocket
	connect();
	mui.later(function() {
		jump("html/msg/html/msg.html");
	}, 500)
	localStorage.removeItem(getInterimID + "-textarr");
	localStorage.removeItem(getInterimID + "-addresseeId");
	localStorage.removeItem(getInterimID + "-ses-title");
}