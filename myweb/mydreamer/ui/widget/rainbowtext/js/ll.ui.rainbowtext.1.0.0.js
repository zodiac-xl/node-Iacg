// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------
// The file is an easy-to-use javascript ui library.
// Version: 1.0.0
// Author: Lancer Lin
// Website: www.linqing07.com/lancer_ui/catalog/index.html
// Email: lancer07@139.com , lancer07@126.com
// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------
if(typeof ll !== 'object'){ 
	var ll = {};
	ll.ui = {};
}
ll.ui.rainbowText = function(text){
	function createHexArray(n) {
	  this.length = n;
	  for (var i = 1; i <= n; i++)
	    this[i] = i - 1;
	    this[11] = "A";
	    this[12] = "B";
	    this[13] = "C";
	    this[14] = "D";
	    this[15] = "E";
	    this[16] = "F";
	    return this;
	}

	hx = new createHexArray(16);

	function convertToHex(x) {
	  if (x < 17) 
	    x = 16;
		
	  var high = x / 16;
	  var s = high+"";
	  
	  s = s.substring(0, 2);
	  high = parseInt(s, 10);
	  
	  var left = hx[high + 1];
	  var low = x - high * 16;

	  if (low < 1) 
	    low = 1;
	  s = low + "";
	  s = s.substring(0, 2);
	  low = parseInt(s, 10);
	  
	  var right = hx[low + 1];
	  var string = left + "" + right;
	  return string;
	}

	function makeRainbow(text) {
		text = text.substring(0, text.length);
		var rainbowString="";
		color_d1 = 255;
		mul = color_d1 / text.length;
		for(var i = 0; i < text.length; i++) {
			color_d1 = 255*Math.sin(i / (text.length / 3));
	 		color_h1 = convertToHex(color_d1);
	 		color_d2 = mul * i;
	 		color_h2 = convertToHex(color_d2);
			k = text.length;
	 		j = k - i;
	 		if (j < 0) 
				j = 0;
				color_d3 = mul * j;
	 			color_h3 = convertToHex(color_d3);
				rainbowString += ("<FONT COLOR=\"#" + color_h3 + color_h1 + color_h2 + "\">" + text.substring(i, i + 1) + "</FONT>");
		}
		return rainbowString
	}
	return makeRainbow(text)
}