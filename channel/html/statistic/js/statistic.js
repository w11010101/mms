var getSwipeObj = queryElement(".statistic-slider") ;
//var getInterimID = getInterim.org_id;
var getTime = new Date;
var getYear = getTime.getFullYear(),
	getMonth = getTime.getMonth() + 1,
	getDate = getTime.getDate(),
	getHours = getTime.getHours(),
	getMinutes = getTime.getMinutes(),
	getSeconds = getTime.getSeconds(),
	nowDayOfWeek = getTime.getDay(),
	beginTime,
	endTime;
function statistic(id, BT, ET) {
	if(BT == undefined && ET == undefined) {
		BT = ET = ""
	};
	var urls = mmsappurl.statistics;
	var datas = {
		executor_id: getInterimID,
		begin_time: BT,
		end_time: ET
	}

	getAjax(urls, datas, statistic_success, fail_callback);

	function statistic_success(data) {
		console.log(JSON.stringify(data))
		var data = data.data;
		var active_li = mui(".mui-active li");
		var responseTime = data.avg_response_time;
		// responseTime 单位：秒
		var get_reponse_time = judgeTime(responseTime / 60);
		var get_reponse_cycle = judgeTime(data.avg_timecost / 60);
		active_li[2].querySelector("h5").innerHTML = "服务响应时间("+get_reponse_time.unit+")";
		active_li[3].querySelector("h5").innerHTML = "服务周期("+get_reponse_time.unit+")";
		active_li[0].children[1].innerHTML = data.mission_count;
		active_li[1].children[1].innerHTML = data.avg_satisfication.toFixed(2);
		active_li[2].children[1].innerHTML = get_reponse_time.setTime.toFixed(2);
		active_li[3].children[1].innerHTML = get_reponse_cycle.setTime.toFixed(2);
	}
}
// 时间判断
function judgeTime(time){
	var setTime = 0;
	var unit = "";
	if (time >= 0 && time < 60) {
		unit = "分钟";
		setTime = time;
	} else if (time < 1440) {
		unit = "小时";
		setTime = (responseMin / 60);
	} else if (time < 525600) {
		unit = "天";
		setTime = (time / 60 / 24);
	} else {
		unit = "年";
		setTime = (time / 60 / 24 / 365);
	}
	return {
		setTime:setTime,
		unit:unit
	}
}
getSwipeObj.addEventListener('slide', function(event) {
	
	//注意slideNumber是从0开始的；
	var i = event.detail.slideNumber + 1;
	// 1:本周;2:本月;3:本季;4:本年;5:全部;6:其他;
	if(i == 1) beginTime = getWeekStartDate(), endTime = "";
	if(i == 2) beginTime = getMonth, endTime = "";
	if(i == 3) {
		if(getMonth / 3 > 0 && getMonth / 3 <= 1) beginTime = 1, endTime = "";
		if(getMonth / 3 > 1 && getMonth / 3 <= 2) beginTime = 4, endTime = "";
		if(getMonth / 3 > 2 && getMonth / 3 <= 3) beginTime = 7, endTime = "";
		if(getMonth / 3 > 3 && getMonth / 3 <= 4) beginTime = 10, endTime = "";
	}
	if(i == 4) beginTime = getYear, endTime = "";
	if(i == 5) {
		statistic(getInterimID, "", "");
		return false;
	}
	if(i == 6) return false;
	if(beginTime < 10) beginTime = "0" + beginTime;
	if(endTime < 10) endTime = "0" + endTime;
	
	mui(".sta-date-boxs")[0].style.display = "block";
	mui(".sta-date-boxs")[0].nextElementSibling.style.display = "none";
	// 获取统计分许

	if(beginTime > 1000) {
		statistic(getInterimID, beginTime+"-01-01", "");
	} else {
		if(i != 1) {
			statistic(getInterimID, getYear + "-" + beginTime + "-01", getYear + "-" + endTime + "-"+getLastDate(getYear,endTime));
		} else {
			statistic(getInterimID, beginTime, endTime);
		}
	}
	
});

queryBtn()

function queryBtn() {
	mui(".sta-date-boxs").off("tap").on("tap","button", function() {
		beginTime = mui(".pickDate1 em")[0].innerText;
		endTime = mui(".pickDate2 em")[0].innerText;
		if(beginTime == "" || endTime == "") {
			mui.toast('日期不能为空');
			return false;
		}
		beginTime = beginTime.split("-");
		endTime = endTime.split("-");
		var selectBegin = new Date(beginTime[0], beginTime[1], beginTime[2]);
		var selecEnd = new Date(endTime[0], endTime[1], endTime[2]);
		mui(".sta-date-boxs")[0].style.display = "none";
		mui(".sta-date-boxs")[0].nextElementSibling.style.display = "block";
		
		statistic(getInterimID, formatDate(selectBegin), formatDate(selecEnd)+" 23:59:59.999");
	})
}