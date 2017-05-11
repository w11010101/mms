// 草稿箱列表
function ser_draft_list(type, pages) {
	if(!pages) {
		pages = 0;
	}
	var urls = mmsappurl.service.drafts;
	// 获取所有的草稿箱
	var datas = {
		builder_id: getInterimID,
		page_size:999
	}
	console.log(JSON.stringify(datas))
	getAjax(urls, datas, ser_draft_list_success);

	function ser_draft_list_success(data) {
		console.log(JSON.stringify(data))
		var getData = data.data;
		if(data.errcode == 0) {
			if(getData.length) {
				for(var x = 0; x < getData.length; x++) {
					mui(".mui-table-view")[0].appendChild(get_lists(getData[x]));
				}
			} else {
				mui.toast('暂无数据');
			}
			// 删除草稿
			del_btn();
			// 列表点击
			ser_list_tap();
		} else {
			mui.toast('获取数据失败');
		}
	}
}

function get_lists(e) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell");
	createLi.setAttribute("thisID", e.id);
	createLi.setAttribute("mtype", e.mtype);
	createLi.setAttribute("target_type", e.target_type);
	var createDivDel = createElement("div");
	createDivDel.classList.add("mui-slider-right", "mui-disabled");
	var createA = createElement("a");
	createA.classList.add("mui-btn", "mui-btn-red");
	createA.innerHTML = "删除";
	createDivDel.appendChild(createA);
	//**************************************
	var createDiv = createElement("div");
	createDiv.classList.add("mui-slider-handle", "mui-media-body");
	var createAHref = createElement("a");
	createLi.setAttribute("href", "../../html/service/html/ser-submit.html");
	createAHref.innerHTML = e.name;
	var createSpan = createElement("span");
	createSpan.classList.add("mui-pull-right");
	createSpan.innerHTML = get_date(e.update_time);
	createDiv.appendChild(createAHref);
	createDiv.appendChild(createSpan);
	//**************************************
	createLi.appendChild(createDivDel);
	createLi.appendChild(createDiv);
	return createLi;
}

// 删除草稿
function del_btn() {
	var btnArray = ['确认', '取消'];
	mui(".mui-disabled").on("tap", ".mui-btn-red", function() {
		var that = this;
		var this_p = this.parentElement.parentElement;
		var thisID = this_p.getAttribute("thisID");

		mui.confirm('确认删除该条记录？', '删除草稿', btnArray, function(e) {
			if(e.index == 0) {
				// 确定
				

				this_p.style.display = "none";
				del_draft(thisID.split("-")[thisID.split("-").length - 1]);

			} else {
				// 取消
				
			}
		});
	})
}

function del_draft(ids) {
	var ids_arr = new Array;
	ids_arr[ids_arr.length] = ids;
	var urls = mmsappurl.service.delDrafts;
	//	var urls = mmscusapi + "mms_cus_mission_operate/delete_drafts";
	var datas = {
		builder_id: getInterimID,
		ids: ids_arr
	}
	getAjax(urls, datas, del_draft_success, fail_callback);

	function del_draft_success(data) {
		if(data.errcode == 0) {
			mui.toast('删除成功');
		} else {
			mui.toast('删除失败');
		}
	}

}

// 服务功能的部分点击
function ser_list_tap() {
	mui("ul").off("tap").on("tap", "li", function() {
		set_parameter(this, "list");
	});
	mui(".mui-bar").off("tap").on("tap", "a", function() {
		set_parameter(this, "title");
	})

	function set_parameter(obj, type) {
		var page_parameter = {};
		var page_name = obj.getAttribute("mtype") == 1 ? "报修单" : "需求单";
		if(type == "list") {
			page_parameter.thisID = obj.getAttribute("thisID");
			page_parameter.mtype = obj.getAttribute("mtype");
		}
		page_parameter.page_name = page_name;
		localStorage.setItem("draft", obj.getAttribute("target_type"));
		if(~obj.getAttribute("href").indexOf(".html")){
			jump(obj.getAttribute("href"), page_parameter);
		}
		
	}
}

/**************************************************************************
 *会话组
 *
 * */
function mms_chat_list(pages) {
	var urls = mmsappurl.more.chatGroup;
	var datas = {
		receiver_id: getInterimID,
		page_index: pages,
		page_size: 10
	}
	getAjax(urls, datas, mms_chat_list_success);

	function mms_chat_list_success(data) {
		var getData = data.data;
		if(data.errcode == 0) {
			if(getData.length) {
				for(var x = 0; x < getData.length; x++) {
					mui(".mui-table-view")[0].appendChild(get_chat_html(getData[x]));
				}
			} else {
				mui.toast('暂无数据');
			}
			// 列表点击
			get_chatList_tap();
		} else {
			mui.toast('获取数据失败');
		}
	}
}

function get_chat_html(data) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell", "mui-media");
	var createA = createElement("a");
	createA.setAttribute("href", "../../html/msg/html/msg-chat.html");
	createA.setAttribute("getids", data.id);
	createA.innerHTML = '<img class="mui-media-object mui-pull-left" src="../../html/msg/img/icon16.png"><div class="mui-media-body">' + data.title + '</div>'
	createLi.appendChild(createA);
	return createLi;
}

