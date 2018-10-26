
var msg = document.getElementById('answer').innerHTML;    // Message
document.getElementById('answer').innerHTML = msg;



function $(id){
	return document.getElementById(id);
	}
	function clearUser(){
		var userId=$("user_prompt");
		userId.innerHTML="";
		}
	function checkUser(){
		var user=$("user").value;
		var userId=$("user_prompt");
		userId.innerHTML="";
		var reg=/^[\u4E00-\u9FA5]{2,4}$/;
		if(reg.test(user)==false){
				userId.innerHTML="姓名不正确,请输入2~4位的中文字"
				return false;
			}else
			userId.innerHTML="姓名格式正确"
			return true;
		}
		
		function clearPhone(){
		var phoneId=$("phone_prompt");
		phoneId.innerHTML="";
		}
	function checkPhone(){
		var phone=$("phone").value;
		var phoneId=$("phone_prompt");
		phoneId.innerHTML="";
		var reg=/^1\d{10}$/;
		if(reg.test(phone)==false){
				phoneId.innerHTML="手机不正确,请输入11位数字"
				return false;
			}else
			phoneId.innerHTML="手机格式正确"
			return true;
		}
		
		
		
		function clearemail(){
		var emailId=$("email_prompt");
		emailId.innerHTML="";
		}
	function checkemail(){
		var email=$("email").value;
		var emailId=$("email_prompt");
		emailId.innerHTML="";
		var reg = /^\w+@\w+\.\w+[(com)|(cn)]$/;
		if(reg.test(email)==false){
				emailId.innerHTML="邮箱格式不正确，请输入正确的邮箱格"
				return false;
			}else
			emailId.innerHTML="邮箱格式正确"
			return true;
		}
		function check(){
			
			
			
			
			return checkUser()&&checkemail()&&checkPhone();
			}
