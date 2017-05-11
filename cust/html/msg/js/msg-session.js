var getTextarr = localStorage.getItem(getInterimID + "-textarr") || null;
var getAddresseeId = localStorage.getItem(getInterimID + "-addresseeId") || null;
var getSessionTitle = localStorage.getItem(getInterimID + "-ses-title") || "";
mui(".msg-session-input")[0].value = getSessionTitle;
//
if(getAddresseeId != null) {
	var ids = getAddresseeId.split("|");
	var names = getTextarr.split("|");
	if(ids.length > 0) {
		for(var i = 0; i < ids.length; i++) {
			var createLi = createElement("li");
			createLi.setAttribute("user-id", ids[i]);
			createLi.innerHTML = names[i] + '<i>;</i></li>';
			mui(".msg-participants")[0].appendChild(createLi);
		}
	}
}

var test = "";

mui.plusReady(function() {
	var value = plus.webview.currentWebview();

})
mui("body").off("tap").on("tap", "a", function() {
	var href = this.getAttribute("href");
	if(href && ~href.indexOf(".html")) {
		localStorage.setItem(getInterimID + "-ses-title", mui(".msg-session-input")[0].value || "");
		var parameter = {};
		if(this.classList.contains("msg-create-btn")) { // 创建回话
			if(mui(".msg-session-input")[0].value == "") {
				mui.toast('主题不能为空');
				return false;
			} else if(getAddresseeId == null) {
				mui.toast('参与人不能为空');
				return false;
			}
			parameter.title = getSessionTitle;
			parameter.receiver_ids = getAddresseeId;
			parameter.page_name = "session";

			mui.each(mui(".msg-participants li"), function(i, e) {
				e.remove();
			})

			mui(".msg-session-input")[0].value = "";
		}
		jump(href, parameter);
		queryElement("input").blur();
	}
})

function participants_focus(obj, type) {

	obj.classList.add("msg-participants-show");

	// 删除
	mui(".msg-participants-show li").on("tap", "i", function() {
		implementJS(this).fade_out(300, function() {
			this.parentElement.remove();
		})
	})
}

function participants_blur(obj) {
	mui(".msg-participants-show")[0].classList.remove("msg-participants-show");
}

// 返回事件 
mui.back = function() {
	localStorage.removeItem(getInterimID + "-textarr");
	localStorage.removeItem(getInterimID + "-addresseeId");
	localStorage.removeItem(getInterimID + "-ses-title");
	old_back();
}