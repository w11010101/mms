var more_parameter = {};

// 刷新和加载
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
							var this_PP = pullRefreshEl.parentNode.parentNode;
							var this_id = this_PP.getAttribute("id");
							var getActiveLi = mui(".mui-slider-group .mui-active li");
							mui.each(getActiveLi, function(i, e) {
								e.remove();
							})
							more_parameter.atypeid = mui("body")[0].getAttribute("atypeid");
							more_parameter.groupid = mui(".mui-slider-indicator .mui-active")[0].getAttribute("group_id");
							more_parameter.pages = 0;
							more_group(more_parameter);

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

							more_parameter.atypeid = mui("body")[0].getAttribute("atypeid");
							more_parameter.groupid = mui(".mui-slider-indicator .mui-active")[0].getAttribute("group_id");
							more_parameter.pages = parseInt(mui(".mui-slider-group .mui-active")[0].getAttribute("pages")) + 1;

							more_group(more_parameter);
							showTips();
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
})(mui);

// 选项卡的左右滑动
function more_swipe() {
	queryElement('#slider').addEventListener('slide', function(e) {
		mui.later(function() {
			var l = mui(".mui-slider-group .mui-active li").length;
			if(l == 0) {
				more_parameter.pages = 0;
				more_parameter.atypeid = mui("body")[0].getAttribute("atypeid");
				more_parameter.groupid = mui(".mui-slider-indicator .mui-active")[0].getAttribute("group_id");
				more_group(more_parameter);
			}
		}, 1000)

	});
}
// 标题跳转
mui("header").on("tap", "a", function() {
	var href = this.getAttribute("href");
	if(href && ~href.indexOf(".html")) {
		if(this.classList.contains("icon-search")) {
			var parameter = {
				group_id: mui(".mui-slider-indicator .mui-active")[0].getAttribute("group_id"),
				search_type: queryElement("body").getAttribute("page_name"),
				name: "more"
			}
			localStorage.setItem("page-type", JSON.stringify(parameter));
		}
		jump(href, parameter);
	}
})
// more 列表点击
mui(".mui-content").on("tap", "li > a", function() {
	var href = this.getAttribute("href");

	if(href && ~href.indexOf(".html")) {

		if(this.classList.contains("icon-search")) {
			var parameter = {
				group_id: mui(".mui-slider-indicator .mui-active")[0].getAttribute("group_id"),
				type: queryElement("body").getAttribute("page_name"),
				name: "more"
			}
			localStorage.setItem("page-type", JSON.stringify(parameter));
		} else {
			var parameter = page_parameter(this);

		}
		jump(href, parameter);
	}
})
// 页面传参不同区分
function page_parameter(obj) {
	var parameter = {};
	var pageName = obj.getAttribute("page");
	switch(pageName) {
		case "more": // 产品手册 ，常见问题 ， 知识库
			parameter.atypeid = obj.getAttribute("atypeid");
			break;
		case "lib": // 知识库详情
			parameter.libId = obj.getAttribute("libId");
			break;
		case "chat": // 会话
			parameter.type = obj.getAttribute("page");
			localStorage.setItem("page-type", JSON.stringify(parameter));
			break;
		case "note": // 笔记
			parameter.type = "note";
			localStorage.setItem("page-type", JSON.stringify(parameter));
			break;

		default:
			break;
	}

	return parameter;
}
mui.plusReady(function() {
	var value = plus.webview.currentWebview();
	var atypeid = "";
	if(value.atypeid) {
		switch(value.atypeid) {
			case "2":
				mui(".mui-title")[0].innerHTML = "常见问题";
				mui("body")[0].classList.add("mui-tab-faq");
				mui("body")[0].setAttribute("page_name", "faq");
				break;
			case "4":
				mui(".mui-title")[0].innerHTML = "产品使用手册";
				mui("body")[0].classList.add("mui-tab-manual");
				mui("body")[0].setAttribute("page_name", "manual");
				break;
			case "16":
				mui(".mui-title")[0].innerHTML = "知识库";
				mui("body")[0].classList.add("mui-tab-lib");
				mui("body")[0].setAttribute("page_name", "lib");
				break;
			default:
				break;
		}
		mui("body")[0].setAttribute("atypeid", value.atypeid);
		more_dom_init(value.atypeid);
	} else {
		//知识库详情
		if(queryElement("body").classList.contains("more-lib-info")) {
			more_lib_info(value.libId);
		}

	}
})
// 获取分组下的dom 标签名
function more_dom_init(atypeid) {
	var urls = mmsappurl.more.gruopName;
	var datas = {
		atype: atypeid
	};
	getAjax(urls, datas, more_dom_init_success);

	function more_dom_init_success(data) {
		if(!data.errcode) {
			var getData = data.data;
			for(var x in getData) {
				mui(".mui-control-item")[x].innerHTML = getData[x].name;
				mui(".mui-control-item")[x].setAttribute("group_id", getData[x].id)
			}

			more_parameter.atypeid = atypeid;
			more_parameter.groupid = mui(".mui-slider-indicator .mui-active")[0].getAttribute("group_id");
			more_group(more_parameter);
		} else {
			mui.toast("获取数据失败");
		}
	}
}
// 获取分组列表
function more_group(parameter) {
	var urls = more_group_url(parameter.atypeid)
	var datas = {
		group_id: parameter.groupid,
		page_index: parameter.pages == undefined ? 0 : parameter.pages
	}
	mui(".mui-slider-group .mui-active")[0].setAttribute("pages", datas.page_index);
	getAjax(urls, datas, more_group_success);

	function more_group_success(data) {
		if(!data.errcode) {
			var getData = data.data;
			if(getData.length) {
				mui.each(getData, function(index, element) {
					if(parameter.atypeid == 2) {
						mui(".mui-slider-group .mui-active ul")[0].appendChild(more_faq_list(element));
					} else if(parameter.atypeid == 4) {
						mui(".mui-slider-group .mui-active ul")[0].appendChild(more_manual_list(element));
					} else if(parameter.atypeid == 16) {
						mui(".mui-slider-group .mui-active ul")[0].appendChild(more_library_list(element));
					}
				})
				mui(".mui-slider-group .mui-active .mui-loading")[0].style.display = "none";
			} else {
				mui.toast('无更多数据');
				hideTips();
			}
		} else {
			mui.toast("获取数据失败");
			hideTips();
		}
	}
}
// 隐藏加载更多提示
function hideTips() {
	mui(".mui-slider-group .mui-active .mui-pull-bottom-tips")[0].style.display = "none";
	mui(".mui-slider-group .mui-active .mui-loading")[0].style.display = "none";
}
// 显示加载更多提示
function showTips() {
	mui(".mui-slider-group .mui-active .mui-pull-bottom-tips")[0].style.display = "block";
}

