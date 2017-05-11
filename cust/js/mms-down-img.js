// 下载图片
function down_imgs(get_img){
	
	var img_arr = new Array;
	for(var x in get_img){
		var urls = mmsappurl.downImg;
		var datas = {
			file_name:get_img[x]
		};
		fn_Ajax (urls,datas,img_success,fail_back);
		function img_success(data){
			var data = data.data;
			if(data != null){
				if(data.file_name != null){
					img_arr[img_arr.length] = "data:image/jpg;base64,"+data.base64_string;
				}else{
					img_arr[img_arr.length] = "../img/5.png";
				}
			}else{
				img_arr[img_arr.length] = "../img/5.png";
			}
		}
		function fail_back(data){
			
		}
	}
	return img_arr;
}
//  Ajax  ===============================
function fn_Ajax(url, data, success_back,error_back) {
	if(localStorage.getItem("STN") == undefined) {
		var token = "";
	} else {
		var token = localStorage.getItem("STN");
	}
	var imei = getinfos.uids;
	var auth = "";
	auth = "Basic " + window.btoa(token + ":" + imei);
	var arr;
	mui.ajax(url,{
		data:data,
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", auth);
		},	              
		success:function(data){
			success_back(data);
		},
		error:function(data){
			error_back(data)
		}
	});
}
// 把原图文件名改成压缩的文件名
function thumb_name(get_img){
	var imgName_arr = new Array;

	for(var x in get_img){
		var el_Arr = get_img[x].split(".");
		var el_Arr_thumb = el_Arr[0]+".thumb."+el_Arr[1];
		imgName_arr[imgName_arr.length] = el_Arr_thumb;
	}

	return imgName_arr;
}
