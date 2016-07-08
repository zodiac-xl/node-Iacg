
$(document).ready(function(e) {
    //color text
	var tt="Zodiac  WE Are Young WE Are Strong"
	var col="#"+rr+gg+bb;
	var arr=tt.split("");
	var text1="";
	for(var i=0;i<arr.length;i++)
	{  
	var r=Math.floor(Math.random()*225);
	var g=Math.floor(Math.random()*225);
	var b=Math.floor(Math.random()*225);
	var rr=parseInt(r).toString(16);
	var gg=parseInt(g).toString(16);
	var bb=parseInt(b).toString(16);
	text1+="<font color=\"#"+rr+gg+bb+"\">"+arr[i]+"</font>"}
	//$(".logo a").text(text1);
	$(".logo a").append(text1);
	text1="";
	//color text
		//change bg
	$(".bgchange>input").click(function(){	var bg=$(".bgchange>input:checked").attr('class');
													$("html").css({"height":"100%","width":"100%"});
													$("body").css({"height":"100%","width":"100%"});
													$("body").attr("class",bg)});
	//change bg
	//NAV1
	$(".ui").hover(function(){$("#nav1").slideDown()},function(){$("#nav1").hide()});
		$("#nav1").hover(function(){$(this).show();},function(){$(this).hide()});

	$("#nav1 li").click(function(e) {
        top.location.href="ui.html";
    });
	//NAV1
});
