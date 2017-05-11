/**************************************************************************
 * 搜索
 * */
// 搜索类型 分为 服务， 手册，常见问题，知识库等，会话组等；
function search_type(parameter) {
	var searchType = parameter.search_type;
	var urls = "";
	switch(searchType) {
		case "service":
			urls = mmsappurl.service.serviceList;
			break;
		case "manual":
			urls = mmsappurl.more.titleManual;
			delete parameter.page_index;
			break;
		case "faq":
			urls = mmsappurl.more.titleFaq;
			delete parameter.page_index;
			break;
		case "lib":
			urls = mmsappurl.more.titleLibrary;
			delete parameter.page_index;
			break;
		default:
			break;
	}
	get_search_list(urls, parameter, searchType);
}
// 区分不同搜索类型的方法，传参type；如服务的搜索：service；如会话组的搜索：chat；然后在调用getAajax（）；
function get_search_list(urls, parameter, type) {
	//	delete parameter.search_type;

	getAjax(urls, parameter, get_search_list_success, get_search_list_fail);
	// 获取搜索结果成功
	function get_search_list_success(data) {

		if(!data.errcode) {
			var getData = data.data;
			var html;
			queryElement(".mui-table-view").classList.remove("mui-table-view-chevron");
			switch(type) {
				case "service": // 服务
					// 插入相应的css样式文件
					queryElement("head").appendChild(add_link(type));
					queryElement("body").classList.add("service");
					search_html_service(getData);
					break;
				case "manual": // 产品手册
					queryElement("head").appendChild(add_link(type));
					queryElement("body").classList.add("more-manual");
					search_html_manual(getData);
					break;
				case "faq": // 常见问题
					queryElement("head").appendChild(add_link(type));
					queryElement("body").classList.add("more-faq");
					search_html_faq(getData);
					break;
				case "lib": // 知识库
					queryElement("head").appendChild(add_link(type));
					queryElement("body").classList.add("more-lib");
					search_html_lib(getData);
					break;
				default:
					break;
			}
		}
	}
	// 添加搜索对应的css文件 link标签
	function add_link(type) {
		var createLi = createElement("link");
		createLi.setAttribute("rel", "stylesheet");
		switch(type) {
			case "service": // 服务
				// 插入相应的css样式文件
				createLi.setAttribute("href", "../../html/service/css/service.css");
				break;
			case "manual": // 产品手册
				createLi.setAttribute("href", "../../html/more/css/more.css");
				break;
			case "faq": // 常见问题
				createLi.setAttribute("href", "../../html/more/css/more.css");
				break;
			case "lib": // 知识库
				createLi.setAttribute("href", "../../html/more/css/more.css");
				break;
			default:
				break;
		}
		return createLi;
	}
	// 添加搜索对应的js文件 因为添加dom结构会用到
	function add_script(type) {
		var createScript = createElement("script");
		createScript.setAttribute("type", "text/javscript");
		createScript.setAttribute("charset", "utf-8");
		switch(type) {
			case "service": // 服务
				// 插入相应的css样式文件
				//				createScript.setAttribute("href", "../../html/service/css/service.css");
				break;
			case "manual": // 产品手册
				createScript.setAttribute("href", "../../html/more/js/more.js");
				break;
			case "faq": // 常见问题
				//				createScript.setAttribute("href", "../../html/more/js/more.js");
				break;
			case "lib": // 知识库
				//				createScript.setAttribute("href", "../../html/more/css/more.css");
				break;
			default:
				break;
		}
		return createScript;
	}

	// 获取搜索结果失败
	function get_search_list_fail(data) {

	}

}
// 以下部分为不同搜索类型的dom结构的获取，机构不同，所以分开不同方法
// search_html_service ： 搜索服务
// search_html_manual ： 搜索产品手册
// search_html_faq ： 搜索常见问题
// search_html_lib ： 搜索知识库
// 编辑搜索结果的dom结构

