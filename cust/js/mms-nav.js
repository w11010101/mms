var num = 1;
mui("nav").on("tap", "em", function() {
	var nav_s = "nav-anishow-";
	var nav_h = "nav-anihide-";
	navShowStatus(nav_s, nav_h, 3);
})

function navShowStatus(nav_s, nav_h, nums) {
	var sect_n = "mms-sectors-nav-";
	var nav_screen = implementJS(".mms-screen-mask");
	var icon_plus = document.querySelector(".btn-menu");
	var type1, type2;
	if(num == 1) {
		type1 = nav_s;
		type2 = nav_h;
		nav_screen.fade_in(200);
		icon_plus.classList.remove("mms-btn-reduction");
		icon_plus.classList.add("mms-btn-rotate");
		num = 2;
	} else if(num == 2) {
		type1 = nav_h;
		type2 = nav_s;
		nav_screen.fade_out(200);
		icon_plus.classList.remove("mms-btn-rotate");
		icon_plus.classList.add("mms-btn-reduction");
		num = 1;
	}
	for(var x = 1; x <= nums; x++) {
		setTOut(x);
	}

	function setTOut(x) {
		setTimeout(function() {
			document.getElementById(sect_n + x).classList.remove(type2 + x);
		}, 0 + (x - 1) * 100);
		setTimeout(function() {
			document.getElementById(sect_n + x).classList.add(type1 + x);
		}, 0 + (x - 1) * 100);
	}
}
// 点击事件
mui("nav").on("tap", "a", function() {
	localStorage.setItem(getInterimID + "-page-ide", 1000);
	var parameter = {};
	var href = "";
	if(this.getAttribute("type")) {
		parameter.type = this.getAttribute("type");
		parameter.page_name = this.getAttribute("page_name");
		href = judge_drafts(this.getAttribute("page_name"));
		localStorage.setItem("page-type", JSON.stringify(parameter)); // 本地存储是为了，到pullrefresh_main页面没法给pullrefresh_sub传值
	} else {
		href = this.getAttribute("href");
	}
	var locationHref = location.href.split("/")[location.href.split("/").length - 1];
	localStorage.setItem(getInterimID + "-locationHref", locationHref);

	jump(href, parameter);
})

function judge_drafts(name) {

	switch(name) {
		case "报修单":
			var parameter = {
				mtype: 1,
				builder_id: getInterimID
			}
			var urls = mmsappurl.service.drafts
			if(get_lists(parameter, urls) != 0) {
				return "../../../plugin/html/pullrefresh_main.html";
			} else {
				return "../../service/html/ser-submit.html";
			}
			break;
		case "需求单":
			var parameter = {
				mtype: 2,
				builder_id: getInterimID
			}
			var urls = mmsappurl.service.drafts;
			if(get_lists(parameter, urls) != 0) {
				return "../../../plugin/html/pullrefresh_main.html";
			} else {
				return "../../service/html/ser-submit.html";
			}
			break;
		default:
			break;
	}
}

function get_lists(parameter, urls) {
	var l = "";
	if(localStorage.getItem("STN") == undefined) {
		var token = "";
	} else {
		var token = localStorage.getItem("STN");
	}
	var imei = getinfos.uids;
	var auth = "";
	auth = "Basic " + window.btoa(token + ":" + imei);
	mui.ajax({
		type: "post",
		url: urls,
		data: parameter,
		async: false,
		dataType: "json",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", auth);
		},
		success: function(data) {
			var data = data.data;
			l = data.length;
		}
	});
	return l;
}