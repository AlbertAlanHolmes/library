function showTime()
{
var myDate=new Date();
var hour=myDate.getHours();
var minutes=myDate.getMinutes();
var seconds=myDate.getSeconds();
if(hour<10)
hour="0"+hour;
if(minutes<10)
minutes="0"+minutes;
if(seconds<10)
seconds="0"+seconds;

document.getElementById("time").innerHTML="NowTime:"+hour+":"+minutes+":"+seconds;

setTimeout("showTime()",1000);
}
window.onload=showTime();