function search_html_service(data) {
	if(data.length) {
		for(var i = 0; i < data.length; i++) {
			mui(".mui-scroll ul")[0].appendChild(service_list_dom(data[i]));
		}
	} else {
		mui.toast("未找到相关数据");
	}
	mui(".mui-pull-bottom-tips")[0].style.display = "none";
	// 点击事件
	mui("body").on("tap", "a.serivce-pass", function() {

		var href = this.getAttribute("href");
		if(href && ~href.indexOf(".html")) {
			jump(href, {
				passval_id: this.parentElement.getAttribute("passval_id"),
				icon: this.getAttribute("icon"),
				title: this.previousElementSibling.lastElementChild.firstElementChild.innerText,
			});
		}
	})
	mui("body").on("tap", "a.coustom-position", function() {

		var href = this.getAttribute("href");
		if(href && ~href.indexOf(".html")) {
			jump(href, {
				passval_id: this.parentElement.getAttribute("passval_id"),
				type: this.getAttribute("page-type"),
				pageName: this.getAttribute("page-name")
			});
		}
	});
}
// 服务列表dom
function service_list_dom(data) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell", "mui-media");
	createLi.setAttribute("passval_id", data.id);
	var task = next_operation(data.next_operation, data.state, data);
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
			state_arr[0] = "../../html/service/img/icon5.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已申请</i></li>';
			break;
		case 4:
			state_arr[0] = "../../html/service/img/icon6.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已受理</i></li>';
			break;
		case 8:
			state_arr[0] = "../../html/service/img/icon7.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已分配</i></li>';
			break;
		case 16:
			state_arr[0] = "../../html/service/img/icon8.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >执行中</i></li>';
			break;
		case 32:
			state_arr[0] = "../../html/service/img/icon9.png";
			state_arr[1] = '<a class="serivce-pass" execute-type="task-accept" href="../../html/service/html/ser-finish.html" ><button class="service-li-a">确认</button></a></li>';
			break;
		case 64:
			state_arr[0] = "../../html/service/img/icon10.png";
			state_arr[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >完成</i></li>';
			break;
		default:
			break;
	}
	return state_arr;
}

//**** service  ++++++++++++ 任务下一步操作 ****//
var server_state_img = new Array;

function next_operation(operation, mstate, data) {
	switch(operation) {
		case 0:
			return mission_state(mstate);
		case 1:
			server_state_img[0] = "../../html/service/img/icon5.png";
			server_state_img[1] = '<a icon="1" class="serivce-pass" execute-type="task-accept" href="../../html/service/html/ser-operation.html" ><button class="service-li-a">受理</button></a></li>';
			return server_state_img;
		case 2:
			server_state_img[0] = "../../html/service/img/icon6.png";
			server_state_img[1] = '<a icon="2" class="serivce-pass" execute-type="task-accept" href="../../html/service/html/ser-operation.html" ><button class="service-li-a">分配</button></a></li>';
			return server_state_img;
		case 4:
			server_state_img[0] = "../../html/service/img/icon7.png";
			server_state_img[1] = '<a icon="4" class="serivce-pass" execute-type="task-accept" href="../../html/service/html/ser-operation.html" ><button class="service-li-a">执行</button></a></li>';
			return server_state_img;
		case 8:
			server_state_img[0] = "../../html/service/img/icon8.png";
			server_state_img[1] = '<a icon="8" class="serivce-pass" execute-type="task-accept" href="../../html/service/html/ser-sure.html" ><button class="service-li-a">执行完成</button></a></li>';
			return server_state_img;
		default:
			return mission_state(mstate);
	}
}

