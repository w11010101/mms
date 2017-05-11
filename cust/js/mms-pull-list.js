// 草稿箱列表
function ser_draft_list(type, pages) {
	if(!pages) {
		pages = 0;
	}
	var urls = mmsappurl.service.drafts;
	var datas = {
		mtype: type,
		builder_id: getInterimID,
		page_index: 0,
		page_size: 999,
	}
	getAjax(urls, datas, ser_draft_list_success);

	function ser_draft_list_success(data) {
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
