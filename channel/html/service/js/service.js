mui.init();
var sessin_pages = 0;
var service_obj = {
	setState: queryElement("body"),
	screen_out:mui("#ser-condition"),
	icon_filter:queryElement(".icon-filter"),
	screen_box:queryElement("#topPopover"),
};

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
							mui.each(mui("#list .mui-active li"),function(i,e){
								e.remove();
							})
							
							parameter.page_index = 0;
							parameter.mtype = mui("#list .mui-active ul")[0].getAttribute("mtype");
							parameter.state = service_obj.setState.getAttribute("state");
							
							service_list(parameter);
							
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
							var this_active = mui("#list .mui-active ul")[0];
							var getPage = parseInt(this_active.getAttribute("pages"));
								this_active.setAttribute("pages",++getPage);
								
								parameter.name = "";
								parameter.page_index = getPage;
								parameter.state = service_obj.setState.getAttribute("state");
							
								service_list(parameter);
//							
							$(document).imageLazyload({
								placeholder: 'images/60x60.gif'
							});
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
	
})(mui);


function service_list(param) {

	service_obj.setState.setAttribute("state", param.state);
	var urls = mmsappurl.service.serviceList;
	getAjax(urls, param, service_seach_callback, fail_callback);
}
var stateval = "";

function service_seach_callback(data) {
	var data = data.data;
	if(data.length>0){
		mui.each(data, function(i, e) {
			mui("#list .mui-active ul")[0].appendChild(service_list_dom(e));
		})
	}else{
		mui(".mui-active .mui-pull-bottom-tips")[0].style.display = "none";
		mui.toast('没有更多数据！');
	}
	mui(".mui-active .mui-loading")[0].style.display = "none";
}
// 服务列表dom
function service_list_dom(data) {
	
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell", "mui-media");
	createLi.setAttribute("passval_id", data.id);
	var task = next_operation(data.next_operation,data.state,data)												   
	var add_dom = "";
	add_dom += '<a class="coustom-position" href="ser-progress.html"><i class="icon-level">' + data.priority + '</i>';
	add_dom += '<img class="mui-media-object mui-pull-left" src="' + task[0] + '"><div class="mui-media-body"><div class="mui-table">';
	add_dom += '<h4 class="mui-table-cell mui-col-xs-9 mui-ellipsis">' + data.name + '</h4></div>';
	add_dom += '<p class="mui-h6 mui-ellipsis">' + get_date(data.update_time) + '</p></div></a>';
	add_dom += task[1];
	createLi.innerHTML = add_dom;
						
	return createLi;
}

function task_icon(state) {
	var state_arr = new Array;
	switch(state) {
		case 2:
			state_arr[0] = "../img/icon5.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已申请</i></li>';
			break;
		case 4:
			state_arr[0] = "../img/icon6.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已受理</i></li>';
			break;
		case 8:
			state_arr[0] = "../img/icon7.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已分配</i></li>';
			break;
		case 16:
			state_arr[0] = "../img/icon8.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >执行中</i></li>';
			break;
		case 32:
			state_arr[0] = "../img/icon9.png";
			state_arr[1] = '<a class="serivce-pass" execute-type="task-accept" href="ser-finish.html" ><button class="service-li-a">确认</button></a></li>';
			break;
		case 64:
			state_arr[0] = "../img/icon10.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >完成</i></li>';
			break;
		default:
			break;
	}
	return state_arr;
}
//**** service  ++++++++++++ 任务下一步操作 ****//
var server_state_img = new Array;
function next_operation(operation, mstate,data) {
	switch(operation) {
		case 0:
			return mission_state(mstate);
		case 1:
			server_state_img[0] = "../img/icon5.png";
			server_state_img[1] = '<a icon="1" class="serivce-pass" execute-type="task-accept" href="ser-operation.html" ><button class="service-li-a">受理</button></a></li>';
			return server_state_img;
		case 2:
			server_state_img[0] = "../img/icon6.png";
			server_state_img[1] = '<a icon="2" class="serivce-pass" execute-type="task-accept" href="ser-operation.html" ><button class="service-li-a">分配</button></a></li>';
			return server_state_img;
		case 4:
			server_state_img[0] = "../img/icon7.png";
			server_state_img[1] = '<a icon="4" class="serivce-pass" execute-type="task-accept" href="ser-operation.html" ><button class="service-li-a">执行</button></a></li>';
			return server_state_img;
		case 8:
			server_state_img[0] = "../img/icon8.png";
			server_state_img[1] = '<a icon="8" class="serivce-pass" execute-type="task-accept" href="ser-sure.html" ><button class="service-li-a">执行完成</button></a></li>';
			return server_state_img;
		default:
			return mission_state(mstate);
	}
}

