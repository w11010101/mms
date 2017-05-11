function CLIENT() {

	this.info = new Object();
	this.srv_config = new Object();

	this.set_client_config = function(syscode, dcode, dinfo, dsn, realm) {
//		var get_uid = uid()
		this.info.req_nonce = uid();
		this.info.req_timestamp = new Date().getTime();
		//this.info.req_ip = this.get_client_ip();
		this.info.req_device_code = dcode;
		this.info.req_device_sn = dsn;
		this.info.req_device_info = dinfo;
		this.info.req_realm = realm;
		this.info.req_syscode = syscode;
		this.info.req_sid = uid();
	}
	this.set_server_config = function(url_logon, url_valid, url_info) {
		this.srv_config.url_logon = url_logon;
		this.srv_config.url_valid = url_valid;
		this.srv_config.url_info = url_info;
	}
	this.get_client_token = function() {}
	this.get_client_ip = function() {}

	this.logon_url = function(returnurl) {
		this.build_logon_info(returnurl);
		var si = $.param(this.info);
		var bsi = si.tobase64();
		return this.srv_config.url_logon + "?info=" + bsi;
	}
	this.build_logon_info = function(returnurl) {
//		alert("build_logon_info()")
		var arr = Array();
		for(var item in this.info){
			arr.push(this.info[item]);
		}
		var key = this.take_opaque();
		arr.push(key);
		arr.sort();
		this.info.req_signature = arr.join("").tosha1();
		if (returnurl != null)
			this.info.req_returnurl = returnurl.tobase64();
			return this.info;
	}

	this.islogon = function(callback, callogon) {
		this.build_logon_info(null);
		var token = this.get_client_token();
		if (token != undefined && token != null)
			this.info.token = token;
		this.info.req_ip = this.get_client_ip();
		$.ajax({
			type: "POST",
			url: this.srv_config.url_valid,
			data: this.info,
			dataType: "json",
			processData: false,
			success: function(data) {
				if (data.errcode == 0)
					callback(data);
				else callogon();
			},
			
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest)
			},
			complete: function(XMLHttpRequest, textStatus) {}
		});
	}
	this.takeme = function(callback) {
		this.build_logon_info(null);
		var token = this.get_client_token();
		if (token != undefined && token != null)
			this.info.token = token;
		this.info.req_ip = this.get_client_ip();
//		console.log("STN =" + localStorage.getItem("STN"))
		console.log("this.info ==" + JSON.stringify(this.info))
		mui.ajax({
			type: "POST",
			url: this.srv_config.url_info,
			data: this.info,
			dataType: "json",
			success: function(data) {
				callback(data);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {},
			complete: function(XMLHttpRequest, textStatus) {}
		});

	}
	this.take_opaque = function() {
		return "9e8ece065af755006a0a1d1c9b30cc6a";
	}
}

function get_token_cookie(name) {
	return localStorage.getItem(name);
	//		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	//		if (arr = document.cookie.match(reg))
	//			return unescape(arr[2]);
	//		else
	//			return null;
}

function get_token_href(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

// function agent() {
//     var _agent = new CLIENT();
//     //设置客户端配置：系统代码，设备编码，设备串号，设备信息，域名
//     _agent.set_client_config("syn_profile", "dcode", "dinfo", "dsn", "localhost:20000");
//     //设置服务端配置：登录地址，验证地址，获取信息地址
//     _agent.set_server_config("http://172.16.15.19:20000/valid/logon/index", "http://172.16.15.19:20100/api/user_valid/valid", "http://172.16.15.19:20100/api/user_valid/fetch");
//     //设置客户端设备ip
//     _agent.get_client_ip = function () { return "127.0.0.1"; };
//     //设置获取客户端票据实现
//     _agent.get_client_token = function () { var token = get_token_href("STN"); if (token == null) token = get_token_cookie("STN"); return token; };
//     //设置客户端获取加密关键字实现
//     // _agent.take_opaque = function () { return "9e8ece065af755006a0a1d1c9b30cc6a"; }
//     return _agent;
// }


function agent1() {
	var str = localStorage.getItem("device_info");
//	console.log(str)
	var getinfos = JSON.parse(str);
	var _agent = new CLIENT();
	//设置客户端配置：系统代码，设备编码，设备串号，设备信息，域名
	// _agent.set_client_config("syn_profile", get_dcode(), get_dinfo(), get_dsn(), "localhost:20000");
//	_agent.set_client_config("syn_mms", get_dcode(), get_dinfo(), get_dsn(), "172.16.15.19:20000");
	_agent.set_client_config("syn_mms", get_dcode(), get_dinfo(), get_dsn(), mmscusregister+":20000");
//	_agent.set_client_config("syn_mms", get_dcode(), get_dinfo(), get_dsn(), mmscusapi_register+":20000");mmscusregister
	//设置服务端配置：登录地址，验证地址，获取信息地址
	_agent.set_server_config(mmscusregister+":20000/valid/logon/index", mmscusregister+":20100/api/user_valid/valid", mmscusregister+":20100/api/user_valid/fetch");
//	_agent.set_server_config(mmscusapi_login+":20000/valid/logon/index", mmscusapi_login+":20100/api/user_valid/valid", mmscusapi_login+":20100/api/user_valid/fetch");
//	_agent.set_server_config("http://172.16.15.19:20000/valid/logon/index", "http://172.16.15.19:20100/api/user_valid/valid", "http://172.16.15.19:20100/api/user_valid/fetch");
	//	_agent.set_server_config("http://172.16.15.19:20000/valid/logon/index", "http://172.16.15.19:20100/api/user_valid/valid", "http://172.16.15.19:20100/api/user_valid/fetch");
	//设置客户端设备ip
	_agent.get_client_ip = function() {
		return getinfos.getip;
	};
	//设置获取客户端票据实现	
	_agent.get_client_token = function() {
		var token = get_token_href("STN");
		if (token == null) token = get_token_cookie("STN");
		return token;
	};
	//设置客户端获取加密关键字实现
	_agent.take_opaque = function() {
		return "aa5bb4fe42ca16b1e901e83830a85269";
	}
	return _agent;
}
function get_dinfo() {
	return getinfos.infos.toLowerCase();
}

function get_dcode() {
	return getinfos.dcode.toLowerCase();
}

function get_dsn() {
	return getinfos.sn.toLowerCase();
}