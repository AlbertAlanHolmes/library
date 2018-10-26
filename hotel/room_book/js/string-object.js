function readXML() {
	var url = "xml/room.xml";
	if(window.ActiveXObject) {      //IE
		var xmldoc = new ActiveXObject("Microsoft.XMLDOM");
		xmldoc.onreadystatechange = function() {
			if(xmldoc.readyState == 4) createTable(xmldoc);
		}
		xmldoc.load(url);
	}
	else if(document.implementation&&document.implementation.createDocument) {   // Mozilla......
		var xmldoc = document.implementation.createDocument("", "", null);
			xmldoc.onload=function(){
			xmldoc.onload =  createTable(xmldoc);
		}
		xmldoc.load(url);
	}
}

function createTable(xmlDoc) {
	var msg="<h2>空房信息:</h2>";
	
var cNodes = xmlDoc.getElementsByTagName("room");
       var cNodes = xmlDoc.getElementsByTagName("room");
        for(j=0;j<cNodes.length;j++)
        {
			
            var roomID=xmlDoc.getElementsByTagName("room")[j].getAttribute("id");
			
            var value=xmlDoc.getElementsByTagName("value")[j].childNodes[0].nodeValue;
			
            var money=xmlDoc.getElementsByTagName("money")[j].childNodes[0].nodeValue;
			
		msg+="<div id='"+j+"'><h2>房间号："+roomID+"</h2><p>"+value+"</p>"
		msg+="<p>"+money+"</p><p><a href='#' onclick='deleteDiv("+j+")'>预定</a></p></div>";
           
        }
        
	var el = document.getElementById('info');


el.innerHTML = msg;	

}
    function deleteDiv(id)
 {
	 var dele=document.getElementById(id)
dele.parentNode.removeChild(dele);
alert("预定成功！");
 } 
    