function mission_state(mstate) {
	switch(mstate) {
		case 2:
			server_state_img[0] = "../img/icon5.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已申请</i></li>';
			return server_state_img;
		case 4:
			server_state_img[0] = "../img/icon6.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已受理</i></li>';
			return server_state_img;
		case 8:
			server_state_img[0] = "../img/icon7.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已分配</i></li>';
			return server_state_img;
		case 16:
			server_state_img[0] = "../img/icon8.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >执行中</i></li>';
			return server_state_img;
		case 32:
			server_state_img[0] = "../img/icon9.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >待确认</i></li>';
			return server_state_img;
		case 64:
			server_state_img[0] = "../img/icon10.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >完成</i></li>';
			return server_state_img;
		default:
			server_state_img[0] = "../img/icon5.png";
			server_state_img[1] = '<i style="border:none;" execute-type="task-accept" >--</i></li>';
			return server_state_img;
	}
}
/*
=============  补充说明  ============= 
*/

function service_supplement(path){
	queryElement(".mask-layer").style.display = "block";
	var urls = mmsappurl.service.remark;
	var datas = {
		mid: queryElement("body").getAttribute("ser_id"), //任务id
		operator_id: getInterimID, //操作者id
		content: queryElement("textarea").value+"---"+getInterim.name,
		img_urls: path //图片地址（多个地址用'|'分隔）
	}
	
	getAjax(urls, datas, service_supplement_success, fail_callback);
	function service_supplement_success(data){
		mui(".mask-layer .mui-loading div")[0].classList.remove("mui-spinner");
		mui(".mask-layer .mui-loading div")[0].classList.add("spinner-finish");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		mui.later(function(){
			old_back(); 
		},1000)
		
	}
}
/*
=============  待确认  ============= 
*/
// 已解决

function ser_solve(datas){
	var urls = mmsappurl.service.confirm;
	getAjax(urls,datas,ser_solve_success);
	function ser_solve_success(data){
		if(!data.errcode){
			mui.toast("确认完毕");
			mui.later(function(){
//				jump("service.html");
				var prevW = plus.webview.currentWebview().opener();
				prevW.reload(true);
				old_back();
			},2000);
		}else{
			mui.toast("提交失败");
		}
	}
}

// 未解决
function ser_noSolve(path){
	var urls = mmsappurl.service.noSolve;
	var noSolve_parameter = {};
	noSolve_parameter.mid = mui("body")[0].getAttribute("passval-id");
	noSolve_parameter.mstate = 0;
	noSolve_parameter.operator_id = getInterimID;
	noSolve_parameter.content = mui(".mui-active textarea")[0].value;
	noSolve_parameter.img_urls = path?path:" ";
	getAjax(urls,noSolve_parameter,ser_noSolve_success);
	function ser_noSolve_success(data){		
		if(!data.errcode){
			mui(".mask-layer .mui-loading div")[0].classList.remove("mui-spinner");
			mui(".mask-layer .mui-loading div")[0].classList.add("spinner-finish");
			mui.toast("确认完毕");
			mui.later(function(){
//				jump("service.html");
				var prevW = plus.webview.currentWebview().opener();
				prevW.reload(true);
				old_back();
			},2000);
		}else{
			mui.toast("提交失败");
		}
	}
}
// 保存草稿箱
function ser_saveDraft(path){
	queryElement(".mask-layer").style.display = "block";
	var urls = mmsappurl.service.build;
	var datas = {
		id: ser_task_id?ser_task_id:"",
		mtype: mui("#servicetypeval")[0].innerHTML == "运维报修"?1:2,
		req_org_id: $("#serviceschoolval").attr("name_id"),
		builder: getInterimID,
		requester: $("#serviceaplval").attr("org_id"),
		target_type: mui("#servicecateval")[0].innerHTML == "系统"?0:1,
		target_name: mui(".mui-active input[type=text]")[0].value,
		description: mui(".mui-active textarea")[0].value,
		img_urls: path
	}
	
	getAjax(urls,datas,ser_saveDraft_success);
	function ser_saveDraft_success(data){
		if(data.errcode == 0){
			mui(".mask-layer .mui-loading div")[0].classList.remove("mui-spinner");
			mui(".mask-layer .mui-loading div")[0].classList.add("spinner-finish");
			mui.toast("保存草稿成功");
			
			var prevW = plus.webview.currentWebview().opener();

			mui.fire(prevW.children()[0],"currentReFresh",{
				type:"draft"
			})
			mui.later(function(){
				old_back();
			},1000);
		}else{
			mui.toast('保存失败');
			queryElement(".mask-layer").style.display = "block";
		}
	}
}

