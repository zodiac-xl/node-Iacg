
	$(document).ready(function(e) {
		 $(window).scroll(function(){
		var sc=$(window).scrollTop();
		var $top=$('#to-top');
		
		if(sc>0)
			{$top.fadeIn(500);}
		else{$top.fadeOut();}
		});
        $('#to-top').click(function(e) {
			
            $("body").animate({scrollTop:0},800)
			document.documentElement.scrollTop=0; //兼容火狐 ie
		
        });
		$('#to-top').hover(function(){$('#to-top').css('background-position-y','bottom');},
							function(){$('#to-top').css('background-position-y','top');}) ;
    });
	