function mission_state(mstate) {
	switch(mstate) {
		case 2:
			server_state_img[0] = "../../html/service/img/icon5.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已申请</i></li>';
			return server_state_img;
		case 4:
			server_state_img[0] = "../../html/service/img/icon6.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已受理</i></li>';
			return server_state_img;
		case 8:
			server_state_img[0] = "../../html/service/img/icon7.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >已分配</i></li>';
			return server_state_img;
		case 16:
			server_state_img[0] = "../../html/service/img/icon8.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >执行中</i></li>';
			return server_state_img;
		case 32:
			server_state_img[0] = "../../html/service/img/icon9.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >待确认</i></li>';
			return server_state_img;
		case 64:
			server_state_img[0] = "../../html/service/img/icon10.png";
			server_state_img[1] = '<i style="border:none;color:#0A569D" execute-type="task-accept" >完成</i></li>';
			return server_state_img;
		default:
			server_state_img[0] = "../../html/service/img/icon5.png";
			server_state_img[1] = '<i style="border:none;" execute-type="task-accept" >--</i></li>';
			return server_state_img;
	}
}
// 产品使用手册dom
function search_html_manual(data) {
	if(data.length) {
		for(var i = 0; i < data.length; i++) {
			mui(".mui-scroll ul")[0].appendChild(more_manual_list(data[i]));
		}
	} else {
		mui.toast("未找到相关数据");
	}
	mui(".mui-pull-bottom-tips")[0].style.display = "none";
	// 产品手册下载
	mui(".mui-disabled").on("tap", ".mui-btn", function() {
		this.setAttribute("disabled", true);
		this.removeAttribute("style");
		this.parentElement.nextElementSibling.removeAttribute("style");
		this.parentElement.classList.remove("mui-selected");
		this.parentElement.parentElement.classList.remove("mui-selected");

		var down_extended_name = this.getAttribute("file_name").split(".")[1];
		createDownloadTask(mmsappurl.more.downManual, this.getAttribute("title"), this.getAttribute("download"), down_extended_name);

		dtask.addEventListener("statechanged", function(download, status) {

			if(download.state == 4 && status == 200) {
				// 下载完成 

			}
		}, false)

		var btnArray = ['确认', '取消'];
		mui.confirm("是否确定下载？", '下载', btnArray, function(e) {
			if(e.index == 0) {
				//确定
				dtask.start();
			} else {
				//取消
			}
		});
	})
}

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
// 常见问题dom
function search_html_faq(data) {
	if(data.length) {
		for(var i = 0; i < data.length; i++) {
			mui(".mui-scroll ul")[0].appendChild(more_faq_list(data[i]));
		}
	} else {
		mui.toast("未找到相关数据");
	}
	mui(".mui-pull-bottom-tips")[0].style.display = "none";
}

function more_faq_list(data) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell");
	createLi.innerHTML = '<div class="mui-media-body"><h2 class="more-faq-title">' + data.title + '</h2><p class="mui-ellipsis">' + data.content + '</p></div>';
	return createLi;
}
// 知识库dom
function search_html_lib(data) {
	if(data.length) {
		for(var i = 0; i < data.length; i++) {
			mui(".mui-scroll ul")[0].appendChild(more_library_list(data[i]));
		}
	} else {
		mui.toast("未找到相关数据");
	}
	mui(".mui-pull-bottom-tips")[0].style.display = "none";
	mui(".mui-content").on("tap", "li > a", function() {
		var href = this.getAttribute("href");

		if(href && ~href.indexOf(".html")) {
			var parameter = {
				libId: this.getAttribute("libId")
			}
			jump(href, parameter);
		}
	})
}

function more_library_list(data) {
	var createLi = createElement("li");
	createLi.classList.add("mui-table-view-cell");
	var createA = createElement("a");
	createA.setAttribute("href", "../../html/more/html/more-lib-info.html");
	createA.setAttribute("libId", data.id);
	createA.setAttribute("page", "lib");
	var createDiv = createElement("div");
	createDiv.classList.add("mui-table", "mui-slider-handle");
	createDiv.innerHTML = '<div class="mui-table-cell mui-col-xs-8"><h4 class="mui-ellipsis">' + data.title + '</h4><h5 class="mui-ellipsis">' + data.author + '</h5></div><div class="mui-table-cell mui-col-xs-4 mui-text-right"><span class="mui-h5">' + get_date(data.update_time, "mdhm") + '</span></div>';
	createA.appendChild(createDiv);
	createLi.appendChild(createA);
	return createLi;
}

// *********************** end ***********************