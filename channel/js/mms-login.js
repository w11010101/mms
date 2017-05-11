// js 选择器
var login = {};
login.body = queryElement("body"); // body
login.btn = queryElement("#log-btn"); // 登录按钮
login.reg = queryElement("#log-reg"); // 注册按钮
login.forget = queryElement("#forgetPassword"); // 切换按钮
login.checked = queryElement("#getcheckedcode"); // 验证码
login.checkedcode = queryElement("#checkedcode"); // 获取验证码按钮
login.passWord = queryElement("#password"); // 密码

var forget_type = false;
login.reg.addEventListener("tap", function() {
	login.eye = queryElement(".mui-icon-eye");
	reduction_Interval();
	login.passWord.value = "";
	if(this.innerText == "注册") {
		showChecked();
		queryElement(".log-link-area").classList.add("log-password-hide");
		login.btn.innerHTML = "注册";
		login.btn.setAttribute("title-name", "注册");
		this.innerHTML = "登录";
		forget_type = true;
	} else if(this.innerText == "登录") {
		hideChecked();
		queryElement(".log-link-area").classList.remove("log-password-hide");
		login.btn.innerHTML = "登录";
		login.btn.setAttribute("title-name", "登录");
		this.innerHTML = "注册";
		login.forget.innerHTML = "验证码登录";
		forget_type = false;
	}
}, false);

// 显示 验证码
function showChecked() {
	implementJS("#password").fade_out(0, function() {
		implementJS(".mui-icon-eye").fade_out(0);
	}).classList.remove("log-switch");
	implementJS("#getcheckedcode").fade_in(0, function() {
		implementJS("#checkedcode").fade_in(0);
	})
}

// 显示 登录密码
function hideChecked() {
	implementJS("#password").fade_in(0, function() {
		implementJS(".mui-icon-eye").fade_in(0);
	}).classList.add("log-switch");
	implementJS("#getcheckedcode").fade_out(0, function() {
		implementJS("#checkedcode").fade_out(0);
	})
}
// 获取验证码
var num = 60;
var setTime = "";
login.checked.addEventListener('tap', function() {
	var that = this;
	num = 60;
	var phone = queryElement("#account");
	login.checkedcode.value = "";
	login.checkedcode.focus();
	var val = phone.value;
	var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
	if(val == "") {
		mui.toast('手机号不能为空！');
		return false;
	} else if(val != "") {
		if(!reg.test(val)) {
			mui.toast('手机号不正确！');
			return false;
		}
	}

	that.classList.add("getcheckedcode");
	that.disabled = true;
	that.value = num + "秒后重发";
	setTime = setInterval(function() {
		if(num >= 1) {
			that.value = (--num) + "秒后重发";
		} else {
			that.classList.remove("getcheckedcode");
			that.disabled = false;
			that.value = "获取验证码";
			clearInterval(setTime);
			return false;
		}
	}, 1000)

	mui.post(mmsappurl.captcha + val, function(data) {
		if(data.ret) {
			mui.toast('获取验证码请求已发送');
		} else {
			mui.toast('验证码获取失败');
			mui("#log-btn").button('reset');
			setTimeout(function() {
				reduction_Interval();
				mui.each(getInput, function(index, element) {
					element.blur()
				})
			}, 2000)
		}

	});

});

function reduction_Interval() {
	clearInterval(setTime);
	login.checkedcode.value = "";
	login.checked.classList.remove("getcheckedcode")
	login.checked.disabled = false;
	login.checked.value = "获取验证码"
	num = 60;
	mui("#log-btn").button('reset');
	
}
// forgetPassword 切换密码和验证码

login.forget.addEventListener("tap", function() {
	reduction_Interval();
	if(forget_type) {
		hideChecked();
		forget_type = false;
		this.innerHTML = "验证码登录";
	} else {
		this.innerHTML = "密码登录";
		showChecked();
		forget_type = true;
	}

})