function get_chatList_tap() {
	mui("ul").off("tap").on("tap", "a", function() {

		jump(this.getAttribute("href"), { msg_chat_id: this.getAttribute("getids"),msg_chat_title:this.querySelector(".mui-media-body").innerHTML });
	});
}
/**************************************************************************
 * 我的笔记
 *
 * */
///********************************** more-note  ++++++++++++ 获取笔记列表 ************************************//
function get_note(pages) {
	var datas = {
		user_id: getInterimID,
		page_index: pages,
		page_size: 8
	};
	var urls = mmsappurl.more.note;
	getAjax(urls, datas, note_query_id_callback, fail_callback);
}

function note_query_id_callback(data) {
	if(data.errcode == 0){
		var data = data.data;
		if(data == ""){
			mui.toast("没有更多数据了");
			$(".mui-loading").hide();
			return;
		}
		$.each(data, function(i, e) {
			var dom_customer = '<li is_public="' + e.is_public + '" id="' + e.id + '" class="mui-table-view-cell note"><div class="mui-slider-right mui-disabled">';					 
			dom_customer += '<a class="mui-btn mui-btn-red">删除</a><a class="mui-btn mui-btn-yellow">发布</a></div>'
			dom_customer += '<div class="mui-table mui-slider-handle"><div class="mui-table-cell mui-col-xs-8"><h4 class="mui-ellipsis">' + e.title + '</h4></div>'
			dom_customer += '<div class="mui-table-cell mui-col-xs-4 mui-text-right"><p class="mui-h5">' + get_date(e.update_time,"mdhm") + '</p></div></div></li>'
			$(".mui-table-view-chevron").append(dom_customer);
		});
		$(".mui-loading").hide();
		$(".mui-table-view-chevron li[is_public=true]").css("background-color", "#fefef8");
		note_delete();
		edit_noto();
		note_library();
	}else{
		
		mui.toast("获取数据失败")
		$(".mui-loading").hide();
	}
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
		localStorage.setItem(getInterimID+"note-refresh-bool",true);
		$("#note_title").val("");
		$("#cntent").text("");
		var prevW = plus.webview.currentWebview().opener();
		mui.fire(prevW.children()[0],"currentReFresh",{
			type:"note"
		});
		mui.later(function(){
			old_back();
		},500)
		
		
	}else{
		
		mui.toast("添加笔记失败");
		$(".mask-layer").hide(0);
	}
}
//添加失败
function note_add_fail_callback(data) {
	
	var data = data.data;
	mui.toast("添加笔记失败");
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
				aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
				duration:300
			}
		})
	});
};
//点击发布
function note_library() {
	$(".mui-btn-yellow").on("tap", function() {
		console.log("13213212")
		mui.openWindow({
			url: "../../html/more/html/more-note-select.html",
//			createNew: true,
			show: {
				aniShow: "正在跳转",
				aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
				duration:300
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
	$('.mui-table-view-chevron .mui-btn-red').off("tap").on('tap', function(event) {
		
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
	
	if(data.errcode == 0){
		var data = data.data;
		$("#title").val(data.title);
		$("#time").text( get_date(data.update_time,"ymdhm"));
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
	}else{
		
		mui.toast("获取数据失败")
	}
}
//****************************** more-note ++++++++++++ 删除笔记  *****************************************//
function note_delete_mission(note_id) {
	var datas = {
		id: note_id
	};
	
	var url = mmsappurl.more.delNote;
	getAjax(url, datas, note_delete_callback, fail_callback);
}
//删除成功
function note_delete_callback(data) {
	if(data.errcode == 0){
		mui.toast("删除成功");
	}else{
		mui.toast("删除数据失败")
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
	if(data.errcode == 0){
		var data = data.data;
		$.each(data, function(i, e) {
			var dom_customer = '<li id="' + e.id + '" class="mui-table-view-cell">';
			dom_customer += '<a class="mui-navigate-right">' + e.name + '</a></li>';
			$("#otype").append(dom_customer);
		});
	}else{
		
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
	if(data.errcode == 0){
		
		localStorage.setItem(getInterimID+"note-refresh-bool",true);
		mui.toast("发布成功");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	}else{
		
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
	if(data.errcode == 0){
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
	}else if(data.errcode == -5102){
		
		mui.toast("您还未添加机构和用户")
		$(".mui-loading").hide();
	}else{
		
		mui.toast("获取数据失败")
		$(".mui-loading").hide();
	}
}
//**************************** more-directory  ++++++++++++获取某个渠道机构下多个客户机构全部用户 *********************************//

function cust_orgs_user_mission(typeid) {
	var datas = {
		org_id: typeid,
		page_size:999
	};
	var url = mmsappurl.more.custOrgsUser;
	getAjax(url, datas, by_org_user_callback, fail_callback);
}
	
function by_org_user_callback(data) {
	
	if(data.errcode == 0){
		var data = data.data;
		if(data == ""){
			mui.toast("没有更多数据了");
			$(".mui-loading").hide();
			return;
		}
		var dom_customer;
		$.each(data, function(i, e) {
			dom_customer = '<li id="' + e.id + '" class="mui-table-view-cell">'
			switch (e.vstate){
				case 0: dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-yellow verify_open">启用</i><i class="mui-btn mui-btn-red verify_disable">禁用</i></div>'
						dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
						dom_customer += '<h4 class="mui-ellipsis" style="color:red !important">' + e.name + '</h4><h5 class="user-list">'	
						
					break;
				case 1: dom_customer += '<div class="mui-slider-right mui-disabled"><a href="../../html/more/html/more-set-user-edit1.html" class="mui-btn mui-btn-yellow verify_edit">编辑</a><i class="mui-btn mui-btn-red verify_disable">禁用</i></div>'
						dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
						dom_customer += '<h4 class="mui-ellipsis">' + e.name + '</h4><h5 class="user-list">'
					break;
				case 2: dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-yellow verify_open">启用</i><i class="mui-btn mui-btn-red verify_dele">删除</i></div>'
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
	}else if(data.errcode == -5102){
		mui.toast("此机构还未通过审核");
		$(".mui-loading").hide();
	}else{
		
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
	
	if(data.errcode == 0){
		var data = data.data;
		if(data == ""){
			mui.toast("暂无可添加的学校机构");
		}else{
			$.each(data, function(i, e) {
				var dom_customer = '<li vstate="' + e.vstate + '" id="' + e.id + '" class="mui-table-view-cell">';
				dom_customer += '<a class="mui-navigate-right">' + e.name + '</a></li>';
				$("#list").append(dom_customer);
			});
			$("li a[vstate=0]").css("opacity", ".5");
		}
	}else{
		
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
	
	if(data.errcode == 0){
		var data = data.data;
		mui.toast("添加成功，请等待审核");
		setTimeout(function() {
			var prevW = plus.webview.currentWebview().opener();
			prevW.reload(true);
			old_back();
			$(".mui-loading").hide();
		}, 500);
	}else if(data.errcode==-5203){
		
		mui.toast("机构关系已存在");
		$(".mui-loading").hide();
	}else{
		
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
	
	if(data.errcode == 0){
		var data = data.data;
		if(data == ""){
			mui.toast("没有更多数据了");
			$(".mui-loading").hide();
			return;
		}
		var dom_customer;
		$.each(data, function(i, e) {
			dom_customer = '<li id="' + e.id + '" class="mui-table-view-cell">';
			switch (e.vstate){
				case 0: dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-yellow verify_open">启用</i><i class="mui-btn mui-btn-red verify_disable">禁用</i></div>'
						dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
						dom_customer += '<h4 class="mui-ellipsis" style="color:red">' + e.name + '</h4><h5 class="user-list">'	
						
					break;
				case 1: dom_customer += '<div class="mui-slider-right mui-disabled"><a href="more-set-user-edit.html" class="mui-btn mui-btn-yellow verify_edit">编辑</a><i class="mui-btn mui-btn-red verify_disable">禁用</i></div>'
						dom_customer += '<div class="mui-slider-handle"><div class="mui-table"><div class="mui-table-cell mui-col-xs-8">'
						dom_customer += '<h4 class="mui-ellipsis">' + e.name + '</h4><h5 class="user-list">'
					break;
				case 2: dom_customer += '<div class="mui-slider-right mui-disabled"><i class="mui-btn mui-btn-yellow verify_open">启用</i><i class="mui-btn mui-btn-red verify_dele">删除</i></div>'
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
			deceleration();
		});
		verify_operation();
	}else{
		
		mui.toast("获取数据失败");
		$(".mui-loading").hide();
	}
}

function verify_operation(){
	//用户管理启用功能
	$(".verify_open").on("tap",function(){
		var username = $(this).parent().next().find("h4").text();
		var id = $(this).parents("li").attr("id");
		verify(1,id,username);
	});
	//用户管理禁用功能
	$(".verify_disable").on("tap",function(){
		var username = $(this).parent().next().find("h4").text();
		var id = $(this).parents("li").attr("id");
		verify(2,id,username);
	});
	//用户管理删除功能
	$(".verify_dele").on("tap",function(){
		var username = $(this).parent().next().find("h4").text();
		var id = $(this).parents("li").attr("id");
		var btnArray = ['否', '是'];
		mui.confirm('您确定删除用户' + username + '吗？', '新中新运维云平台', btnArray, function(e) {
			if(e.index == 1) {
				verify(4,id,username);
			} else {
				mui.toast("已取消删除");
			}
		})
	});
}
function verify(vstate,id,username){

	var data = {
		user_id:id,
		operator_id:getInterimID,
		vstate:vstate
	};
	var url =  mmsappurl.more.orgDel;
	getAjax(url, data, chn_verify_callback, fail_callback);
		
	function chn_verify_callback(data){
		
		if(data.errcode == 0){
			mui.toast("您对" + username + "用户操作成功");
			window.location.reload();
		}else{
			
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
	if(data.errcode == 0){
		mui.toast("编辑用户信息成功");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	}else{
		
		mui.toast("提交信息失败")
	}
}