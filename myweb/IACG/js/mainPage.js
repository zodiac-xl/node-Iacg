
$( function () {
	//导航显影start
	$( ".head .nav" ).hide();
	$( ".open-nav,.head .nav" ).hover( function () {
		var headNav=$(".head .nav");
		headNav.toggle();
		headNav.toggleClass( "white" );
	} );
	//导航显影end
	//banner start
	var bannerIndex = 0;
	var bannerSpaceTime = 4000;
	var timeOut = setTimeout( autoBanner, bannerSpaceTime );
	banner();

	function banner() {
		var slideBar=$( ".slide-bar li" );
		var slideImg=$( ".slide-img li" );
		slideBar.removeClass( "on" );
		slideBar.eq( bannerIndex ).addClass( "on" );
		slideImg.css("opacity","0");
		slideImg.eq( bannerIndex ).css("opacity","1");


	}

	$( ".slide .slide-bar li" ).hover( function ( e ) {
		bannerIndex = $( e.target ).text() - 1;
		if ( bannerIndex == $( ".slide .slide-bar li" ).length ) {
			bannerIndex = 1;
		}
		banner();
		clearTimeout( timeOut );
	} );
	$( ".slide-bar li" ).mouseout( function (  ) {

		timeOut = setTimeout( autoBanner, bannerSpaceTime );
	} );
	function autoBanner() {
		bannerIndex += 1;
		if ( bannerIndex == $( ".slide .slide-bar li" ).length ) {
			bannerIndex = 0;
		}
		banner();
		timeOut = setTimeout( autoBanner, bannerSpaceTime );
	}
	// banner end
	//autoLayout


} );
window.onload=function(){
	W.autoCenter($(".img-wrap img" ).get());


	function lerp(a, b, p) {
		return (b-a)*p + a;
	}
	function newIT() {
		var canvas = document.getElementById("scratch");

		// canvas dimensions
		var width = parseInt(canvas.style.width);
		var height = parseInt(canvas.style.height);

		// retina
		var dpr = window.devicePixelRatio || 1;
		canvas.width = width*dpr;
		canvas.height = height*dpr;
		canvas.getContext("2d").scale(dpr, dpr);

		// simulation
		var sim = new VerletJS(width, height, canvas);
		sim.friction = 1;
		sim.highlightColor = "#fff";

		// entities
		var min = Math.min(width,height)*0.5;
		var segments = 20;
		var cloth = sim.cloth(new Vec2(width/2,height/3), min, min, segments, 6, 0.9);

		cloth.drawConstraints = function(ctx, composite) {
			var stride = min/segments;
			var x,y;
			for (y=1;y<segments;++y) {
				for (x=1;x<segments;++x) {
					ctx.beginPath();

					var i1 = (y-1)*segments+x-1;
					var i2 = (y)*segments+x;

					ctx.moveTo(cloth.particles[i1].pos.x, cloth.particles[i1].pos.y);
					ctx.lineTo(cloth.particles[i1+1].pos.x, cloth.particles[i1+1].pos.y);

					ctx.lineTo(cloth.particles[i2].pos.x, cloth.particles[i2].pos.y);
					ctx.lineTo(cloth.particles[i2-1].pos.x, cloth.particles[i2-1].pos.y);

					var off = cloth.particles[i2].pos.x - cloth.particles[i1].pos.x;
					off += cloth.particles[i2].pos.y - cloth.particles[i1].pos.y;
					off *= 0.25;

					var coef = Math.round((Math.abs(off)/stride)*255);
					if (coef > 255)
						coef = 255;

					ctx.fillStyle = "rgba(" + coef + ",0," + (255-coef)+ "," +lerp(0.25,1,coef/255.0)+")";

					ctx.fill();
				}
			}

			var c;
			for (c in composite.constraints) {
				if (composite.constraints[c] instanceof PinConstraint) {
					var point = composite.constraints[c];
					ctx.beginPath();
					ctx.arc(point.pos.x, point.pos.y, 1.2, 0, 2*Math.PI);
					ctx.fillStyle = "rgba(255,255,255,1)";
					ctx.fill();
				}
			}
		}

		cloth.drawParticles = function(ctx, composite) {
			// do nothing for particles
		}

		// animation loop
		var legIndex = 0;
		var loop = function() {
			sim.frame(16);
			sim.draw();
			requestAnimFrame(loop);
		};

		loop();
	}
	newIT();
};

//
//      $( ".slide .slide-bar li:nth-child(2)" ).trigger("hover");
//        var webSaver=setTimeout("window.open('splitbanner.html')",5000);
//        $("body" ).mousedown(function(){
//            clearTimeout(webSaver);
//            webSaver=setTimeout("window.location.href='splitbanner.html'",5000);
//        })
//        $("body" ).mousemove(function(){
//            clearTimeout(webSaver);
//            webSaver=setTimeout("window.location.href='splitbanner.html'",5000);
//        })



