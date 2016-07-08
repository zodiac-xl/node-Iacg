(function () {


	window.W = window.W || {};
	// 判断对象类型
	var is = reduce( {}, ["Array", "Boolean", "Date", "Function", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"], function ( is, typeName ) {
		is[typeName] = function ( obj ) {
			return Object.prototype.toString.call( obj ) == "[object " + typeName + "]";
		};
	} );

	function client() {
		var engine1 = {};
		var browser1 = {};
		var system1 = {};
		var engine = {
			//呈现引擎
			ie : 0,
			gecko : 0,
			webkit : 0,
			khtml : 0,
			opera : 0,
			//完整版本号
			ver : false
		};
		var browser = {
			//浏览器
			ie : 0,
			firefox : 0,
			safari : 0,
			opera : 0,
			chrome : 0,
			konq : 0,
			//完整版本号
			ver : false
		};
		var system = {
			//平台设备
			win : false,
			mac : false,
			x11 : false,

			//移动设备
			iphone : false,
			ipod : false,
			ipad : false,
			ios : false,
			android : false,
			nokiaN : false,
			winMobile : false,

			//游戏系统
			wii : false,
			ps : false
		};
		//检测呈现引擎、平台设备
		var ua = navigator.userAgent;
		if ( window.opera ) {
			engine.ver = browser.ver = window.opera.version();
			engine.opera = browser.opera = parseInt( engine.ver );
			engine1.name = browser1.name = "Opera";
			engine1.ver = browser1.ver = engine.opera;

		}
		else if ( /AppleWebKit\/(\S+)/.test( ua ) ) {
			engine.ver = RegExp["$1"];//上一个正则匹配到的第一个括号里面的内容 $0全部字符 $2第二个括号
			engine.webkit = parseFloat( engine.ver );
			engine1.name = "WebKit";
			engine1.ver = engine.webkit;
			//确定是chrome还是safari
			if ( /Chrome\/(\S+)/.test( ua ) ) {
				browser.ver = RegExp["$1"];
				browser.chrome = parseFloat( engine.ver );
				browser1.name = "Chrome";
				browser1.ver = browser.chrome;
			}
			else if ( /Version\/(\S+)/.test( ua ) ) {
				browser.ver = RegExp["$1"];
				browser.safari = parseFloat( engine.ver );
				browser1.name = "Safari";
				browser1.ver = browser.safari;
			}
			else {
				//近似地确定版本号
				var safariVersion = 1;
				if ( engine.webkit < 100 ) {
					safariVersion = 1;
				}
				else if ( engine.webkit < 312 ) {
					safariVersion = 1.2;
				}
				else if ( engine.webkit < 412 ) {
					safariVersion = 1.3;
				}
				else {
					safariVersion = 2;
				}
				browser.safari = browser.ver = safariVersion;
				browser1.ver = browser.safari;
			}
		}
		else if ( /KHTML\/(\s+)/.test( ua ) || /Konqueror\/([^;]+)/.test( ua ) ) {
			engine.ver = browser.ver = RegExp["$1"];
			engine.khtml = browser.konq = parseFloat( engine.ver );
			engine1.name = "khtml";
			browser1.name = "konq";
			engine1.ver = browser1.ver = engine.khtml;
		}
		else if ( /rv:([^\)]+)\) Gecko\/\d{8}/.test( ua ) ) {
			engine.ver = RegExp["$1"];
			engine.gecko = parseFloat( engine.ver );
			engine1.name = "gecko";
			engine1.ver = engine.gecko;
			//确定是否FireFox
			if ( /FireFox\/(\S+)/.test( ua ) ) {
				browser.ver = RegExp["$1"];
				browser.firefox = parseFloat( engine.ver );
				browser1.name = "FireFox";
				browser1.ver = browser.firefox;
			}
		}
		else if ( /MSIE ([^;]+)/.test( ua ) ) {
			engine.ver = browser.ver = RegExp["$1"];
			engine.ie = browser.ie = parseFloat( engine.ver );
			engine1.name = browser1.name = "ie";
			engine1.ver = browser1.ver = engine.ie;
		}
		//检测浏览器
		browser.ie = engine.ie;
		browser.opera = engine.opera;
		//检测平台
		var p = navigator.platform;
		system.win = p.indexOf( "Win" ) == 0;
		system.mac = p.indexOf( "Mac" ) == 0;
		system.Wl = (p == "X11") || (p.indexOf( "Linux" ) == 0);
		//检测windows操作系统
		if ( system.win ) {
			if ( /Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test( ua ) ) {
				if ( RegExp["$1"] == "NT" ) {
					switch ( RegExp["$2"] ) {
						case "5.0":
							system.win = "2000";
							break;
						case "5.1":
							system.win = "xp";
							break;
						case "6.0":
							system.win = "Vista";
							break;
						case "6.1":
							system.win = "7";
							break;
						case "6.3":
							system.win = "8";
							break;
						default :
							system.win = "NT";
							break;
					}
				}
				else if ( RegExp["$1"] == "9x" ) {
					system.win = "ME";
				}
				else {
					system.win = RegExp["$1"];
				}
			}
		}
		//移动设备
		system.iphone = ua.indexOf( "iPhone" ) > -1;
		system.ipad = ua.indexOf( "iPad" ) > -1;
		system.ipod = ua.indexOf( "iPod" ) > -1;
		system.nokiaN = ua.indexOf( "NokiaN" ) > -1;
		//检测iOS版本
		if ( system.mac && ua.indexOf( "Mobile" ) > -1 ) {
			if ( /CPU (?:iPhone )?OS (\d+_\d+)/.test( ua ) ) {
				system.ios = parseFloat( RegExp.$1.replace( "_", "." ) );
			}
			else {
				system.ios = 2;
			}
		}
		//检测Android版本
		if ( /Android (\d+\.\d+)/.test( ua ) ) {
			system.android = parseFloat( RegExp.$1 );
		}
		for ( var name in system ) {
			if ( system[name] ) {
				system1.name = name;
				system1.ver = system[name];
			}
		}
		return {
			engine : engine,
			browser : browser,
			system : system,
			engine1 : engine1,
			browser1 : browser1,
			system1 : system1
		};
	}

	var ua = function ( ua, appVersion, platform ) {
		return {
			// win系列
			win32 : platform === "Win32",
			ie : /MSIE ([^;]+)/.test( ua ),
			ieMobile : window.navigator.msPointerEnabled,
			ieVersion : Math.floor( ( /MSIE ([^;]+)/.exec( ua ) || [0, "0"] )[1] ),

			// ios系列
			ios : ( /iphone|ipad/gi ).test( appVersion ),
			iphone : ( /iphone/gi ).test( appVersion ),
			ipad : ( /ipad/gi ).test( appVersion ),
			iosVersion : parseFloat( ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec( ua ) || [0, ''])[1])
				.replace( 'undefined', '3_2' ).replace( '_', '.' ).replace( '_', '' ) ) || false,
			safari : /Version\//gi.test( appVersion ) && /Safari/gi.test( appVersion ),
			uiWebView : /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test( ua ),

			// 安卓系列
			android : ( /android/gi ).test( appVersion ),
			androidVersion : parseFloat( "" + ( /android ([0-9\.]*)/i.exec( ua ) || [0, ''] )[1] ),

			// 内核
			webkit : /AppleWebKit/.test( appVersion ),

			// 其他浏览器
			uc : appVersion.indexOf( "UCBrowser" ) !== -1,
			Browser : / Browser/gi.test( appVersion ),
			MiuiBrowser : /MiuiBrowser/gi.test( appVersion ),

			// 微信
			MicroMessenger : ua.toLowerCase().match( /MicroMessenger/i ) === "micromessenger"
		};
	}( navigator.userAgent, navigator.appVersion, navigator.platform );

	//全局判断touch和mouse事件
	var start, move, end;
	if ( isTouchDevice() ) {
		start = "touchstart";
		move = "touchmove";
		end = "touchend";
	}
	else {
		start = "mousedown";
		move = "mousemove";
		end = "mouseup";
	}
	function getType( x ) {
		return function () {
			if ( x == null ) {
				return "null";
			}
			var t = typeof x;
			if ( t != "object" ) {
				return t;
			}
			var c = Object.prototype.toString.apply( x );
			c = c.substring( 8, c.length - 1 );
			if ( c != "Object" ) {
				return c;
			}
			if ( x.constructor == Object ) {
				return c
			}


			return "<unknown type>";
		}().toLowerCase()

	}

	function loop( t, block ) {
		for ( var i = 0; i !== t; ++i ) {
			block( i );
		}
	}

	function loopArray( list, block ) {
		for ( var i = 0, len = list.length; i !== len; ++i ) {
			block( list[i], i );
		}
	}

	function loopObj( obj, block ) {
		for ( var key in obj ) {
			block( key, obj[key] );
		}
	}

	// 提供数组的top
	Object.defineProperty( Array.prototype, "top", {
		get : function () {
			return this[this.length - 1];
		},
		set : function ( val ) {
			this[this.length - 1] = val;
		}
	} );

	// 提供数组的删除和contains
	Array.prototype.remove = function ( arg ) {
		var retVal = [];
		loopArray( this, function ( item ) {
			is.Function( arg ) ? !arg( item ) && retVal.push( item ) : arg !== item && retVal.push( item );
		} );
		return retVal;
	};

	Array.prototype.contains = function ( arg ) {
		for ( var len = this.length, i = 0; i !== len; ++i ) {
			if ( is.Function( arg ) ? arg( this[i] ) : ( this[i] === arg ) ) {
				return true;
			}
		}
		return false;
	};
	// 操作数组
	function reduce( initValue, array, operate ) {
		loopArray( array, function ( item, i ) {
			var result = operate( initValue, item, i );
			if ( result !== undefined ) {
				initValue = result;
			}
		} );
		return initValue;
	}

	function insert( obj1, obj2 ) {
		loopObj( obj2, function ( key, value ) {
			obj1[key] = value;
		} );
		return obj1;
	}

	// 将obj1与obj2合并,不修改obj1
	function extend( obj1, obj2 ) {
		var retVal = {};
		insert( retVal, obj1 );
		insert( retVal, obj2 );
		return retVal;
	}

	// 双向链表
	function LinkedList() {
		var head = null, tail = null;
		var count = 0;

		function addTail( value ) {
			var node = Node( value );
			node.previous = tail;

			if ( tail === null ) {
				head = node;
			}
			else {
				tail.next = node;
			}
			tail = node;

			return node;
		}

		function Node( value ) {
			var node = {
				previous : null,
				next : null,
				value : value,
				remove : function () {
					--count;
					if ( node.previous !== null ) {
						node.previous.next = node.next;
					}
					else {
						head = node.next;
					}

					if ( node.next !== null ) {
						node.next.previous = node.previous;
					}
					else {
						tail = node.previous;
					}
				},
				insertBefore : function ( value ) {
					var newNode = Node( value );
					newNode.previous = node.previous;
					newNode.next = node;
					node.previous = newNode;
					if ( newNode.previous !== null ) {
						newNode.previous.next = newNode;
					}
					else {
						head = newNode;
					}
					return newNode;
				},
				insertAfter : function ( value ) {
					return node.next === null ? addTail( value ) : node.next.insertAfter( value );
				}
			};

			++count;
			return node;
		}

		return {
			addTail : addTail,
			addHead : function ( value ) {
				return head === null ? addTail( value ) : head.insertBefore( value );
			},
			head : function () {
				return head;
			},
			tail : function () {
				return tail;
			},
			count : function () {
				return count;
			}
		};
	}

	LinkedList.loop = function ( list, func ) {
		for ( var cur = list.head(); cur !== null; cur = cur.next ) {
			func( cur.value, cur );
		}
	};

	LinkedList.toArray = function ( list ) {
		var arr = [];
		LinkedList.loop( list, function ( value ) {
			arr.push( value );
		} );
		return arr;
	};
	// 连接数组
	function concat( arr1, arr2 ) {
		var retVal = [];
		loopArray( arr1, function ( val ) {
			retVal.push( val );
		} );
		loopArray( arr2, function ( val ) {
			retVal.push( val );
		} );
		return retVal;
	}

	function getPage( arr, page, pageSize ) {
		return arr.slice( page * pageSize, ( page + 1 ) * pageSize );
	}

	// 解析配对连接字符串,如name=tom&class=2&grade=3
	function parsePairString( str, split1, split2, doPair ) {
		loopArray( str.split( split1 ), function ( searchPair ) {
			var keyValue = searchPair.split( split2 );
			doPair( keyValue[0], keyValue[1] );
		} );
	}

	// 函数第一次被调用时执行回调
	function firstCall( func, callback ) {
		if ( !func.zFirstCall ) {
			callback();
			func.zFirstCall = true;
		}
	}

	// 将x限制在[a,b]或[b,a]内
	function range( x, a, b ) {
		if ( a <= b ) {
			return x < a ? a : x > b ? b : x;
		}
		else {
			return range( x, b, a );
		}
	}


	//util
	function addHandler( element, type, handler, bubble ) {
		if ( typeof bubble == undefined ) {
			bubble = false;
		}
		if ( element.addEventListener ) {
			element.addEventListener( type, handler, bubble );
			return handler; //true表示在捕获阶段触发 false在冒泡阶段
		}
		else if ( element.attachEvent ) {
			element.attachEvent( type, handler );
		}
		else {
			element["on" + type] = handler;
		}
		return {
			remove : function () {
				if ( element.removeEventListener ) {
					element.removeEventListener( type, handler, bubble );
				}
				else if ( element.detachEvent ) {
					element.detachEvent( type, handler );
				}
				else {
					element["on" + type] = null;
				}
			},
			handle : handler
		};
	}

	function removeHandler( element, type, handler ) {
		if ( element.removeEventListener ) {
			element.removeEventListener( type, handler, false );
		}
		else if ( element.detachEvent ) {
			element.detachEvent( type, handler );
		}
		else {
			element["on" + type] = null;
		}
	}

	function getEvent( event ) {
		return event ? event : window.event;
	}

	function getEventTarget( event ) {
		var ev;
		ev = event ? event : window.event;
		return ev.target || ev.srcElement;
	}

	function preventDefault( event ) {
		var ev;
		ev = event ? event : window.event;
		if ( ev.preventDefault ) {
			ev.preventDefault();
		}
		else {
			ev.returnValue = false;
		}
		return this;
	}

	function isTouchDevice() {
		var tf = false;
		if ( "ontouchend" in document ) {
			tf = true;
		}
		return tf;
	}

	// 取移动的事件坐标用
	function EventCoordinate( coordinateName ) {
		return function ( event ) {
			return "touches" in event && event.touches[0] !== undefined ? event.touches[0][coordinateName] : event[coordinateName];
		}
	}

	var getPageX = EventCoordinate( "pageX" ), getPageY = EventCoordinate( "pageY" );
	var getClientX = EventCoordinate( "clientX" ), getClientY = EventCoordinate( "clientY" );


	function swipe( element, func ) {
		var moveHandle;
		var pos = [];
		var dir = [];
		addHandler( element, start, function ( evt ) {
			//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
			var touch = evt.touches && evt.touches[0] || evt; //获取第一个触点
			var x1 = Number( touch.pageX );
			var y1 = Number( touch.pageY );
			//记录触点初始位置
			pos.push( {pageX : x1, pageY : y1, timeStamp : evt.timeStamp, dir : " "} );
			moveHandle = addHandler( element, move, function ( evt ) {
				//evt.preventDefault();
				var touch = evt.touches && evt.touches[0] || evt;  //获取第一个触点
				var x = Number( touch.pageX ); //页面触点X坐标
				var y = Number( touch.pageY ); //页面触点Y坐标
				pos.push( {pageX : x, pageY : y, timeStamp : evt.timeStamp, dir : " "} );
				if ( pos.length >= 2 ) {
					if ( Math.abs( pos[pos.length - 1].pageX - pos[pos.length - 2].pageX ) >= Math.abs( pos[pos.length - 1].pageY - pos[pos.length - 2].pageY ) ) {
						dir.push( 0 );
					}
					else {
						dir.push( 1 );
					}
					var timeDiff = pos[pos.length - 1].timeStamp - pos[pos.length - 2].timeStamp;
				}
				if ( dir.length > 1 ) {
					if ( dir[dir.length - 1].dir !== dir[dir.length - 2].dir || timeDiff > 200 ) {
						// 如果转向或者两次移动时间间隔超过200毫秒,重新计时
						pos = [];
						dir = [];
					}
				}
			} )
		} );

		addHandler( element, end, function () {
			//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
			if ( pos.length >= 2 ) {
				var time = pos[pos.length - 1].timeStamp - pos[0].timeStamp;
				while ( time > 300 ) {  //只取300ms内数据
					pos.shift();
					time = pos[pos.length - 1].timeStamp - pos[0].timeStamp;
				}
				if ( pos.length >= 2 ) {
					for ( var i = 0; i < pos.length; i++ ) {
						pos[i].dir = dir[i];
					}
					var distanceX = pos[pos.length - 1].pageX - pos[0].pageX;
					var distanceY = pos[pos.length - 1].pageY - pos[0].pageY;
					var data = {
						direction : pos[pos.length - 2].dir,
						distanceX : distanceX,
						distanceY : distanceY,
						time : time };
					pos = [];
					dir = [];
					func( data );
				}

			}
			moveHandle.remove();
		} );
	}

	function tap( element, func ) {
		var endTime, startTime;
		addHandler( element, start, function ( evt ) {
			startTime = evt.timeStamp;
		} );
		addHandler( element, end, function ( evt ) {
			endTime = evt.timeStamp;
			func();
		} );
	}

	function tapHold( element, func ) {
		var endTime, startTime;

		addHandler( element, start, function ( evt ) {
			startTime = evt.timeStamp;
		} );
		addHandler( element, end, function ( evt ) {
			endTime = evt.timeStamp;
			if ( endTime - startTime > 750 ) {
				func();
			}
		} )
	}

	function getWheelDelta( ev ) {
		if ( ev.wheelDelta ) {
			return(client.engine.opera && client.engine.opera < 9.5 ? -ev.wheelDelta : ev.wheelDelta)
		}
		else {
			return -ev.detail * 40;
		}
	}

	function getCharCode( event ) {
		var code = event.charCode == "number" ? event.charCode : event.keyCode;
		var charCode = {
			code : code,
			name : String.fromCharCode( code )
		};
		return charCode;
	}

	function log( mes ) {
		var console = document.getElementById( "debug" );
		if ( console == null ) {
			console = document.createElement( "div" );
			css( console, {
				id : "debug",
				background : "#dedede",
				border : "1px solid silver",
				padding : "5px",
				width : "400px",
				position : "absolute",
				right : "0",
				top : "0"
			} );
			document.body.appendChild( console );
		}
		console.innerHTML += "<p>" + mes + "</p>";
	}

	function follow( element, type, bl, func, screenW, screenH ) { //type=0||1||2 水平 竖直 综合

		var startX = 0, startY = 0;
		var x, y;
		var gesture;
		var moveHandle, endHandle;
		var minX = 100, minY = 100;
		addHandler( element, start, function ( evt ) {
			moveHandle = endHandle = true;
			var touch = evt.touches && evt.touches[0] || evt; //获取第一个触点
			var touch2 = evt.touches && evt.touches[1];
			gesture = 0;
			if ( touch2 ) {
				gesture = 1;
			}
			var x1 = Number( touch.pageX ); //页面触点X坐标
			var y1 = Number( touch.pageY ); //页面触点Y坐标
			addHandler( element, move, function ( evt ) {
				evt.preventDefault();

				if ( moveHandle ) {
					var touch = evt.touches && evt.touches[0] || evt;  //获取第一个触点
					var x2 = Number( touch.pageX ); //页面触点X坐标
					var y2 = Number( touch.pageY ); //页面触点Y坐标
					x = x2 - x1 + startX;
					y = y2 - y1 + startY;
					if ( type == "" || undefined ) {
						type = 0;
					}
					if ( type == 0 ) {
						y = 0;
					}
					else if ( type == 1 ) {
						x = 0
					}
					if ( gesture == 0 ) {
						if ( x > screenW - minX ) {
							x = screenW - minX;
						}
						if ( x < -(screenW - minX) ) {
							x = -(screenW - minX);
						}
						if ( y > screenH - minY ) {
							y = screenH - minY;
						}
						if ( y < -(screenH - minY) ) {
							y = -(screenH - minY);
						}
						if ( bl == true ) {
							css( element, {
								"position" : "relative",
								"left" : x + "px",
								"top" : y + "px"
							} )
						}
						else {
							css( element, {
								"transform" : "translate3d(" + x + "px" + "," + y + "px" + ",0)",
								"-webkit-transform" : "translate3d(" + x + "px" + "," + y + "px" + ",0)"
							} )

						}
					}

				}

			} );


		} );
		addHandler( document, end, function touchEndFunc( event ) {
			event.preventDefault();
			if ( endHandle ) {
				var evt = [];
				startX = x;
				startY = y;
				evt.el = element;
				evt.myX = x;
				evt.myY = y;
				if ( func ) {
					func( evt );
				}

			}
			endHandle = moveHandle = false;


		} )

	}

	function gestureChange( ele, fun ) {
		var data = [];
		//全局变量，触摸开始位置
		var x10, y10, x20, y20;
		addHandler( ele, start, function touchSatrtFunc( evt ) {
			var touch1 = evt.touches && evt.touches[0] || evt; //获取第一个触点
			var touch2 = evt.touches && evt.touches[1];
			if ( touch2 ) {

				x10 = Number( touch1.pageX ); //页面触点X坐标
				y10 = Number( touch1.pageY ); //页面触点Y坐标
				x20 = Number( touch2.pageX ); //页面触点X坐标
				y20 = Number( touch2.pageY ); //页面触点Y坐标


				addHandler( ele, move, function touchMoveFunc( evt ) {
					var touch11 = evt.touches && evt.touches[0] || evt; //获取第一个触点
					var touch22 = evt.touches && evt.touches[1];
					if ( touch22 && x10 != null ) {
						var x11 = Number( touch11.pageX ); //页面触点X坐标
						var y11 = Number( touch11.pageY ); //页面触点Y坐标
						var x21 = Number( touch22.pageX ); //页面触点X坐标
						var y21 = Number( touch22.pageY ); //页面触点Y坐标
						var scaleX = (x21 - x11) / (x20 - x10);
						var scaleY = (y21 - y11) / (y20 - y10);
						data.scaleX = Math.abs( scaleX );
						data.scaleY = Math.abs( scaleY );
						fun( data );
					}
				} );
				addHandler( ele, end, function touchEndFunc() {
					x10 = null;
				} );

			}

		} )


	}

	//DOM
	// 遍历节点
	function loopNodeList( node, func, className ) {
		if ( node && node.nextElementSibling !== undefined ) {
			while ( node ) {
				var nextNode = node.nextElementSibling;
				className ? node.classList.contains( className ) && func( node ) : func( node );
				node = nextNode;
			}
		}
		else if ( node && node.length ) {
			loopArray( node, func );
		}
	}

	// 判断一个元素是否在文档中
	function inDocument( el ) {
		while ( el !== null ) {
			if ( el === document.documentElement ) {
				return true;
			}
			el = el.parentNode;
		}
		return false;
	}

	function removeNode( el ) {
		el.parentNode.removeChild( el );
	}

	// 加载到头部
	function appendHead( srcNode, tarNode ) {
		srcNode.insertBefore( tarNode, srcNode.firstChild );
		return tarNode;
	}

	// 将源元素的全部子元素添加到目标元素中
	function appendChildren( srcNode, tarNode ) {
		var nodeList = tarNode.childNodes, len = nodeList.length;
		while ( len-- !== 0 ) {
			srcNode.appendChild( nodeList[0] );
		}
	}