// 获取不同分组的url
function more_group_url(atypeid) {
	switch(atypeid) {
		case "2":
			return mmsappurl.more.faq;
			break;
		case "4":
			return mmsappurl.more.manual;
			break;
		case "16":
			return mmsappurl.more.library;
			break;
		default:
			break;
	}
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * 创建要添加的dom列表
 * more_manual_list		使用手册
 * more_faq_list		常见问题
 * more_library_list	知识库
 */

function more_manual_list(data) {
	var createLi = createElement("li");
	createLi.setAttribute("manual_list_id", data.id);
	var createDivDown = createElement("div");
	createDivDown.classList.add("mui-slider-right", "mui-disabled"); //encrypted_url
	createDivDown.innerHTML = '<a class="mui-btn mui-btn-red" download=' + data.encrypted_url + ' title="' + data.title + '" file_name = "' + data.url + '" >下载</a>';
	var createDiv = createElement("div");
	createDiv.classList.add("mui-slider-handle");
	createDiv.innerHTML = '<span class="mui-pull-right mui-h5">' + get_date(data.update_time, "mdhm") + '</span><p class="mui-ellipsis">' + data.title + '</p><div class="mui-progressbar"><span></span></div>	'
	createLi.classList.add("mui-table-view-cell", "more-progressbar-hide");
	createLi.appendChild(createDivDown);
	createLi.appendChild(createDiv);
	return createLi;
}

function more_library_list(data) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell");
	var createA = createElement("a");
	createA.setAttribute("href", "more-lib-info.html");
	createA.setAttribute("libId", data.id);
	createA.setAttribute("page", "lib");
	var createDiv = createElement("div");
	createDiv.classList.add("mui-table", "mui-slider-handle");
	createDiv.innerHTML = '<div class="mui-table-cell mui-col-xs-8"><h4 class="mui-ellipsis">' + data.title + '</h4><h5 class="mui-ellipsis">' + data.author + '</h5></div><div class="mui-table-cell mui-col-xs-4 mui-text-right"><span class="mui-h5">' + get_date(data.update_time, "mdhm") + '</span></div>';
	createA.appendChild(createDiv)
	createLi.appendChild(createA);
	return createLi;
}

function more_faq_list(data) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell");
	createLi.innerHTML = '<div class="mui-media-body"><h2 class="more-faq-title">' + data.title + '</h2><p class="mui-ellipsis">' + data.content + '</p></div>';
	return createLi;
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * 知识库详情
 */

function more_lib_info(id) {
	var urls = mmsappurl.more.libraryInfo;
	var datas = {
		id: id
	}
	getAjax(urls, datas, more_lib_info_success);

	function more_lib_info_success(data) {
		if(data.errcode == 0) {
			var getData = data.data;
			mui(".more-lib-info-title input")[0].value = getData.title;
			queryElement("#more-lib-info-time").innerHTML = get_date(getData.update_time, "ymdhm");
			queryElement("#content").innerHTML = getData.content;
			queryElement("#more-lib-info-target").value = getData.content;

		} else {
			mui.toast("获取数据失败");
		}
	}
}