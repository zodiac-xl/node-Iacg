$(document).ready(
		function(){
			$('.nav').Fisheye({
				maxWidth: 50,
				items: 'a',
				itemsText: 'span',
				container: '.nav-item',
				itemWidth: 40,
				proximity: 60,
				alignment : 'left',
				valign: 'bottom',
				halign : 'center'
			})
		}
	);