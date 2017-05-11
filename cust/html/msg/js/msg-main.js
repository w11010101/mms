mui.init();
var sessin_pages = 0;
(function($) {
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: true, // 是否滑动反弹
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	$.ready(function() {
		var objtext = ".mui-slider-group .mui-scroll";
		//循环初始化所有下拉刷新，上拉加载。
		var pages = 0;
		$.each(queryAllElement(objtext), function(index, pullRefreshEl) {
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function(e) {
						// 下拉刷新
						var self = this;
						setTimeout(function() {
							editHide();
							checked_l = 0;
							var this_PP = pullRefreshEl.parentNode.parentNode;
							var this_id = this_PP.getAttribute("id");
							var getActiveLi = mui(".mui-slider-group .mui-active li");
							if(this_id == "item1mobile") {
								// 消息通知
								messages("down");
							} else if(this_id == "item2mobile") {
								// 会话
								mui.toast("暂无新数据");
							}
							$(document).imageLazyload({
								placeholder: 'images/60x60.gif'
							});
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					callback: function(e) {
						// 上滑加载
						var self = this;
						setTimeout(function() {
							var this_PP = pullRefreshEl.parentNode.parentNode;
							var this_id = this_PP.getAttribute("id");
							if(this_id == "item1mobile") {
								// 消息通知
								messages("up", ++pages);
							} else if(this_id == "item2mobile") {
								// 会话列表
							}
							$(document).imageLazyload({
								placeholder: '../../../img/60x60.gif'
							});
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
})(mui);
// 设置页面标识
// 选项卡的左右滑动
//var slide_box = queryElement(".mui-slider-group");
//var item1 = document.getElementById('item1mobile');
//var item2 = document.getElementById('item2mobile');
//var getUl = queryElement(".msg-session-lists");
//document.getElementById('slider').addEventListener('slide', function(e) {
//	mui("body")[0].classList.remove('msg-checked-show');
//	var childs = slide_box.children;
//	if(e.detail.slideNumber === 0) {
//		msg_list_tap("messages");
//		localStorage.setItem(getInterimID + "-page-ide", 1011);
//		if(item1.querySelector('.mui-loading')) {
//			implementJS("#msg-edit-notice").fade_in(0, function() {
//				this.innerHTML = "编辑";
//			});
//		}
//	} else if(e.detail.slideNumber === 1) {
//		// 删除会话列表里的上拉
//		msg_list_tap("chat");
//		localStorage.setItem(getInterimID + "-page-ide", 1021);
//		editHide();
//		var localObj = localStorage.getItem(getInterimID + "-chatList");
//		var activeList = mui(".msg-session-lists li");
//		if(localObj) {
//			if(JSON.parse(localObj).length) {
//				insert_chatList();
//			} else {
//				mui.toast("无新会话");
//			}
//		} else {
//			sessionList_save();
//			mui.toast("无新会话");
//		}
//	}
//});
// 公告列表DOM
var data = {
	di: 1,
	ntype: 0,
	read: "read",
	title: "title",
	content: "content",
	sid: 111
}
// 消息——公告
function messages(type, pages) {
	localStorage.setItem(getInterimID + "-page-ide", 1011);
	//更改页面id,用于判断在那个页面;1011,公告列表页
	var pageLists;
	if(type == "down") {
		mui.each(mui(".mui-slider-group .mui-active ul li"), function(i, e) {
			e.remove();
		})
		pageLists = 20;
		pages = 0;
	} else {
		pageLists = 5;
	}
	var urls = mmsappurl.msg.noticeList;
	var datas = {
		receiver_id: getInterimID,
		page_index: pages,
		page_size: pageLists
	}
	console.log(urls);
	console.log(JSON.stringify(datas));
	getAjax(urls, datas, messages_success, fail_callback);

	function messages_success(data) {
		var data = data.data;
		if(data != null) {
			var getActive = mui(".mui-slider-group #item1mobile ul")[0];
			mui.each(data, function(i, e) {
				getActive.appendChild(dom_list(e, "message"));
			})
			msg_list_tap("messages");
		} else {
			mui(".mui-active .mui-pull-bottom-tips")[0].style.display = "none";
			mui.toast('没有数据！');
		}
		mui(".mui-active .mui-loading")[0].style.display = "none";
	}
}
// 编辑列表的dom结构
function dom_list(data, type) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table", "mui-table-view-cell", "mui-media");
	var createA = createElement("a");
	createA.classList.add("mui-slider-handle");
	createA.setAttribute("getids", data.id);
	var createImg = createElement("img");
	createImg.classList.add("mui-media-object", "mui-pull-left");
	createLi.setAttribute("beginTime", data.update ? data.update : data.reg_time);
	switch(data.ntype) {
		case 0:
			createImg.setAttribute("src", "../img/icon1.png");
			break;
		case 1:
			createImg.setAttribute("src", "../img/icon2.png");
			break;
		case 2:
			createImg.setAttribute("src", "../img/icon3.png");
			break;
		case 3:
			createImg.setAttribute("src", "../img/icon4.png");
			break;
		default:
			createImg.setAttribute("src", "../img/icon16.png");
			break;
	}
	var createDiv_2 = createElement("div");
	createDiv_2.classList.add("mui-media-body");
	createDiv_2.setAttribute("read", data.read);
	var createLabel = createElement("label");
	createLabel.innerHTML = data.title;
	createDiv_2.appendChild(createLabel)
	var createI = createElement("i");
	var createP = createElement("p");
	createP.classList.add("mui-ellipsis");
	if(data.content != undefined) {
		createP.innerHTML = data.content;
	}
	var createDIV = createElement("div");
	createDIV.classList.add("mui-input-row", "mui-checkbox", "mui-left", "mui-col-xs-2", "coustom-dis-no");
	createLi.appendChild(createDIV);
	var createInput = createElement("input");
	createInput.setAttribute("type", "checkbox");
	createInput.setAttribute("onchange", "editCheckbox(this)");
	createDIV.appendChild(createInput);
	if(type == "message") {
		createA.setAttribute("href", "msg-info.html");
		createP.innerHTML = data.content;
		// 添加已读未读
		if(data.read) {
			createA.classList.add("has-read");
		}
		createI.innerHTML = get_date(data.reg_time);
	} else {
		createP.innerHTML = data.reply ? data.reply.content : data.content;
		createA.setAttribute("href", "msg-chat.html");
		createI.innerHTML = get_date(data.update ? data.update : data.reg_time, "ymdhm");
		createI.setAttribute("reg_time", data.update ? data.update : data.reg_time);
	}
	createDiv_2.appendChild(createI);
	createDiv_2.appendChild(createP);
	createA.appendChild(createImg);
	createA.appendChild(createDiv_2);
	createLi.appendChild(createA);
	return createLi;
}
// 公告、会话详情  列表的点击事件
function msg_list_tap(type) {
	mui(".mui-scroll ul").off("tap").on("tap", "a", function() {
		var href = this.getAttribute("href");
		localStorage.removeItem(getInterimID + "-locationHref");
		if(type == "messages") { // messages ：公告
			jump(href, {
				msg_info_id: this.getAttribute("getids")
			});
		} else if(type == "chat") { // info ：会话	
			localStorage.setItem(getInterimID + "-page-ide", 1023);
			jump(href, {
				msg_chat_id: this.getAttribute("getids"),
				msg_chat_title: this.querySelector("label").innerHTML
			});
		}
	})
}
// 消息——会话
function sessionList(type, beginTime) {
	//更改页面id,用于判断在那个页面;1021,会话列表页
	var pageLists;
	var urls = mmsappurl.msg.chatList;
	var datas = {
		receiver_id: getInterimID,
		page_index: 0,
		page_size: 99,
		begin_time: beginTime ? beginTime : ""
	}
	getAjax(urls, datas, sessionList_success, fail_callback);
	//加载会话列表
	function sessionList_success(data) {
		var data = data.data;
		var getActive = mui(".msg-session-lists")[0];
		var allList = mui(".msg-session-lists li");
		if(data.length != 0) {
			mui.each(data, function(i, e) {
				if(e.title != "null") {
					if(type == "down") {
						getActive.appendChild(dom_list(e, "session"));
					} else {
						// 如果下拉获取最新的会话是之前有的就删除
						for(var x = 0; x < allList.length; x++) {
							if(e.id == allList[x].querySelector("a").getAttribute("getids")) {
								allList[x].remove();
							}
						}
						getActive.insertBefore(dom_list(e, "session"), mui(".msg-session-lists li")[0]);
					}
				}
			})
		} else {
			mui.toast('没有数据！');
		}
		msg_list_tap("chat");
		// 本地保存会话列表
		sessionList_save();
	}
}
// 本地保存会话列表
function sessionList_save() {
	var localArr = [];
	for(var x = 0; x < mui(".msg-session-lists li").length; x++) {
		var thisLi = mui(".msg-session-lists li")[x];
		var localObj = {
			id: thisLi.querySelector("a").getAttribute("getids"),
			title: thisLi.querySelector("label").innerHTML,
			content: thisLi.querySelector("p").innerHTML ? thisLi.querySelector("p").innerHTML : " ",
			reg_time: thisLi.querySelector("i").getAttribute("reg_time")
		}
		localArr[x] = localObj;
	}
	localStorage.setItem(getInterimID + "-chatList", JSON.stringify(localArr));
	// 当所有的会话列表存储完后，再存一个会话列表的标识，便于进入会话列表是的判断，是否重新加载
}
// 会话列表的本地存储如果发生变化，重新调用下拉刷新
window.addEventListener("storage", function(e) {
	if(plus.os.name == "Android"){
		if(e.key == getInterimID + "-chatList") {
			insert_chatList();
		}
	}else{
		// 注：ios获取不到e.detail.key ，所以无法像andorid一样判断是那个本地存储在变化
		insert_chatList();
	}
},false)
// 获取最新的本地存储列表来添加
// 修改本地存储，并重新覆盖原有的记录保存下来
// 插入本地存储的会话列表；
function insert_chatList() {
	var lists = mui(".msg-session-lists li");
	var interimid = JSON.parse(localStorage.getItem("interimID")).user_id;
	var localObj = JSON.parse(localStorage.getItem((getInterimID || interimid) + "-chatList"));
	mui.each(lists, function(i, e) {
		e.remove();
	})
	mui.each(localObj, function(i, e) {
		if(e.id != undefined && e.id != null) {
			var dom = dom_list(e, "session");
			getUl.appendChild(dom);
		} else {
			console.log("无效列表");
		}
	});
	msg_list_tap("chat");
}