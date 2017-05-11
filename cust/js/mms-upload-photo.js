// 图片转码
function tobase(path) {
	var img = new Image();
	img.src = path; // 传过来的图片路径在这里用。
	img.compress = function() {
		var that = this;
		//生成比例 
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w; //480  你想压缩到多大，改这里
		h = w / scale;
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.style.width = w;
		canvas.style.height = h;
		canvas.setAttribute("width", w);
		canvas.setAttribute("height", h);
		//		$(canvas).attr({
		//			"width": w,
		//			"height": h
		//		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 0.5); //1最清晰，越低越模糊。
		return base64;
	}
	return img.compress();

}
//上传图片
var numbers = 0;
var getpath = "";

function upLoadImg(base64, suffix, type) {
	var urls = mmsappurl.uploadImg;
	var datas = {
		base64_string: base64,
		file_name: "a." + suffix
	}
	getAjax(urls, datas, uploads, fail_callback);

	function uploads(data) {
		numbers++;
		var data = data.data;
		if(!data.errcode) {
			if(mui(".imgs_boxs").length == 0) {
				serCommonUpload(data.path, type);
			} else {

				if(numbers == mui(".imgs_boxs").length) {
					getpath += data.path;
					// 公共上传
					serCommonUpload(getpath, type);
				} else {
					getpath += data.path + "|";
				}
			}
		} else {
			if(data.errcode == "-5407") mui.toast("文件上传失败");

		}

	}
}
// 聊天发送图片的后缀名
function suffix_img(img) {
	var suffix_arr = new Array;
	if(typeof img == "string") {
		suffix_arr[0] = img.split(".")[img.split(".").length - 1]
	} else {
		mui.each(img, function(i, e) {
			var getImg = e.children[0].children[0];
			var getSrc = getImg.getAttribute("src");
			var img_header = getSrc.substring(0, 4);

			if(getSrc.length > 500 && img_header == "data") {
				suffix_arr[i] = "jpg";
			} else {
				suffix_arr[i] = getSrc.split(".")[getSrc.split(".").length - 1];
			}
		})
	}
	return suffix_arr;
}

//  common upload judge 
function serCommonUploadJudge(imgArr, suffixArr, type) {
	var l = imgArr.length;
	var judgeObj = judgeText();

	if(judgeObj.judge) {
		// 已填写描述或标题
		// 判断图片
		if(l > 0) {
			// 有图片，先上传图片再上传内容
			for(var i = 0; i < suffixArr.length; i++) {
				upLoadImg(imgArr[i], suffixArr[i], type);
			}
		} else {
			// 无图片，只上传文字
			serCommonUpload("", type);
		}
	} else {
		// 未填写 提示
		mui.toast(judgeObj.tips + '不能为空！');
	}

}
//  common upload 公共上传
function serCommonUpload(path, type) {
	switch(type) {
		case "chat": // 会话
			replies(path, 1);
			break;
		case "supplement": // 补充说明
			service_supplement(path);
			break;
		case "noSolved": // 未解决
			ser_noSolve(path);
			break;
		case "serSaveDraft": // 保存草稿
			ser_saveDraft(path);
			break;
		case "serSubmit": // 服务提交
			ser_submit(path);
			break;
	}
}
var judgeObj = {};

// judge text 输入框判断
function judgeText() {
	var docs = mui(".mui-active input[type=text],.mui-active textarea");
	var tagName = "";
	for(var x = 0; x < docs.length; x++) {
		if(!docs[x].value) {
			judgeObj["tips"] = docs[x].tagName == "INPUT" ? "系统名称" : "描述";
			judgeObj.judge = false;
			break;
		} else {
			judgeObj.judge = true;
		}
	}

	return judgeObj;
}