// 筛选
function service_screen(){
	service_obj.icon_filter.addEventListener("tap",function(){
		service_obj.screen_out.off("tap").on("tap","a",function(){
			var parameter = {
				page_index:0,
				mtype:mui("#list .mui-active ul")[0].getAttribute("mtype"),
				state:this.parentElement.getAttribute("id"),
				executor_id:getInterimID,
				page_size: 10
			}
			var this_box = mui("#list .mui-active ul li");
			mui.each(this_box,function (i,e) {
				e.remove();
			})
			service_list(parameter);
			service_obj.screen_box.style.display = "none";
			service_obj.screen_box.classList.remove("mui-active");
			queryElement(".mui-backdrop").remove();
			// 给body 添加属性，是为设置后续的上拉和下拉所获得的里列表的分类
			service_obj.setState.setAttribute("state",this.parentElement.getAttribute("id"));
		})
	})
}

/*
 * 任务步骤
 */
//**** ser-operation  ++++++++++++ 根据id获取受理任务信息   根据id获取分配任务信息  根据id获取执行任务信息   根据id执行完成任务信息  ****//
function service_mission(getType) {
	
	var datas = {
		id: getType
	};
	var url = mmsappurl.service.serMission;
	getAjax(url, datas, service_mission_callback, fail_callback);
}

function service_mission_callback(data) {
	
	if(data.errcode == 0){
	var data = data.data;
		document.getElementById("name").innerText=data.requester_name || "未查找到发布人";
		document.getElementById("time").innerText="发表于：" + get_date(data.request_time,"ymdhm");
		document.getElementById("content").innerText=data.description
	}else{
		
		mui.toast("获取数据失败")
	}
}

// 服务任务提交
function ser_submit(path){
	queryElement(".mask-layer").style.display = "block";
	var urls = mmsappurl.service.Submit;
	var datas = {
		id: ser_task_id?ser_task_id:"",
		mtype: mui("#servicetypeval")[0].innerHTML == "运维报修"?1:2,
		req_org_id: $("#serviceschoolval").attr("name_id"),
		builder: getInterimID,
		requester: $("#serviceaplval").attr("org_id"),
		target_type: mui("#servicecateval")[0].innerHTML == "系统"?0:1,
		target_name: mui(".mui-active input[type=text]")[0].value,
		description: mui(".mui-active textarea")[0].value,
		img_urls: path
	}
	getAjax(urls,datas,ser_submit_success);
	function ser_submit_success(data){
		if(data.errcode == 0){
			mui(".mask-layer .mui-loading div")[0].classList.remove("mui-spinner");
			mui(".mask-layer .mui-loading div")[0].classList.add("spinner-finish");
			mui.toast("提交成功");
			var prevW = plus.webview.currentWebview().opener().opener();
			mui.later(function(){
				old_back();
			},500)
			
		}else{
			mui.toast('提交失败');
			queryElement(".mask-layer").style.display = "none";
		}
	}
}

/*
 * 服务相关步骤操作
 */
//******************************** ser-operation  ++++++++++++ 任务操作-受理任务  ******************************//
function service_accept_mission(getType,namevalue) {
	var datas = {
		mid: getType,
		operator_id: getInterimID,
		priority:namevalue
	};
	
	var url = mmsappurl.service.serAccept;
	getAjax(url, datas, service_accept_mission_callback, fail_callback);
}
//优先级
function service_accept_mission_callback(data) {
	if(data.errcode == 0){
		mui.toast("任务已受理");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	}else if(data.errcode==-5100){
		
		mui.toast("任务已经受理");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	}else{
		
		mui.toast("任务受理失败");
	}
}

//****  ser-operation  ++++++++++++ 根据id获取分配任务信息人员列表  ****//

function allot_by_org_otype() {
	var datas = {
		org_id: getInterimorgid,
		otype: 16
	};
	var url = mmsappurl.service.serOrgOtype;
	getAjax(url, datas, allot_by_org_otype_callback, fail_callback);
}

