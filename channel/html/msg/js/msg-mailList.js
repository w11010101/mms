var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: true, // 是否滑动反弹
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});

function get_mailList(orgId) {
	var datas = {
		org_id: orgId
	}
	var urls = mmsappurl.msg.mailList;
	getAjax(urls, datas, get_mailList_success, fail_callback);
}

function get_mail_list_dom(obj, data, type) {
	var domeUl = "";
	var title_check = ""
	if(type) {
		domeUl = '<ul class="mui-table-view msg-mailList-contacts"></ul>';
		title_check = "msg-title-check";
		title_check_a = "msg-title-check-a";
	}
	for(var i = 0; i < data.length; i++) {
		var createLi = createElement("li");
		createLi.classList.add("mui-table-view-cell", "mui-collapse", "mui-media");
		createLi.setAttribute("orgId", data[i].id);
		createLi.innerHTML = '<span class="' + title_check + '"></span><a class="mui-navigate-right ' + title_check_a + '" href="#" user-id="' + data[i].id + '">' + data[i].name + '</a>' + domeUl;
		obj.appendChild(createLi);

	}
	mui(".mui-loading")[0].style.display = "none";
}

function get_mailList_success(data) {
	var getData = data.data;
	var getAddObj = mui(".msg-mailList-cust-contacts")[0];
	get_mail_list_dom(getAddObj, getData, true);
	setTimeout(function() {
		var getAddObjChild = mui(".msg-mailList-cust-contacts > li");
		mui.each(getAddObjChild, function(i, e) {
			get_mailList_subset(e, "open");
		})
	}, 100);

	mui(".msg-mailList-cust-contacts").off("tap").on("tap", ".msg-title-check", function(e) {

		this.classList.toggle("msg-checks-active");
		this.classList.remove("msg-checks-halfActive");
		var this_lis = mui("li", this.parentElement);
		if(this_lis.length == 0) {

		} else {
			var thisChecks = mui("ul span", this.parentElement);
			if(this.classList.contains("msg-checks-active")) {
				mui.each(thisChecks, function(i, e) {
					e.classList.add("msg-checks-active");
				})
			} else {
				mui.each(thisChecks, function(i, e) {
					e.classList.remove("msg-checks-active");
				})
			}
		}
	})
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
	// 子列表内容展开
	mui(".msg-mailList-cust-contacts > li").off("tap").on("tap", ".msg-title-check-a", function() {
		var that = this;
		// 通讯录机构下的列表

		var thisUl = mui("ul", this.parentElement)[0];
		if(thisUl.classList.contains("list-show")) {
			thisUl.style.display = "none";
		} else {
			thisUl.style.display = "block";
		}
		thisUl.classList.toggle("list-show");

	})
}

function get_mailList_subset(obj, type) {
	var getLisChild = mui("ul", obj)[0];
	var urls = mmsappurl.msg.mailListSubset;
	var datas = {
		org_id: obj.getAttribute("orgId")
	};
	getAjax(urls, datas, get_mailList_subset_success, fail_callback);

	function get_mailList_subset_success(data) {
		var getData = data.data;
		get_mail_list_dom(getLisChild, getData, false);
		if(type == "open") {
			var thisChecks = mui("ul span", obj);
			if(mui(".msg-title-check", obj)[0].classList.contains("msg-checks-active")) {
				mui.each(thisChecks, function(i, e) {
					e.classList.add("msg-checks-active");
				})
			} else {
				mui.each(thisChecks, function(i, e) {
					e.classList.remove("msg-checks-active");
				})
			}
		}
	}

	// 子集里的多选事件——css修改
	mui(getLisChild).on("tap", "span", function() {
		this.classList.toggle("msg-checks-active");
		var thisPPF = this.parentElement.parentElement.previousElementSibling.previousElementSibling;
		var checksL = mui(".msg-checks-active", this.parentElement.parentElement).length;
		var l = mui("span", this.parentElement.parentElement).length;
		if(checksL == l) {
			thisPPF.classList.add("msg-checks-active");
			thisPPF.classList.remove("msg-checks-halfActive");
		} else if(checksL < l && checksL > 0) {
			thisPPF.classList.remove("msg-checks-active");
			thisPPF.classList.add("msg-checks-halfActive");
		} else if(checksL == 0) {
			thisPPF.classList.remove("msg-checks-active");
			thisPPF.classList.remove("msg-checks-halfActive");
		}
	})
}
mui.plusReady(function() {
	// 通讯录  的确定按钮
	var textArr = new Array;
	var addresseeId = new Array;
	var value = plus.webview.currentWebview();

	if(value.page_source_ide) {
		var source_ide = value.page_source_ide
	}

	mui("header").on("tap", ".msg-mailList-active", function() {
		var activeObj = mui(".msg-mailList-cust-contacts li ul .msg-checks-active");
		var l = activeObj.length;
		for(var i = 0; i < l; i++) {
			textArr[i] = activeObj[i].nextElementSibling.innerText;
			addresseeId[i] = activeObj[i].nextElementSibling.getAttribute("user-id");
		}
		// 删除相同的
		mui.each(addresseeId, function(i, e) {
			if(getInterimID == e) {
				addresseeId.splice(i, 1);
				textArr.splice(i, 1)
			}
		})
		localStorage.setItem(getInterimID + "-textarr", textArr.join("|"));
		localStorage.setItem(getInterimID + "-addresseeId", addresseeId.join("|"));

		// 通讯录点击确定后的操作 
		var allW = plus.webview.all();
		var prevW = "";
		mui.each(allW, function(i, e) {
			if(~e.id.indexOf("msg-session.html")) { // 创建新会话的返回判断
				prevW = plus.webview.getWebviewById(e.id);
			} else if(~e.id.indexOf("msg-chat-person.html")) { // 添加会话人的返回判断
				prevW = plus.webview.getWebviewById(e.id);

				// 添加会话人
				chat_add_person(value.msg_chat_id);

			}
		})

		function chat_add_person(id) {
			var urls = mmsappurl.msg.chatAddPerson;
			var datas = {
				id: id,
				creator_id: getInterimID,
				receiver_ids: addresseeId
			}

			getAjax(urls, datas, chat_add_person_success);

			function chat_add_person_success(data) {

			}
		}
		prevW.reload(true); //返回上一页后刷新！
		old_back();
	})
})