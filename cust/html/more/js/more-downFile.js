var tasksArr = [];

mui.plusReady(function() {

})
// 下载按钮添加点击事件
mui("body").on("tap", ".mui-btn-red", function() {

	switch(this.innerText) {
		case "下载":
			// 任务开始
			tasksStart(this);
			break;
		case "取消":
			// 任务取消
			tasksEdit(this, "pause");
			break;
		case "继续":
			// 任务继续
			tasksEdit(this, "resume");
			break;
		default:
			// 已下载
			mui.toast("已下载");
			break;
	}
})
// 点击任务下载开始
function tasksStart(obj) {
	// 产品手册点击下载
	obj.removeAttribute("style");
	obj.parentElement.nextElementSibling.removeAttribute("style");
	obj.parentElement.classList.remove("mui-selected");
	obj.parentElement.parentElement.classList.remove("mui-selected");
	
	var down_extended_name = obj.getAttribute("file_name").split(".")[1];
	
	var that = obj;
	var thatPrent_Li = that.parentNode.parentNode;
	var param = {
		href: mmsappurl.more.downManual,
		title: obj.getAttribute("title"),
		file_name: obj.getAttribute("download"),
		extended_name: down_extended_name,
		listId: thatPrent_Li.getAttribute("manual_list_id"),
		progressObj: thatPrent_Li.querySelector(".mui-progressbar")
	}
	var thisTask = createDownloadTask(param);
	var btnArray = ['确认', '取消'];
	mui.confirm("是否确定下载？", '下载', btnArray, function(e) {
		if(e.index == 0) {
			//确定

			that.innerHTML = "取消";
			thisTask.start();
			obj.setAttribute("downloadId", thisTask.id);
			thatPrent_Li.classList.remove("more-progressbar-hide");
		}
	});
}

// 创建下载任务
function createDownloadTask(parameter) {

	var url = encodeURI(parameter.href + parameter.file_name);
	var options = {
		method: "GET",
		filename: parameter.title + "." + parameter.extended_name
	}
	var dtask = plus.downloader.createDownload(url, options);

	if(!dtask) return;
	var taskObj = {
		id: parameter.listId,
		objs: dtask,
		progressObj: parameter.progressObj,
		progressObjbtn: parameter.progressObj.parentNode.parentNode.querySelector(".mui-btn-red")
	}
	addEventListTask(taskObj);
	return dtask;
}
// 任务操作
function tasksEdit(obj, type) {

	plus.downloader.enumerate(function(tasks) {
		for(var i in tasks) {
			if(tasks[i].id == obj.getAttribute("downloadId")) {
				// 当前下载任务
				switch(type) {
					case "pause":
						tasks[i].pause();
						obj.innerHTML = "继续";
						break;
					default:
						tasks[i].resume();
						obj.innerHTML = "取消";
						break;
				}
			}
		}
	});
}
// 返回产品手册时添加进度条
function addProgress(taskParam) {
	
	var taskParamObj = JSON.parse(taskParam);
	
	var currentGroupId = mui("#sliderSegmentedControl .mui-active")[0].getAttribute("group_id");
	// 判断任务中是否是当前分组
	if(taskParamObj.groupId == currentGroupId) {
		var lists = mui(".mui-active li");
		for(var x = 0;x< lists.length;x++){
			// 判断是否是当前id的手册
			if(lists[x].getAttribute("manual_list_id") == taskParamObj.id) {
				
				lists[x].classList.remove("more-progressbar-hide");
			}
		}
	}
}
//	
mui.back = function() {
	plus.downloader.enumerate(function(tasks) {
		if(tasks.length) {
			mui.each(tasks, function(i, e) {
				plus.downloader.clear(-1000);
				
			})
		}
		old_back();
	});
}

// 删除本地存储中不正常的key值
function removelocal(keyword) {
	var l = localStorage.length;
	for(var i = 0; i < l; i++) {

		if(~localStorage.key(i).indexOf(keyword)) {
			localStorage.removeItem(localStorage.key(i));
		} else {
			localStorage.removeItem("undefined-page-ide");
		}
		
	}
}

// 任务监听 addEventListTask
function addEventListTask(obj) {
	
	obj.objs.addEventListener("statechanged", function(task, status) {
		switch(task.state) {
			case 1: // 开始
				
				break;
			case 2: // 已连接到服务器
				
				break;
			case 3: // 已接收到数据
				
				var progressNum = (task.downloadedSize / task.totalSize * 100).toFixed(1);
				mui(obj.progressObj).progressbar().setProgress(progressNum);

				break;
			case 4: // 下载完成
				setTimeout(function() {
					
					mui.toast("下载完成,请到下载管理中查看");
					obj.progressObjbtn.innerHTML = "已下载";
					localStorage.removeItem(getInterimID + "-downId-" + task.id);
				}, 1000)
				break;
		}
	})
}