// 抽取属性,抽取后将该属性删除
	function extractAttribute( el, attrName ) {
		var retVal = el.getAttribute( attrName );
		el.removeAttribute( attrName );
		return retVal;
	}

// 处理选择器选子元素和选自己的问题
	function querySelectorAll( el, selector, isChild ) {
		var parentNode;
		if ( el === document ) {
			return document.querySelectorAll( selector );
		}
		else if ( el.parentNode ) {
			parentNode = el.parentNode;
		}
		else {
			parentNode = document.createElement( "div" );
			parentNode.appendChild( el );
		}

		el.setAttribute( "data-s", "" );
		var result = isChild ? parentNode.querySelectorAll( "[data-s] > " + selector ) :
			parentNode.querySelectorAll( selector + "[data-s], [data-s] " + selector );
		el.removeAttribute( "data-s" );

		return result;
	}

// 根据属性处理元素
	function doNodeByAttribute( root, attrName, func ) {
		function doAttr( attrName ) {
			querySelectorAll( root, "[" + attrName + "]", function ( node ) {
				func( node, extractAttribute( node, attrName ), attrName );
			} );
		}

		is.Array( attrName ) ? loopArray( attrName, doAttr ) : doAttr( attrName );
	}

	// 创建一个元素的快捷方式
	function element( tagName, arg, parentNode ) {
		function doClass( value ) {
			if ( is.String( value ) ) {
				addClass( el, value );
			}
			else if ( is.Array( value ) ) {
				loopArray( value, function ( className ) {
					addClass( el, className )
				} );
			}
		}

		var el = document.createElement( tagName );
		if ( is.Object( arg ) ) {
			loopObj( arg, function ( key, value ) {
				if ( value !== undefined ) {
					switch ( key ) {
						case "classList":
							doClass( value );
							break;
						case "css":
							css( el, value );
							break;
						case "attr":
							loopObj( el, function ( key, value ) {
								el.setAttribute( key, value );
							} );
							break;
						case "innerHTML":
							el.innerHTML = value;
							break;
						case "src":
						case "href":
						case "title":
							el.setAttribute( key, value );
							break;
						case "child":
							if ( is.Array( value ) ) {
								loopArray( value, function ( node ) {
									el.appendChild( node );
								} );
							}
							else {
								el.appendChild( value );
							}
							break;
						default:
							if ( key.substring( 0, 5 ) === "data-" ) {
								el.setAttribute( key, value );
							}
							break;
					}
				}
			} );
		}
		else {
			doClass( arg );
		}

		parentNode && parentNode.appendChild( el );
		return el;
	}

	// 加载脚本
	function loadScript( scriptSrc, onLoad ) {
		var script = document.createElement( "script" );
		script.src = scriptSrc;
		addHandler( script, "load", onLoad );
		document.head.appendChild( script );
		return script;
	}

	function hasClass( ele, cls ) {
		return ele.className.match( new RegExp( '(\\s|^)' + cls + '(\\s|$)' ) );
	}

	function addClass( ele, cls ) {
		if ( ele.querySelector ) {
			ele.classList.add( cls );
		}
		else {
			if ( !hasClass( ele, cls ) ) ele.className += " " + cls;
		}

	}

	function removeClass( ele, cls ) {
		if ( hasClass( ele, cls ) ) {
			var reg = new RegExp( '(\\s|^)' + cls + '(\\s|$)' );
			ele.className = ele.className.replace( reg, ' ' );
		}
	}

	// 切换状态
	function toggleClass( el, str ) {
		hasClass( el, str ) ? removeClass( el, str ) : addClass( el, str );
	}

