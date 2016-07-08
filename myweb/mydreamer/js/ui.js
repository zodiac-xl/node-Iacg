$(document).ready(function(e) {
	
	//menu
	
	//menu
	//menu1
	$("#all").bind("click",function(){$(".main ul li").show(1000);});
	$("#focus").bind("click",function(){$(".main ul li.focus").show(1000);$(".main ul li[class!=focus]").hide(1000);});
	$("#data").bind("click",function(){$(".main ul li.data").show(1000);$(".main ul li[class!=data]").hide(1000);});
	$("#photo").bind("click",function(){$(".main ul li.photo").show(1000);$(".main ul li[class!=photo]").hide(1000);});
	$("#menu").bind("click",function(){$(".main ul li.menu").show(1000);$(".main ul li[class!=menu]").hide(1000);});
	$("#widget").bind("click",function(){$(".main ul li.widget").show(1000);$(".main ul li[class!=widget]").hide(1000);});
	$("#iframe-close-btn").bind('click',function (){$(this).hide();$("iframe").fadeOut(1000)});
	//menu1
	//show demo
	$("#ui-list li img").bind("click",function(){
		var evsrc=$(this).attr('src');
		var evsrc1=evsrc.split("/");
		var evsrc2=evsrc1[3].split("\."); 
		var aa='ui/'+evsrc1[2]+'/'+evsrc2[0]+'/index.html';                                 
		$("iframe").attr("src",aa);$("iframe").fadeIn(1000);
		$(".black-bg").show();$("#iframe-close-btn").fadeIn(100);
		$("body").css("overflow","hidden");
		$('body,html').animate({ scrollTop: 0 }, 800)})
		
	//show demo
	//close demo
	$("#iframe-close-btn").bind('click',function (){$(this).hide();$(".black-bg").hide();$("iframe").fadeOut(1000);$("body").css("overflow","scroll");});
	//close demo

	

});
