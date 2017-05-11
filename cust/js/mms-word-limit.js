// 字数限制提示
// 监听textarea 字数限制
function ser_wordLimit(obj,name){
	var text_l = obj.value.length;
	if(text_l > 0){
		if(name == "submit"){
			var tips_obj = obj.parentElement.previousElementSibling.children[0];
		}else{
			var tips_obj = obj.nextElementSibling;
		}
		tips_obj.innerHTML = "还能输入"+(obj.getAttribute("maxlength") - text_l)+"个字";
	}
}