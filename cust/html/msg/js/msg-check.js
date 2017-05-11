var checked_l = 0;
var EditObj = {
	getBody:queryElement("body"),
	editBtn:queryElement("#msg-edit-notice"),
	delBtn:queryElement(".msg-del-btn"),
	allBtn:mui("#msg-changeinput input[type=checkbox]")[0]
}
edit();
function edit(){
	EditObj.editBtn.addEventListener("tap",function(){
		if(mui(".mui-slider-handle").length > 0){
			if(queryElement("body").classList.contains("msg-checked-show")){
				editHide();
			}else{
				editShow();
			}
		}else{
			mui.toast('暂无数据，无法编辑！');
		}
	})
}
// 显示checkbox
function editShow(){
	EditObj.getBody.classList.add("msg-checked-show");
	EditObj.editBtn.innerHTML = "完成";
	getIdArr = activeChecked();
	allChecked();
	delChecked(getIdArr);
}
// 隐藏checkbox
function editHide(){
	EditObj.getBody.classList.remove("msg-checked-show");
	EditObj.editBtn.innerHTML = "编辑";
	checked_l = 0;
}
// 全选
function allChecked(){
	mui("#msg-changeinput").off("change").on("change","input[type=checkbox]",function(){
		var checks = mui(".mui-active ul input");
		var that = this;
		mui.each(checks,function(i,e){
			e.checked = that.checked;
		});
		if(that.checked){

		}
		var allArr = activeChecked();
		delChecked(allArr);
	});
}
// 多选
function editCheckbox(obj){
	var l = mui(".mui-active ul li").length;
	if(obj.checked){
		checked_l++;
		if(checked_l == l) {
			EditObj.allBtn.checked = true;
		}
	}else{
		checked_l--;
		EditObj.allBtn.checked = false;
	}
	var chackArr = activeChecked();
	delChecked(chackArr)
}
// 当前选项卡的选中checked 集合 返回一个arr
function activeChecked(obj){
	var activeUl = mui(".mui-active ul")[0];
	var active = mui(".mui-active ul input");
	var y = new Array;
	var checkeds = 0;
	for(var x = 0 ;x <active.length;x++){
		if(active[x].checked){
			++checkeds;
			y[y.length] = active[x].parentElement.nextElementSibling.getAttribute("getids");
			if(checkeds = active.length){
				getIdArr[getIdArr.length] = active[x].parentElement.nextElementSibling.getAttribute("getids")
				mui("#msg-changeinput input[type=checkbox]")[0].checked = true;
			}
		}else{
			mui("#msg-changeinput input[type=checkbox]")[0].checked = false;
		}
	}
	return y;
}
// 删除操作
function delChecked(delArr){
	mui(".msg-coustom-boot").off("tap").on("tap",".msg-del-btn",function(){
		if(delArr.length>0){
			var btnArray = ['否', '是'];
			mui.confirm('您确定删除这' + delArr.length + '项吗？', '新中新运维云平台', btnArray, function(e) {
				if(e.index == 1) {
					mui.each(mui(".mui-active ul input"),function(i,e){
						if(e.checked){
							e.parentElement.parentElement.remove();
						}
					})
					// 如果删除的是公告里的
					if(mui(".mui-slider-group .mui-active")[0].id == "item1mobile"){
						editHide();
						delete_messages(delArr);
					}else{
						editHide();
						// 删除选定的本地存储
						var localObj = JSON.parse(localStorage.getItem(getInterimID+"-chatList"));
						
						for(var x in delArr){
							for(var y = 0;y< localObj.length;y++){
								if(delArr[x] == localObj[y].id){
									localObj.splice(y,1);
								}else if(localObj[y].id == undefined){
									localObj.splice(y,1);
								}
							}
						}
						localStorage.setItem(getInterimID+"-chatList",JSON.stringify(localObj));
						mui.toast("删除成功");
					}
				} else {
					mui.toast("已取消删除");
				}
			})
		}else{
			mui.toast("请选择你所删除的项！");
		}
	})
}
//批量删除
function delete_messages(delete_ids) {
	var urls = mmsappurl.msg.batchDel; 
	var datas = {
		ids: delete_ids
	}
	getAjax(urls, datas, delete_success, fail_callback);
}

function delete_success(data) {
	if(data.errcode == 0) {
		mui.toast("删除成功");
		messages("down");
		
	} else {
		mui.toast("删除失败");
	}
}
