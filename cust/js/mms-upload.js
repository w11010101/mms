var uploadObj = {
	maskbox:queryElement("#mask-box"),
	close:queryElement(".icon-close"),
//	loading:queryElement(".mui-loading")
}
//图片浏览
mui.previewImage();

// 遮罩层
mui(".mui-input-row").on("tap", ".upload-box", function() {
	mui.each(mui("textarea,input"),function(i,e){
		e.blur();
	})
	uploadObj.maskbox.style.zIndex = 50;
	uploadObj.maskbox.classList.remove("mask-box-hide");
	uploadObj.maskbox.classList.add("mask-box-show");
})
mui(".mask-content").on("tap", ".icon-close", function() {
	maskhide();
})
	//隐藏上传按钮
function uploadHide() {
	var imgBox = mui(".mui-active .device-img .imgs_boxs");
	var l = imgBox.length;
	if(l >= imgMaxNum()) {
		mui(".mui-active .upload-exception")[0].style.display = "none";
	} else {
		mui(".mui-active .pre-text")[0].style.display = "none";
	}
}

// del 删除照片
function delDemo() {
	mui("body").on("tap",".del",function(e) {
		mui.each(mui("textarea,input[type=text]"),function(i,e){
			e.blur();
		})
		this.parentElement.classList.add("del_obj");
		implementJS(".del_obj").fade_out(200,function(e){
			this.remove();
			mui.toast("还能添加" + (imgMaxNum() - imgs()) + "张");
			mui(".mui-active .upload-exception")[0].style.display = "inline-block";
		});
	});
}
delDemo();
//隐藏遮罩层

function maskhide() {
	uploadObj.close.classList.add("icon-close-active");
	uploadObj.maskbox.style.zIndex = "-1";
	uploadObj.maskbox.classList.add("mask-box-hide");
	setTimeout(function(){
		uploadObj.maskbox.classList.remove("mask-box-show");
	},500)
	
	setTimeout(function() {
		uploadObj.close.classList.remove("icon-close-active");
	}, 400);
}
// 拍照 
function photo() {
	var cmr = plus.camera.getCamera();
	var res = cmr.supportedImageResolutions[0];
	var fmt = cmr.supportedImageFormats[0];
	cmr.captureImage(function(path) {
			maskhide();
			insertImg(plus.io.convertLocalFileSystemURL(path), "photo");
		},
		function(error) {
			//未拍照
			
		}, {
			resolution: res, // 照片尺寸大小
			format: fmt //文件格式
		}
	);
}
// 从相册中选择多张图片 
var n = 1;
function galleryImgs() {
	// 从相册中选择图片
	if(imgs() >= imgMaxNum()) {
		mui.toast("最多添加" + imgMaxNum() + "张");
	} else if(imgs() != 0) {
		mui.toast("还能添加" + (imgMaxNum() - imgs()) + "张");
	} else {
		mui.toast("最多能添加" + (imgMaxNum() - imgs()) + "张");
	}

	plus.gallery.pick(function(e) {
		for(var i in e.files) {
			insertImg(e.files[i], "imgs");
		}
	}, function(e) {
		mui.toast("取消选择图片");
	}, {
		filter: "image",
		multiple: true
	});
}
// 限制上传图片个数
function imgMaxNum() {
	var img_num = 0;

	if(implementJS("body").has_class("ser-submit")) {
		img_num = 9
	} else {
		img_num = 3
	}
	return img_num;
}
// 查找已有图片数量
function imgs() {
	var nums;
	//判断
	if(implementJS("body").has_class("ser-illustrate")) {
		nums = mui(".device-img .imgs_boxs").length;
	} else {
		nums = mui(".mui-active .device-img .imgs_boxs").length;
	}
	return nums;
}
// 创建展示图
//插入图片
function insertImg(urls, type, nums) {
	var createLiImg = createElement("li");
	createLiImg.classList.add("imgs_boxs");
	var createSpan = createElement("span");
	createSpan.innerHTML = '<img src="' + urls + '" alt="" data-preview-src="" data-preview-group="1">';
	var createI = createElement("i");
	createI.classList.add("del");
	createLiImg.appendChild(createSpan);
	createLiImg.appendChild(createI);
	if(imgs() < imgMaxNum()){
		var select_btn = mui(".mui-active .device-img")[0];
		select_btn.insertBefore(createLiImg,mui(".mui-active .upload-exception")[0]);
	}
	uploadHide();
	maskhide();
	if(type == "photo") {
		mui.toast("还能添加" + (imgMaxNum() - imgs()) + "张");
	}
	delDemo();
}

function findImg(obj) {
	var imgArr = new Array;
	mui.each(obj,function(i,e){
		var getImg = e.children[0].children[0];
		var getSrc = getImg.getAttribute("src");
		var img_header = getSrc.substring(0,4);
//		if(img_header == "data"){
		if(getSrc.length > 500 && img_header == "data"){
			imgArr[i] = getSrc
		}else{
			imgArr[i] = tobase(getSrc);
		}
	})
	return imgArr;
}