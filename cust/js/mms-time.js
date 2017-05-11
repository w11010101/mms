// 转换时间
var get_date = function (date,format){
	var getTime = 0;
	if(date != null) {
		var reply_time = new Date(date);
		var getH = reply_time.getUTCHours();
		var getM = reply_time.getMonth() + 1;
	}else{ 
		var reply_time = new Date();
		var getH = reply_time.getHours();
		var getM = reply_time.getMonth();
	}
	var getY = reply_time.getFullYear();
	var getD = reply_time.getUTCDate();
	var getMin = reply_time.getMinutes();
	var getS = reply_time.getSeconds();
	if(getM < 10) getM = "0" + getM;
	if(getD < 10) getD = "0" + getD;
	if(getH < 10 || getH == 0) getH = "0" + getH;
	if(getMin < 10 || getMin == 0) getMin = "0" + getMin;
	if(getS < 10 || getS == 0) getS = "0" + getS;
	switch (format){
		case "ymd": // 只显示年月日
			getTime = getY +"/"+ getM + "/" + getD;
			break;
		case "mdhm":// 只显示月日时分
			getTime = getM + "/" + getD + " " + getH + ":" + getMin;
			break;
		case "ymdhm":// 只显示年月日时分
			getTime = getY +"/"+ getM + "/" + getD + " " + getH + ":" + getMin;
			break;
		default: // 不传全部显示 年月日 时分秒
			getTime = getY +"/"+ getM + "/" + getD + " " + getH + ":" + getMin;
			break;
	}
	return getTime;
}