function allot_by_org_otype_callback(data) {
	if(data.errcode == 0){
		var data = data.data;
		mui.each(data,function (index,element) {
			mui("#otype_allot_list")[0].appendChild(org_otype_html(element));
		});
		$("#otype_allot_list .mui-checkbox").on("tap", function() {
			$(this).toggleClass("checked");
		});
	}else{
		
		mui.toast("人员列表获取失败")
	}
}
function org_otype_html(e){
	var createDiv = createElement("div");
	createDiv.classList.add("mui-input-row","mui-checkbox","mui-left");
	createDiv.setAttribute("libId",e.id);
	createDiv.innerHTML = '<label>' + e.name + '</label><input name="checkbox" value="Item 1" type="checkbox" >'
	
	return createDiv;
}

//**** task-allocation  ++++++++++++ 任务操作-受理任务  ****//
function service_allot_mission(getType, val,namevalue) {
	var datas = {
		mid: getType,
		operator_id: getInterimID,
		next_operators: val,
		priority:namevalue
	};
	
	var url = mmsappurl.service.serAllot;
	getAjax(url, datas, service_allot_callback, fail_callback);
}

function service_allot_callback(data) {
	if(data.errcode == 0){
		mui.toast("任务已分配");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	}else{
		
		mui.toast("任务受理失败");
		$(".mask-layer").hide(0);
	}
}
//**** task-implement  ++++++++++++ 任务操作-执行任务  ****//
function service_aexecute_start(getType) {
	var datas = {
		mid: getType,
		operator_id: getInterimID
	};
	var url = mmsappurl.service.serExecute;
	getAjax(url, datas, service_execute_startn_callback, fail_callback);
}

function service_execute_startn_callback(data) {
	if(data.errcode == 0){
		mui.toast("任务开始执行");
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	}else{
		
		mui.toast("任务操作失败");
		$(".mask-layer").hide(0);
	}
}

//***** ser-sure ++++++++++++   执行完成  ********************************//
function sersure_executed(path){
	
	var datas = {
		mid: queryElement("body").getAttribute("sid"), // 任务id,
		operator_id: getInterimID, // 操作者id,
		process: queryElement("textarea").value+ "，操作人："+getInterimName, // 处理过程,
		img_urls: path // 图片地址（多个地址用 '|' 分隔）
	}
	
	var url = mmsappurl.service.serExecuted;
	getAjax(url, datas, serExecuted_callback, fail_callback);
}
function serExecuted_callback(data){
	
	if(data.errcode == 0){
		var prevW = plus.webview.currentWebview().opener();
		prevW.reload(true);
		old_back();
	}else{
		
		mui.toast("任务操作失败");
		$(".mask-layer").hide(0);
	}
}
/*
 * 获取学校机构列表
 */
function cust_orgs_executed() {
	var datas = {
		org_id: getInterimorgid,
	};
	var url= mmsappurl.more.custOrgs;
	getAjax(url, datas, cust_orgs_callback, fail_callback);
}

function cust_orgs_callback(data) {
	var data = data.data;
	$.each(data, function(i, e) {
		var dom = '<li school_id="' + e.id + '" idval="serviceschoolval" class="mui-table-view-cell mui-media">';
		dom += '<div class="mui-media-body">' + e.name + '</div></li>';
		
		$("#serviceschoollist").append(dom);
	});
	$("#serviceschool .mui-loading,#serviceapl .mui-loading").hide(0);
	
}
/*
 * 获取申请人列表
 */
function by_org_id(list_id) {
	var datas = {
		org_id: list_id,
		page_size:999,
	};

	var url = mmsappurl.service.serOrgContacts;
	getAjax(url, datas, by_org_id_callback, fail_callback);
}

function by_org_id_callback(data) {
	var data = data.data;
	if(data.length>0){
		$.each(data, function(i, e) {
			
			var dom_customer = '<li org_id="' + e.id + '" idval="serviceaplval" class="mui-table-view-cell mui-media">';
			dom_customer += '<div class="mui-media-body">' + e.name + '</div></li>';
			$("#serviceapllist").append(dom_customer);
		});
		$("#serviceaplval").text($("#serviceapllist li:nth-child(1)").text());
		$("#serviceaplval").attr("org_id", $("#serviceapllist li:nth-child(1)").attr("org_id"));
	}else{
		$("#serviceaplval").text("");
	};
}