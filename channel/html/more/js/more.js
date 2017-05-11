var more_parameter = {};
//=======================================Ajax-more===========================================//
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
				console.log(JSON.stringify(more_parameter));
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
		case "direc": // 名录
			parameter.type = "direc";
			localStorage.setItem("page-type", JSON.stringify(parameter));
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

//点击进入详情编辑
function edit_noto() {
	$(".mui-table-view-chevron .mui-slider-handle").on("tap", function() {

		mui.openWindow({
			url: "../../html/more/html/more-note-edit.html",
			createNew: true,
			extras: {
				passval_id: $(this).parent("li").attr("id")
			},
			show: {
				aniShow: "正在跳转",
				aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
				duration: 300
			}
		})
	});
};
//点击发布
function note_library() {
	$(".mui-btn-yellow").on("tap", function() {
		mui.openWindow({
			url: "../../html/more/html/more-note-select.html",
			createNew: true,
			show: {
				aniShow: "正在跳转",
				aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
				duration: 300
			},
			extras: {
				passval_id: $(this).parents("li").attr("id"),
				passval_title: $(this).parents().siblings("div").find("h4").text(),
				passval_public: $(this).parents("li").attr("is_public")
			}
		})
	})
}
//是否确认删除
function note_delete() {
	var btnArray = ['确认', '取消'];
	$('.mui-table-view-chevron .mui-btn-red').on('tap', function(event) {

		var note_id = $(".mui-table-view-chevron li.mui-selected").attr("id");
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该条记录？', '新中新运维云平台', btnArray, function(e) {
			if(e.index == 0) {
				li.parentNode.removeChild(li);
				note_delete_mission(note_id);
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	});
}

//****************************** more-note-add ++++++++++++ 添加笔记  *****************************************//
function note_add_mission() {
	var datas = {
		group_id: 0, // 分组ID,
		author_id: getInterimID, // 作者ID,
		author: getInterimName, //作者,
		title: $("#title").val(), // 标题,
		content: $("#target").val() // 内容
	};
	var url = mmsappurl.more.noteAdd;
	getAjax(url, datas, note_add_callback, note_add_fail_callback);
}
//添加成功
function note_add_callback(data) {
	if(data.errcode == 0) {
		mui.toast("添加成功");
		localStorage.setItem(getInterimID + "note-refresh-bool", true);
		$("#note_title").val("");
		$("#cntent").text("");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	} else {

		mui.toast("添加笔记失败");
		$(".mask-layer").hide(0);
	}
}
//添加失败
function note_add_fail_callback(data) {

	var data = data.data;
	mui.toast("添加笔记失败");
}
//************************** more-lib-datails  ++++++++++++ 获取知识库详情 *******************************//
//**************************** more-note-edit  ++++++++++++ 获取笔记内容 *********************************//
function note_edit_mission(getType, content_url) {

	var datas = {
		id: getType
	};
	var urls = content_url;
	getAjax(urls, datas, get_note_callback, fail_callback);
}

function get_note_callback(data) {

	if(data.errcode == 0) {
		var data = data.data;
		$("#title").val(data.title);
		$("#time").text(get_date(data.update_time, "ymdhm"));
		$("#content").html(data.content);
		$("#target").val(data.content);
		//提交编辑后的笔记
		$("#note_save_edit").on("tap", function() {
			var datas = {
				id: data.id,
				title: $("#title").val(),
				content: $("#target").val()
			};
			var url = mmsappurl.more.noteEditSub
			getAjax(url, datas, note_edit_callback, fail_callback);

			function note_edit_callback(data) {
				var prevW = plus.webview.currentWebview().opener();
				prevW.reload(true);
				old_back();
			}
		})
		$("img").on(function() {
			$(this).focus();
		})
	} else {

		mui.toast("获取数据失败")
	}
}
//************** more-note-select ++++++++++++ 获取某个技术支持类型的某级分组下有哪些分组  ***************//
function by_pid_atype_mission() {
	var datas = {
		pid: 0,
		atype: 16
	};
	var url = mmsappurl.more.noteAtype;
	getAjax(url, datas, by_pid_atype_callback, fail_callback);
}

function by_pid_atype_callback(data) {
	if(data.errcode == 0) {
		var data = data.data;
		$.each(data, function(i, e) {
			var dom_customer = '<li id="' + e.id + '" class="mui-table-view-cell">';
			dom_customer += '<a class="mui-navigate-right">' + e.name + '</a></li>';
			$("#otype").append(dom_customer);
		});
	} else {

		mui.toast("获取数据失败")
	}
}
//****************************** more-note ++++++++++++ 发布笔记  *****************************************//
function note_library_mission(getid) {
	var datas = {
		id: getid,
		group_id: $(".mui-selected").attr("id")
	};
	var url = mmsappurl.more.notePublish;
	getAjax(url, datas, note_library_callback, fail_callback);
}
//发布成功
function note_library_callback(data) {
	if(data.errcode == 0) {

		localStorage.setItem(getInterimID + "note-refresh-bool", true);
		mui.toast("发布成功");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	} else {

		mui.toast("发布失败")
	}
}

//**************************** more-directory  ++++++++++++ 获取某个渠道机构下多个客户机构 *********************************//
function cust_orgs_mission() {

	var datas = {
		org_id: getInterimorgid
	};
	var url = mmsappurl.more.custOrgs;
	getAjax(url, datas, cust_orgs_callback, fail_callback);
}

function cust_orgs_callback(data) {

	if(data.errcode == 0) {
		var data = data.data;
		$.each(data, function(i, e) {
			var dom_customer = '<li id="' + e.id + '" dic_listid="true" class="mui-table-view-cell mui-collapse">';
			dom_customer += '<a vstate="' + e.vstate + '" class="mui-navigate-right custom-reset-padding" href="">' + e.name + '</a><div class="mui-collapse-content chnlist"><div class="mui-loading coustom_loading"><div class="mui-spinner"></div></div></div></li>';
			$(".mms-direc .mui-table-view-chevron").append(dom_customer);

		});
		$("li a[vstate=0]").css("opacity", ".5");
		$(".mui-loading").hide();
		$("li a[vstate=0]").parent().removeAttr("id");
		dic_listid();
	} else if(data.errcode == -5102) {

		mui.toast("您还未添加机构和用户")
		$(".mui-loading").hide();
	} else {

		mui.toast("获取数据失败")
		$(".mui-loading").hide();
	}
}
//**************************** more-directory  ++++++++++++获取某个渠道机构下多个客户机构全部用户 *********************************//

function cust_orgs_user_mission(typeid) {
	var datas = {
		org_id: typeid,
		page_size: 999
	};
	var url = mmsappurl.more.custOrgsUser;
	getAjax(url, datas, by_org_user_callback, fail_callback);
}

function by_org_user_callback(data) {

	if(data.errcode == 0) {
		var data = data.data;
		if(data == "") {
			mui.toast("没有更多数据了");
			$(".mui-loading").hide();
			return;
		}
		var dom_customer;
		$.each(data, function(i, e) {
			dom_customer = '<li id="' + e.id + '" class="mui-table-view-cell">'
			switch(e.vstate) {
				case 0:
					dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-red verify_open">启用</i><i class="mui-btn mui-btn-yellow verify_disable">禁用</i></div>'
					dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
					dom_customer += '<h4 class="mui-ellipsis" style="color:red !important">' + e.name + '</h4><h5 class="user-list">'

					break;
				case 1:
					dom_customer += '<div class="mui-slider-right mui-disabled"><a href="../../html/more/html/more-set-user-edit1.html" class="mui-btn mui-btn-red verify_edit">编辑</a><i class="mui-btn mui-btn-yellow verify_disable">禁用</i></div>'
					dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
					dom_customer += '<h4 class="mui-ellipsis">' + e.name + '</h4><h5 class="user-list">'
					break;
				case 2:
					dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-red verify_open">启用</i><i class="mui-btn mui-btn-yellow verify_dele">删除</i></div>'
					dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
					dom_customer += '<h4 class="mui-ellipsis" style="color:#dddddd !important">' + e.name + '</h4><h5 class="user-list">'
					break;
			}
			if(e.my_otypes.length != 0) {
				$.each(e.my_otypes, function(q, v) {
					dom_customer += '<i otypeskey="' + v.key + '">' + v.value + '</i>'
				});
			} else {
				dom_customer += '<i style="width:95px;">没有任何权限</i>'
			}
			dom_customer += '</h5></div><div class="mui-table-cell mui-col-xs-4 mui-text-right"><span class="mui-h5">' + e.phone_no + '</span></div></div></div></li>'
			$("#" + data[0].org_id + " .chnlist").append(dom_customer);

			$(".mui-loading").hide();
			$(".mui-active .coustom_loading").remove();
		});
		verify_operation();
	} else if(data.errcode == -5102) {
		mui.toast("此机构还未通过审核");
		$(".mui-loading").hide();
	} else {

		mui.toast("获取数据失败");
		$(".mui-loading").hide();
	}
	disabledA();
}

//********************************** more-add  ++++++++++++ 获取没有关联任何渠道机构的客户方机构或关联关系不可用 ************************************//
function channel_contacts_mission() {
	var datas = {
		org_id: getInterimorgid
	};
	var url = mmsappurl.more.orgsUnrelated;
	getAjax(url, datas, channel_contacts_callback, fail_callback);
}

function channel_contacts_callback(data) {

	if(data.errcode == 0) {
		var data = data.data;
		if(data == "") {
			mui.toast("暂无可添加的学校机构");
		} else {
			$.each(data, function(i, e) {
				var dom_customer = '<li vstate="' + e.vstate + '" id="' + e.id + '" class="mui-table-view-cell">';
				dom_customer += '<a class="mui-navigate-right">' + e.name + '</a></li>';
				$("#list").append(dom_customer);
			});
			$("li a[vstate=0]").css("opacity", ".5");
		}
	} else {

		mui.toast("获取数据失败");
	}
	$(".mui-loading").hide();
}
//********************************** more-add  ++++++++++++ 添加机构关系 ************************************//
function channel_add_mission(typeid) {

	var datas = {
		cust_id: typeid,
		channel_id: getInterimorgid
	};
	var url = mmsappurl.more.orgsAdd;
	getAjax(url, datas, channel_add_callback, fail_callback);
}

function channel_add_callback(data) {

	if(data.errcode == 0) {
		var data = data.data;
		mui.toast("添加成功，请等待审核");
		setTimeout(function() {
			var prevW = plus.webview.currentWebview().opener();
			prevW.reload(true);
			old_back();
			$(".mui-loading").hide();
		}, 500);
	} else if(data.errcode == -5203) {

		mui.toast("机构关系已存在");
		$(".mui-loading").hide();
	} else {

		mui.toast("获取数据失败");
		$(".mui-loading").hide();
	}
}
//********************************** more-set-user  ++++++++++++ 获取用户管理用户列表 ************************************//
function user_query_mission(indexpage) {

	var datas = {
		org_id: getInterimorgid,
		page_index: indexpage,
		page_size: 999
	};
	var url = mmsappurl.more.orguser;
	getAjax(url, datas, user_query_callback, fail_callback);
}

function user_query_callback(data) {

	if(data.errcode == 0) {
		var data = data.data;
		if(data == "") {
			mui.toast("没有更多数据了");
			$(".mui-loading").hide();
			return;
		}
		var dom_customer;
		$.each(data, function(i, e) {
			dom_customer = '<li id="' + e.id + '" class="mui-table-view-cell">'
			switch(e.vstate) {
				case 0:
					dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-red verify_open">启用</i><i class="mui-btn mui-btn-yellow verify_disable">禁用</i></div>'
					dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
					dom_customer += '<h4 class="mui-ellipsis" style="color:red">' + e.name + '</h4><h5 class="user-list">'

					break;
				case 1:
					dom_customer += '<div class="mui-slider-right mui-disabled"><a href="more-set-user-edit.html" class="mui-btn mui-btn-red verify_edit">编辑</a><i class="mui-btn mui-btn-yellow verify_disable">禁用</i></div>'
					dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
					dom_customer += '<h4 class="mui-ellipsis">' + e.name + '</h4><h5 class="user-list">'
					break;
				case 2:
					dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-red verify_open">启用</i><i class="mui-btn mui-btn-yellow verify_dele">删除</i></div>'
					dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
					dom_customer += '<h4 class="mui-ellipsis" style="color:#dddddd">' + e.name + '</h4><h5 class="user-list">'
					break;
			}
			if(e.my_otypes.length != 0) {
				$.each(e.my_otypes, function(q, v) {
					dom_customer += '<i otypeskey="' + v.key + '">' + v.value + '</i>'
				});
			} else {
				dom_customer += '<i style="width:95px;">没有任何权限</i>'
			}
			dom_customer += '</h5></div><div class="mui-table-cell mui-col-xs-4 mui-text-right"><span class="mui-h5">' + e.phone_no + '</span></div></div></div></li>'
			$(".user_list_chn").append(dom_customer);

			$(".mui-loading").hide();
			//			deceleration();
		});
		verify_operation();
	} else {

		mui.toast("获取数据失败");
		$(".mui-loading").hide();
	}
}

function verify_operation() {
	//用户管理启用功能
	$(".verify_open").on("tap", function() {
		var username = $(this).parent().next().find("h4").text();
		var id = $(this).parents("li").attr("id");
		verify(1, id, username);
	});
	//用户管理禁用功能
	$(".verify_disable").on("tap", function() {
		var username = $(this).parent().next().find("h4").text();
		var id = $(this).parents("li").attr("id");
		verify(2, id, username);
	});
	//用户管理删除功能
	$(".verify_dele").on("tap", function() {
		var username = $(this).parent().next().find("h4").text();
		var id = $(this).parents("li").attr("id");
		var btnArray = ['否', '是'];
		mui.confirm('您确定删除用户' + username + '吗？', '新中新运维云平台', btnArray, function(e) {
			if(e.index == 1) {
				verify(4, id, username);
			} else {
				mui.toast("已取消删除");
			}
		})
	});
}

function verify(vstate, id, username) {

	var data = {
		user_id: id,
		operator_id: getInterimID,
		vstate: vstate
	};
	var url = mmsappurl.more.orgDel;
	getAjax(url, data, chn_verify_callback, fail_callback);

	function chn_verify_callback(data) {

		if(data.errcode == 0) {
			mui.toast("您对" + username + "用户操作成功");
			window.location.reload();
		} else {

			mui.toast("您对" + username + "用户操作过程失败");
		}
	}
}
//********************************** more-set-user-edit  ++++++++++++ 提交编辑用户   ************************************//限
function modify_otype_mission(getid, otykey) {

	var datas = {
		user_id: getid,
		operator_id: getInterimID,
		otype: otykey
	};
	var url = mmsappurl.more.modifyOtype;
	getAjax(url, datas, modify_otype_callback, fail_callback);
}

function modify_otype_callback(data) {
	if(data.errcode == 0) {
		mui.toast("编辑用户信息成功");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	} else {

		mui.toast("提交信息失败")
	}
}