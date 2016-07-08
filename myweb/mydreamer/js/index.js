
$(document).ready(function(e) {
	//大图预览
	$("#web-list li img,#tool-list li img").hover(function(){var evsrc1=$(this).attr("src");
	var evsrc2=evsrc1.split("/");
	var evsrc3=evsrc2[3].split("\.");
	var aa=evsrc2[0]+"/"+evsrc2[1]+"/"+evsrc2[2]+"/"+evsrc3[0]+"_A"+"\."+evsrc3[1];
	$(this).mousemove(function(event){ //ff没有event对象 所以传递个event参数 解决
			var event=event? event:window.event;
			var object=event||event.target||event.srcElement; //ff不支持event 支持event.target
			var x=object.pageX+20;
			var y=object.pageY+30;
			$(".big_pic img").attr("src",aa);
			$(".big_pic img").show();
			$(".big_pic img").css({position:"absolute",left:x,top:y});})
			
	}
	,function(){$(".big_pic img").hide()})
	//大图预览
	//ie js打开本地应用
	$("li[id='tool']~li").click(function(){ 
	
	var	strPath=$(this).attr("class");
 	 try      
	  {      
		   var objShell=new ActiveXObject("wscript.shell");      
 		  objShell.Run(strPath);    
 		  objShell=null;      
 		 }   
 		 catch(e)   
 		 {   
  		 alert("activeXObject IE专有");   
		  }      
	});
	//ie js打开本地应用
	
	

	
});