// 根据flag,添加或删除class
	function switchClass( el, className, flag ) {
		flag ? el.classList.add( className ) : el.classList.remove( className );
	}

	// region CSS
	// 非标准样式
	var nonstandardStyles = {
		transform : ["-webkit-transform", "-ms-transform", "transform"],
		transition : ["-webkit-transition", "transition"],
		animation : ["-webkit-animation"],
		"animation-play-state" : ["-webkit-animation-play-state"],
		"transform-style" : ["-webkit-transform-style", "transform-style"],
		perspective : ["-webkit-perspective", "perspective"]
	};

	// 设置CSS值,可以设置一条或者设置一组
	function autoLayout( ele, min, max ) {

		var n = 0;
		var li = ele;
		for ( var i = 0; i < li.length; i++ ) {
			if ( (li[i].offsetTop < li[i].parentNode.offsetTop) || ((li[0].offsetTop + li[i].offsetHeight) > (li[i].parentNode.offsetTop + li[i].parentNode.offsetHeight)) || ((li[i].offsetWidth + min) * i + li[0].offsetWidth) > li[i].parentNode.offsetWidth ) {
				break;
			}
			else {
				n += 1;
			}
		}

		var m = (li[0].parentNode.offsetWidth - li[0].offsetWidth * n) / (n - 1);
		if ( m > max ) {
			var m1 = (li[0].parentNode.offsetWidth - li[0].offsetWidth * n) / (n + 1);
			for ( var k = 0; k < li.length; k++ ) {
				css( li[k], {
					"margin-left" : m1 + "px"
				} );
			}

			css( li[li.length - 1], {
				"margin-right" : m1 + "px"
			} );
		}
		else {
			for ( var j = 1; j < li.length; j++ ) {
				css( li[j], {
					"margin-left" : m + "px"
				} );
			}
		}
	}

	function autoCenter( element, type ) {
		//var maxMultiple = 1.2;

		function doAutoCenter( ele ) {


			if ( getCurrentStyle( ele, "position" ) == "static" ) {
				css( ele, {
					position : "relative"
				} )
			}
			var h = ele.parentNode.offsetHeight / ele.offsetHeight;
			var w = ele.parentNode.offsetWidth / ele.offsetWidth;
			var zoom = h >= w ? h : w;
			css( ele, {
				zoom : zoom
			} );
			var top = (ele.parentNode.offsetHeight - ele.offsetHeight * zoom) / 2;
			var left = (ele.parentNode.offsetWidth - ele.offsetWidth * zoom) / 2;
			if ( type ) {
				if ( type == 0 ) {
					css( ele, {
						top : top + "px"
					} )
				}
				else if ( type == 1 ) {
					css( ele, {
						left : top + "px"
					} )
				}
			}
			else {
				css( ele, {
					top : top + "px",
					left : left + "px"
				} )
			}
		}

		is.Array( element ) ? loopArray( element, function ( node ) {
			doAutoCenter( node )
		} ) : doAutoCenter( element );


	}

	function css( el, arg1, isRemove ) {
		function setStyle( styleName, styleValue ) {
			function doStyle( styleName ) {
				isRemove ? el.style.removeProperty( styleName ) : el.style.setProperty( styleName, styleValue, "" );
			}

			styleName in nonstandardStyles ? loopArray( nonstandardStyles[styleName], doStyle ) : doStyle( styleName );

		}

		loopObj( arg1, setStyle );
	}

	// 移除CSS值,可以移除一条,或者移除一组
	function removeCss( el, styleName ) {
		function removeStyle( styleName ) {
			function doStyle( styleName ) {
				el.style.removeProperty( styleName );
			}

			styleName in nonstandardStyles ? loopArray( nonstandardStyles[styleName], doStyle ) : doStyle( styleName );
		}

		getType( styleName ) == "string" ? removeStyle( styleName ) : loopArray( styleName, removeStyle );
	}

	function getStyle( element, name ) {
		return element.style.getPropertyValue( name );
	}

	function getCurrentStyle( ele, name ) {
		return window.getComputedStyle ? window.getComputedStyle( ele, null )[name] : ele.currentStyle[name];
	}

	// 生成CSS样式字符串
	function cssRuleString( selector, cssStyles ) {
		var ruleText = selector + "{";
		loopObj( cssStyles, function ( styleName, styleValue ) {
			ruleText += styleName + ":" + styleValue + ";";
		} );
		ruleText += "}";
		return ruleText;
	}

	function addCssSheet( selector, cssText ) {
		var cssCode = cssRuleString( selector, cssText );
		log( cssCode );
		var headElement = document.getElementsByTagName( "head" )[0];
		var styleElements = headElement.getElementsByTagName( "style" );
		if ( styleElements.length == 0 ) {//如果不存在style元素则创建
			if ( document.createStyleSheet ) {    //ie
				document.createStyleSheet();
			}
			else {
				var tempStyleElement = document.createElement( 'style' );//w3c
				tempStyleElement.setAttribute( "type", "text/css" );
				headElement.appendChild( tempStyleElement );
			}
		}
		var styleElement = styleElements[0];
		if ( styleElement.styleSheet ) {    //ie
			styleElement.styleSheet.cssText += cssCode;
		}
		else if ( document.getBoxObjectFor ) {
			styleElement.innerHTML += cssCode;//火狐支持直接innerHTML添加样式表字串
		}
		else {
			styleElement.appendChild( document.createTextNode( cssCode ) );
		}
	}

	function addSheetFile( path, cl ) {
		var fileRef = document.createElement( "link" );
		fileRef.rel = "stylesheet";
		fileRef.type = "text/css";
		fileRef.href = path;
		fileRef.media = "screen";
		cl ? (fileRef.cl = cl) : "";
		var headObj = document.getElementsByTagName( 'head' )[0];
		headObj.appendChild( fileRef );
	}


	//animate
	// 伴随节点的动画,插入文档时启动,移除文档时停止
	function nodeAnimate( node, animate ) {
		addHandler( node, "DOMNodeInsertedIntoDocument", animate.start );
		addHandler( node, "DOMNodeRemovedFromDocument", animate.stop );
	}

	function whichTransitionEvent() {
		var t;
		var el = document.createElement( 'fakeelement' );
		var transitions = {
			'transition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'MozTransition' : 'transitionend',
			'WebkitTransition' : 'webkitTransitionEnd',
			'MsTransition' : 'msTransitionEnd'
		};

		for ( t in transitions ) {
			if ( el.style[t] !== undefined ) {
				return transitions[t];
			}
		}
	}

	function transition( el, style, onEnd ) {
		css( el, style );
		/* 监听 transition! */
		var transitionEvent = whichTransitionEvent();
		var endHandle = addHandler( el, transitionEvent, function () {
			onEnd();
			removeHandler( endHandle );
		} );
	}

	// 计时器
	function Timer( task, interval ) {
		var timeout = null; // timeout句柄

		// 清除timeout句柄
		function removeTimeout() {
			if ( timeout !== null ) {
				window.clearTimeout( timeout );
			}
			timeout = null;
		}

		// 启动计时器
		function start() {
			removeTimeout();
			timeout = window.setTimeout( function () {
				timeout = window.setTimeout( arguments.callee, interval );
				task();
			}, interval );
		}

		start();

		return {
			start : start,
			stop : removeTimeout
		};
	}

	// region url与ajax
	function url( path, arg, hash ) {
		var url = path, i = 0;
		arg && loopObj( arg, function ( name, value ) {
			url += value ? ( i++ === 0 ? "?" : "&" ) + encodeURIComponent( name ) + "=" + encodeURIComponent( value ) : "";
		} );
		url += hash ? "#" + hash : "";
		return url;
	}

	//onLoad
	function onLoad( callback ) {
		addHandler( window, "load", callback );
	}

	function equals( a, b ) {
		if ( a == b ) {
			return true;
		}
		if ( typeof (b) == "undefined" || b == null || typeof (b) != "object" ) {
			return false;
		}
		var length = 0;
		var length1 = 0;
		for ( var ele1 in a ) {
			length++;
		}
		for ( var ele2 in b ) {
			length1++;
		}
		if ( length != length1 ) {
			return false;
		}
		if ( b.constructor == a.constructor ) {
			for ( var ele in a ) {
				if ( typeof (a[ele]) == "object" ) {
					if ( !equals( a[ele], b[ele] ) ) {
						return false;
					}
				}
				else if ( typeof (a[ele]) == "function" ) {
					if ( !equals( a[ele].toString(), b[ele].toString() ) ) {
						return false;
					}
				}
				else if ( a[ele] != b[ele] ) {
					return false;
				}
			}
			return true;
		}
		return false;

	}

	insert( window.W, {

		//debug
		ua : ua,
		client : client,//客户端检
		log : log,//console.log
		getType : getType,//获取对象type


		//方法util
		loop : loop,//循环
		loopArray : loopArray,//遍历数组
		loopObj : loopObj,//遍历对象
		reduce : reduce,
		is : is,
		insert : insert,//合并对象
		extend : extend,//// 将obj1与obj2合并,不修改obj1
		concat : concat,//链接数组
		equals : equals,////Object.prototype.equals比较对象
		LinkedList : LinkedList,//双向链表
		getPage : getPage,
		parsePairString : parsePairString,// 解析配对连接字符串,如name=tom&class=2&grade=3
		firstCall : firstCall,//函数在第一次调用时执行
		range : range,// 将x限制在[a,b]或[b,a]内


		//事件event
		addHandler : addHandler,//添加事件
		removeHandler : removeHandler,//移除事件
		getEvent : getEvent,//获取事件
		getEventTarget : getEventTarget,//获取事件源
		preventDefault : preventDefault,//阻止默认
		EventCoordinate : EventCoordinate,//取移动事件的坐标
		swipe : swipe,//滑动
		tap : tap,//轻触或点击
		tapHold : tapHold,//长按
		getWheelDelta : getWheelDelta,//鼠标滑轮事件
		getCharCode : getCharCode,//获取键码
		follow : follow,//跟随
		gestureChange : gestureChange,//缩放

		//DOM
		loopNodeList : loopNodeList,//遍历节点
		querySelectorAll : querySelectorAll,// 处理选择器选子元素和选自己的问题
		inDocument : inDocument,//判断节点是否在文档中
		removeNode : removeNode,
		appendHead : appendHead,//appendChild到目标元素的第一个子元素
		appendChildren : appendChildren,// 将源元素的全部子元素添加到目标元素中
		extractAttribute : extractAttribute,//抽取属性 并删除原属性
		element : element,//快速创建一个元素
		loadScript : loadScript,
		hasClass : hasClass,
		addClass : addClass,
		removeClass : removeClass,
		switchClass : switchClass,// 根据flag,添加或删除class
		toggleClass : toggleClass,

		//css
		css : css,//插入或删除内嵌样式
		removeCss : removeCss,
		getStyle : getStyle,//获取内嵌style样式
		addCssSheet : addCssSheet,//插入或删除内联css样式
		getCurrentStyle : getCurrentStyle,//currentStyle包含内嵌style和运行时的runtimeStyle 包含内联
		addSheetFile : addSheetFile,
		autoLayout : autoLayout,//自动计算左右边距
		autoCenter : autoCenter,

		//animate
		nodeAnimate : nodeAnimate,
		transition : transition,
		Timer : Timer,

		//ajax
		url : url,

		// 加载
		onLoad : onLoad


	} );
})();


	

	