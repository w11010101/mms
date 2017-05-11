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
//		mui("#list .mui-active")[0].appendChild(mmsNothing());
	}
	mui(".mui-active .mui-loading")[0].style.display = "none";
}
// 服务列表dom
function service_list_dom(data) {
	
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell", "mui-media");
	createLi.setAttribute("passval_id", data.id);
	var task = task_icon(data.state);
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
/*
=============  补充说明  ============= 
*/

function service_supplement(path){
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
		old_back();
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
		mtype: mui(".mui-title")[0].innerHTML == "报修单"?1:2,
		req_org_id: getInterim.org_id,
		builder: getInterimID,
		requester: getInterimID,
		target_type: mui(".mui-content .mui-active")[0].getAttribute("id") == "item1mobile"?0:1,
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
			
			// prevW.reload(true);
			mui.fire(prevW.children()[0],"currentReFresh",{
				type:mui(".mui-title")[0].innerHTML == "报修单"?1:2,
			})
			mui.later(function(){
				old_back();
			},1000);
		}else{
			mui.toast('保存失败');
			queryElement(".mask-layer").style.display = "none";
		}
	}
}
// 服务任务提交
function ser_submit(path){
	queryElement(".mask-layer").style.display = "block";
	var urls = mmsappurl.service.Submit;
	
	var datas = {
		id: ser_task_id?ser_task_id:"",
		mtype: mui(".mui-title")[0].innerHTML == "报修单"?1:2,
		req_org_id: getInterim.org_id,
		builder: getInterimID,
		requester: getInterimID,
		target_type: mui(".mui-content .mui-active")[0].getAttribute("id") == "item1mobile"?0:1,
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
			setTimeout(function(){
				old_back();
				
			},1000)
		}else{
			mui.toast('提交失败');
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
				requester_id:getInterimID,
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