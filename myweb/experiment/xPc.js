/**
 * Created by 小龙 on 2014/6/23.
 */
(function () {

	//region 常量
	var SwipeRadius = 5; // 扫半径

	//endregion

	//全局判断touch和mouse事件
	var start, move, end;
	//window.navigator.msPointerEnabled  判断浏览器是否支持MSPointer相关的事件，而不会判断用户的设备是否支持触摸操作。
	//window.navigator.msMaxTouchPoints 判断用户的设备是否支持触摸操作。
	if ( window.navigator.msMaxTouchPoints) {
		start = "MSPointerMove";
		move = "MSPointerUp";
		end = "MSPointerDown";
	}
	else if ( isTouchDevice() ) {
		start = "touchstart";
		move = "touchmove";
		end = "touchend";
	}
	else {
		start = "mousedown";
		move = "mousemove";
		end = "mouseup";
	}
	// region 浏览器检测
	var client = function client() {
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
			if ( /FireFox\/(\S+)/gim.test( ua ) ) {
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
	}();
	var ua = function ( ua, appVersion, platform ) {
		var canTouch = ("ontouchstart" in document) || (window.DocumentTouch && document instanceof DocumentTouch);
		if ( (/Chrome/gi).test( ua ) && (platform === "Win32") ) {
			canTouch = false;
		}
		return {
			// win系列
			win32 : platform === "Win32",
			ie : /MSIE ([^;]+)/.test( ua ),
			ieMobile : window.navigator.msPointerEnabled,
			ieVersion : Math.floor( (/MSIE ([^;]+)/.exec( ua ) || [0, "0"])[1] ),

			// ios系列
			ios : (/iphone|ipad/gi).test( appVersion ),
			iphone : (/iphone/gi).test( appVersion ),
			ipad : (/ipad/gi).test( appVersion ),
			iosVersion : parseFloat( ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec( ua ) || [0, ''])[1])
				.replace( 'undefined', '3_2' ).replace( '_', '.' ).replace( '_', '' ) ) || false,
			safari : /Version\//gi.test( appVersion ) && /Safari/gi.test( appVersion ),
			uiWebView : /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test( ua ),

			// 安卓系列
			android : (/android/gi).test( appVersion ),
			androidVersion : parseFloat( "" + (/android ([0-9\.]*)/i.exec( ua ) || [0, ''])[1] ),

			// 内核
			webkit : /AppleWebKit/.test( appVersion ),

			// 其他浏览器
			uc : appVersion.indexOf( "UCBrowser" ) !== -1,
			Browser : / Browser/gi.test( appVersion ),
			MiuiBrowser : /MiuiBrowser/gi.test( appVersion ),

			// 微信
			MicroMessenger : ua.toLowerCase().match( /MicroMessenger/i ) == "micromessenger",
			BaiDuBoxApp : ua.toLowerCase().match( /BaiDuBoxApp/i ) == "baiduboxapp",
			// 其他
			canTouch : canTouch
		};
	}( navigator.userAgent, navigator.appVersion, navigator.platform );
	// endregion


//Object.defineProperty(obj, prop, descriptor)
//	value:属性的值
//	writable:如果为false，属性的值就不能被重写。
//get: 一旦目标属性被访问就会调回此方法，并将此方法的运算结果返回用户。
//set:一旦目标属性被赋值，就会调回此方法。
//configurable:如果为false，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化。
//enumerable:是否能在for...in循环中遍历出来或在Object.keys中列举出来。
	Object.defineProperty( String.prototype, "hash", {
		get : function () {
			/#(.*)/gim.test( this );
			return RegExp["$1"];
		}
	} );
	Object.defineProperty( String.prototype, "path", {
		get : function () {
			/(.*)\?/gim.test( this );
			return RegExp["$1"];
		}
	} );

	Object.defineProperty( String.prototype, "arg", {
		get : function () {
			var arg = {},
				argString = "";
			/\?([^#]*)/gim.test( this );
			argString = RegExp["$1"];
			parsePairString( decodeURIComponent( argString ) || "", "&", "=", function ( key, value ) {
				key !== "" && (arg[key] = value);
			} );
			return arg;
		}
	} );


	//替换全部

	String.prototype.replaceAll = function ( s1, s2 ) {
		return this.replace( new RegExp( s1, "gm" ), s2 )
	};


	String.prototype.startWith = function ( s ) {
		return this.indexOf( s ) == 0
	};
	String.prototype.endWith = function ( s ) {
		var d = this.length - s.length;
		return (d >= 0 && this.lastIndexOf( s ) == d)
	};

	//转义html标签

	function HtmlEncode( text ) {
		return text.replace( /&/g, '&' ).replace( /\"/g, '"' ).replace( /</g, '<' ).replace( />/g, '>' )
	}


	// region  util
	// 运行脚本
	var is = function () {
		var retVal = {};
		loopArray( ["Array", "Boolean", "Date", "Function", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"], function ( typeName ) {
			retVal[typeName] = function ( obj ) {
				return Object.prototype.toString.call( obj ) == "[object " + typeName + "]";
			};
		} );
		return retVal;
	}();

	function run( str ) {
		new Function( str )();
		//eval(str);
	}

	// 判断x是否在[a,b)或[b,a)区间内
	function inRange( x, a, b ) {
		if ( a <= b ) {
			return x >= a && x < b;
		}
		else {
			return inRange( x, b, a );
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

	// 平方函数
	function square( x ) {
		return x * x;
	}

	// 循环
	function loop( t, block ) {
		for ( var i = 0; i !== t; ++i ) {
			block( i );
		}
	}

	// 遍历数组
	function loopArray( list, block ) {
		for ( var i = 0, len = list.length; i !== len; ++i ) {
			block( list[i], i );
		}
	}

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

	// 提供数组的top
	Object.defineProperty( Array.prototype, "top", {//为数组原形Array.prototype添加对象的属性get和set方法 属性名为top
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
			if ( is.Function( arg ) ? arg( this[i] ) : (this[i] === arg) ) {
				return true;
			}
		}
		return false;
	};

	// 遍历对象
	function loopObj( obj, block ) {
		for ( var key in obj ) {
			block( key, obj[key] );
		}
	}

	// 将obj1与obj2合并,不修改obj1
	function extend( obj1, obj2 ) {
		var retVal = {};
		insert( retVal, obj1 );
		insert( retVal, obj2 );
		return retVal;
	}

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

	// 解析配对连接字符串,如name=tom&class=2&grade=3
	function parsePairString( str, split1, split2, doPair ) {
		loopArray( str.split( split1 ), function ( searchPair ) {
			var keyValue = searchPair.split( split2 );
			doPair( keyValue[0], keyValue[1] );
		} );
	}

	// 将一个对象插入到另一个对象,修改obj1
	function insert( obj1, obj2 ) {
		loopObj( obj2, function ( key, value ) {
			obj1[key] = value;
		} );
		return obj1;
	}

	function equals( a, b ) {
		if ( a === b ) {
			return true;
		}
		if ( typeof (b) == "undefined" || b == null || typeof (b) != "object" ) {
			return false;
		}
		var length = 0;
		var length1 = 0;
		loopObj( a, function () {
			length++;
		} );
		loopObj( b, function () {
			length1++;
		} );
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
				else if ( a[ele] !== b[ele] ) {
					return false;
				}
			}
			return true;
		}
		return false;

	}

	function isInArr( item, arr ) {
		for ( var i = 0; i < arr.length; i++ ) {
			if ( equals( item, arr[i] ) ) {
				return true;
			}
		}
		return false;
	}

	Array.prototype.unique = function () {
		var result = []; //一个新的临时数组
		for ( var i = 0; i < this.length; i++ ) //遍历当前数组
		{
			//如果当前数组的第i已经保存进了临时数组，那么跳过，
			//否则把当前项push到临时数组里面
			if ( isInArr( this[i], result ) ) {
				result.push( this[i] );
			}
		}
		return result;
	};
	function hasPrototypeProperty( object, name ) {
		return !object.hasOwnProperty( name ) && (name in object);
	}

	function hasPlugin( name ) {
		name = name.toLowerCase();
		for ( var i = 0; i < navigator.plugins.length; i++ ) {
			if ( navigator.plugins[i].name.toLowerCase().indexOf( name ) > -1 ) {
				return true
			}
		}
		return false;
	}


	// 函数第一次被调用时执行回调
	function firstCall( func, callback ) {
		if ( !func.FirstCall ) {
			callback();
			func.FirstCall = true;
		}
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

	//寄生组合继承
	function inheritPrototype( subType, superType ) {//subType继承superType
		var prototype = Object( superType.prototype );
		prototype.constructor = subType;
		subType.prototype = prototype;
	}


	// endregion

	// region DOM
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

	function onInsert( el, response ) {
		if ( inDocument( el ) ) {
			response && response();
		}
		else {
			var insertEvent = addHandler( el, "DOMNodeInsertedIntoDocument", function () {
				response && response( el );
				insertEvent.remove();
			} );
		}
	}

	//insertDom type
	//1.     beforeBegin: 插入到标签开始前
	//2.     afterBegin:插入到标签开始标记之后
	//3.     beforeEnd:插入到标签结束标记前
	//4.     afterEnd:插入到标签结束标记后
	function insertDom( html, type, ele ) {
		ele.insertAdjacentHTML( type, html );
	}

	function containsNode( refNode, otherNode ) {
		if ( typeof refNode.contains == "function" && (!client.engine.webkit || client.engine.webkit >= 522) ) {
			return refNode.contains( otherNode );
		}
		else if ( typeof refNode.compareDocumentPosition == "function" ) {


			//Bits          Number        Meaning
			//000000         0              元素一致
			//000001         1              节点在不同的文档（或者一个在文档之外）
			//000010         2              节点 B 在节点 A 之前
			//000100         4              节点 A 在节点 B 之前
			//001000         8              节点 B 包含节点 A
			//010000         16             节点 A 包含节点 B
			//100000         32             浏览器的私有使用
			return !!(refNode.compareDocumentPosition( otherNode ) & 16);
		}
		else {
			var node = otherNode.parentNode;
			do {
				if ( node == refNode ) {
					return true;
				}
				else {
					node = node.parentNode;
				}
			}
			while ( node != null );
			return false;
		}
	}

	function getInnerText( ele ) {
		return (typeof ele.textContent == "function") ? ele.textContent : ele.innerText; //IE下有个innerText属性，FF下有个textContent属性
	}

	function setInnerText( ele, text ) {
		if ( typeof ele.textContent == "function" ) {
			ele.textContent = text;
		}
		else {
			ele.innerText = text;
		}
	}

	//  获取移动设备初始化大小
	function getInitZoom() {
		if ( !this._initZoom ) {
			var screenWidth = Math.min( screen.height, screen.width );
			if ( ua.android && !client.browser.chrome ) {
				screenWidth = screenWidth / window.devicePixelRatio;
			}
			this._initZoom = screenWidth / document.body.offsetWidth;
		}
		return this._initZoom;
	}

	// 计算一个元素相对于文档的偏移
	function CalculateElementDocumentOffset( offsetName ) {
		return function ( ele ) {
			var retVal = 0;
			for ( var cur = ele; cur !== null; cur = cur.offsetParent ) {
				retVal += cur[offsetName];
			}
			return retVal;
		};
	}

	var getPageLeft = CalculateElementDocumentOffset( "offsetLeft" ), getPageTop = CalculateElementDocumentOffset( "offsetTop" );
	var docHeight = Math.max( document.documentElement.scrollHeight, document.documentElement.clientHeight ),
		docWidth = Math.max( document.documentElement.scrollWidth, document.documentElement.clientWidth );

	//窗口位置
	var leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX, //window.screenLeft:window.screenX,兼容Firefox
		topPos = (typeof window.screenTop == "number") ? window.screenTop : window.screenY;


	//获取页面高度
	function getPageHeight() {
		//当document.compatMode等于BackCompat时，浏览器客户区宽度是document.body.clientWidth；
		//当document.compatMode等于CSS1Compat时，浏览器客户区宽度是document.documentElement.clientWidth。
		var body = document.body,
			documentElement = document.documentElement,
			compatMode = document.compatMode == "BackCompat" ? body : document.documentElement;
		return Math.max( documentElement.scrollHeight, body.scrollHeight, compatMode.clientHeight );
	}

	//获取页面宽度

	function getPageWidth() {
		var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
			? a
			: g.documentElement;
		return Math.max( f.scrollWidth, a.scrollWidth, d.clientWidth );
	}

	//获取页面scrollLeft

	function getPageScrollLeft() {
		var a = document;
		return a.documentElement.scrollLeft || a.body.scrollLeft;
	}

	//获取页面可视宽度

	function getPageViewWidth() {
		var d = document,
			a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
		return a.clientWidth;
	}


	//获取页面scrollTop

	function getPageScrollTop() {
		var a = document;
		return a.documentElement.scrollTop || a.body.scrollTop;
	}

	// 获取页面可视高度

	function getPageViewHeight() {
		var d = document,
			a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
		return a.clientHeight;
	}

	//getClientRects获取元素占据页面的所有矩形区域
	//getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
	function getBoundingClientRect( ele ) {
		var scrollTop = document.documentElement.scrollTop,
			scrollLeft = document.documentElement.scrollLeft;

		if ( ele.getBoundingClientRect ) {
			if ( typeof arguments.callee.offset != "number" ) {
				var temp = document.createElement( "div" );
				temp.style.cssText = "position:absolute;left:0;top:0";
				document.body.appendChild( temp );
				arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
				document.body.removeChild( temp );
				temp = null;
			}
			var rect = ele.getBoundingClientRect(),
				offset = arguments.callee.offset;

			return {
				left : rect.left + offset,
				right : rect.right + offset,
				top : rect.top + offset,
				bottom : rect.bottom + offset
			}
		}
		else {
			var actualLeft = getPageLeft( ele ),
				actualTop = getPageTop( ele );
			return {
				left : actualLeft - scrollLeft,
				right : actualLeft + ele.offsetWidth - scrollLeft,
				top : actualTop - scrollTop,
				bottom : actualTop + ele.offsetHeight - scrollTop
			}
		}
	}

	// 移除节点
	function removeNode( el ) {
		el && el.parentNode && el.parentNode.removeChild( el );
	}


	//返回脚本内容

	function evalScript( s ) {
		if ( s.indexOf( '<script' ) != -1 ) {
			var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
			p.test( s );
			s = RegExp["$1"];
		}
		return s;
	}

	//清除脚本内容

	function stripScript( s ) {
		return s.replace( /<script.*?>.*?<\/script>/ig, '' );
	}


	// 加载脚本文件
	function loadScript( scriptSrc, onLoad ) {
		var script = document.createElement( "script" );
		script.src = scriptSrc;
		addHandler( script, "load", onLoad );
		document.head.appendChild( script );
		return script;
	}

	// 加载脚本code
	function loadScriptString( code ) {
		var script = document.createElement( "script" );
		script.text = code;
		document.head.appendChild( script );
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

	// 切换状态
	function toggleState( el, fromState, toState ) {
		el.classList.remove( fromState );
		el.classList.add( toState );
	}

	// 根据flag,添加或删除class
	function switchClass( el, className, flag ) {
		flag ? addClass( el, className ) : removeClass( el, className );
	}

	// 抽取属性,抽取后根据retain将该属性删除
	function extractAttribute( el, attrName, retain ) {
		var retVal = el.getAttribute( attrName );
		!retain && el.removeAttribute( attrName );
		return retVal;
	}

// 遍历选择器
	function loopSelector( parent, selector, func, child ) {
		if ( parent === document || child ) {
			loopArray( parent.querySelectorAll( selector ), func );
		}
		else {
			loopArray( querySelectorAll( parent, selector ), func );
		}
	}

	// 遍历选择器 包括自己
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
			var nodes = querySelectorAll( root, "[" + attrName + "]" );
			loopArray( nodes, function ( node ) {
				func( node, extractAttribute( node, attrName ), attrName );
			} )
		}

		is.Array( attrName ) ? loopArray( attrName, doAttr ) : doAttr( attrName );
	}

	// 创建一个元素的快捷方式
	function element( tagName, arg, parentNode ) {
		function doClass( value ) {
			if ( is.String( value ) ) {
				el.classList.add( value );
			}
			else if ( is.Array( value ) ) {
				loopArray( value, function ( className ) {
					el.classList.add( className );
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

	// HTML模板
	function doHTML( parentNode, handlers, context ) {
		// 处理字段对应的元素节点
		var nodes = querySelectorAll( parentNode, "*" );
		loopArray( nodes, function ( fieldNode ) {
			fieldNode.dataset && loopObj( fieldNode.dataset, function ( key, value ) {
				var handler = handlers[key];
				if ( handler !== undefined ) {
					handler( fieldNode, value, context );
					fieldNode.removeAttribute( "data-" + key.replace( /([A-Z])/g, "-$1" ).toLowerCase() );
				}
			} );
		} )
	}

	function HTMLTemplate( templateDiv ) {
		var templates = {};
		var handlers = {
			field : function ( node, value, data ) {
				var html = data[value];
				node.innerHTML = html === undefined || html === null ? "" : html;
			},
			text : function ( node, value, data ) {
				node.textContent = data[value];
			},
			src : function ( node, value, data ) {
				node.setAttribute( "src", data[value] );
			},
			attr : function ( node, value, data ) {
				parsePairString( value, " ", ":", function ( key, value ) {
					node.setAttribute( key, data[value] );
				} );
			},
			list : function ( node, value, data ) {
				var keyValue = value.split( " " );
				makeList( keyValue[0], keyValue[1] ? data[keyValue[1]] : data, node );
			},
			replace : function ( node, value, data ) {
				var arg = value.split( " " );
				data = arg[1] ? data[arg[1]] : null;
				if ( data !== undefined ) {
					node.parentNode.replaceChild( make( arg[0], data ), node );
				}
				else {
					removeNode( node );
				}
			},
			"class" : function ( node, value, data ) {
				loopArray( value.split( " " ), function ( fieldName ) {
					node.classList.add( data[fieldName] );
				} );
			},
			lengthOf : function ( node, value, data ) {
				node.innerHTML = value ? data[value].length : data.length;
			},
			length : function ( node, value, data ) {
				node.innerHTML = data._length;
			},
			index : function ( node, value, data ) {
				node.innerHTML = data._index + 1;
			}
		};

		// 储存模板,并将模板移出DOM树
		doNodeByAttribute( templateDiv, "data-template-id", function ( templateNode, templateId ) {
			var mainNode = templateNode.querySelector( "[data-main]" ) || templateNode;
			templates[templateId] = mainNode;
			mainNode.removeAttribute( "data-main" );
		} );

		removeNode( templateDiv );

		function make( templateID, data, apply ) {
			var templateNode = templates[templateID];
			var resultNode = templateNode.cloneNode( true );
			doHTML( resultNode, handlers, data );
			apply && apply( resultNode, data );

			return resultNode;
		}

		function makeList( templateID, dataList, container, apply ) {
			var len = dataList.length;
			loopArray( dataList, function ( data, i ) {
				var resultNode = make( templateID, extend( data, {
					_index : i,
					_length : len
				} ), function ( node, data ) {
					apply && apply( node, data, i );
				} );
				container && container.appendChild( resultNode );
			} );
		}

		return {
			make : make,
			makeList : makeList,
			addHandler : function ( val ) {
				insert( handlers, val );
			},
			hasTemplate : function ( templateId ) {
				return templates.hasOwnProperty( templateId );
			},
			handlers : function () {
				return handlers;
			}
		};
	}


	// endregion

	// region CSS
	// 非标准样式
	var nonstandardStyles = {
		transform : ["-webkit-transform", "-ms-transform", "transform"],
		transition : ["-webkit-transition", "transition"],
		animation : ["-webkit-animation"],
		"animation-play-state" : ["-webkit-animation-play-state"],
		"backface-visibility" : ["-webkit-backface-visibility", "-mozila-backface-visibility", "backface-visibility"],
		"transform-style" : ["-webkit-transform-style", "transform-style"],
		perspective : ["-webkit-perspective", "perspective"]
	};

	// 设置CSS值,可以设置一条或者设置一组
	function css( el, arg1, arg2 ) {
		function setStyle( styleName, styleValue ) {
			function doStyle( styleName ) {
				el.style.setProperty( styleName, styleValue, "" );
			}

			styleName in nonstandardStyles ? loopArray( nonstandardStyles[styleName], doStyle ) : doStyle( styleName );
		}

		is.String( arg1 ) ? setStyle( arg1, arg2 ) : loopObj( arg1, setStyle );
	}

	// 移除CSS值,可以移除一条,或者移除一组
	function removeCss( el, styleName ) {
		function removeStyle( styleName ) {
			function doStyle( styleName ) {
				el.style.removeProperty( styleName );
			}

			styleName in nonstandardStyles ? loopArray( nonstandardStyles[styleName], doStyle ) : doStyle( styleName );
		}

		is.String( styleName ) ? removeStyle( styleName ) : loopArray( styleName, removeStyle );
	}

	function getStyle( element, name ) {
		return element.style.getPropertyValue( name );
	}

	function getCurrentStyle( ele, name ) {
		return window.getComputedStyle ? window.getComputedStyle( ele, null )[name] : ele.currentStyle[name];
	}

	// 生成CSS样式字符串
	function cssRuleString( cssStyles ) {
		var ruleText = "";
		loopObj( cssStyles, function ( styleName, styleValue ) {
			function addRule( styleName ) {
				ruleText += styleName + ":" + styleValue + ";";
			}

			styleName in nonstandardStyles ? loopArray( nonstandardStyles[styleName], addRule ) : addRule( styleName );
		} );
		return ruleText;
	}

	// 添加CSS规则
	var insertCSSRule = function () {
		var userSheet = LinkedList(), systemSheet = LinkedList();
		return function ( ruleText, isSystem ) {
			var styleSheet = isSystem ? systemSheet : userSheet; // 选择样式链表

			// 如果节点尚未创建,创建节点,系统样式表在所有样式表的最前,用户样式表在所有样式表的最后
			if ( styleSheet.node === undefined ) {
				styleSheet.node = document.head.insertBefore( document.createElement( "style" ), isSystem ? document.head.firstChild : null );
			}

			// 创建新规则,位置上最后规则+1
			var lastRule = styleSheet.tail(),
				newRule = styleSheet.addTail( lastRule === null ? 0 : lastRule.value + 1 );

			styleSheet.node.sheet.insertRule( ruleText, newRule.value );

			return {
				remove : function () {
					// 后面所有元素的位置-1
					var pos = newRule.value;
					for ( var curNode = newRule.next; curNode !== null; curNode = curNode.next ) {
						curNode.value = pos++;
					}

					// 移除节点并删除规则
					newRule.remove();
					styleSheet.node.sheet.deleteRule( pos );
				}
			};
		}
	}();

	function insertCSSRules( arg1, arg2, arg3 ) {
		function insertRules( selector, styles, isSystem ) {
			insertCSSRule( selector + " {" + cssRuleString( styles ) + "}", isSystem );
		}

		if ( is.String( arg1 ) ) {
			insertRules( arg1, arg2, arg3 );
		}
		else {
			loopObj( arg1, function ( selector, styles ) {
				insertRules( selector, styles, arg2 );
			} );
		}
	}

	// 将一个元组转化为字符串
	// 如TupleString( "rgba" )( 2, 3, 4, 0.4 )会返回rgba(2,3,4,0.4);
	function TupleString( tupleName ) {
		return function () {
			return tupleName + "(" + Array.prototype.join.call( arguments, "," ) + ")";
		};
	}

	var translate3d = function ( el, x, y, z, transformStyle ) {
		el.x = x || 0;
		el.y = y || 0;
		el.z = z || 0;
		css( el, "transform", [TupleString( "translate3d" )( x || 0 + "px", y || 0 + "px", z || 0 + "px" ), transformStyle || ""].join( " " ) );
	};

	function autoLayout( ele, min, max ) {
		var n = 0, li = ele;
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
			var h = ele.parentNode.offsetHeight / ele.offsetHeight,
				w = ele.parentNode.offsetWidth / ele.offsetWidth;
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

	// endregion

	// region 事件

	// 事件
	function Event( basicTask ) {
		var events = LinkedList();
		return {
			trig : function () {
				var arg = arguments;
				basicTask && basicTask.apply( null, arg ); // 回调基本事件
				LinkedList.loop( events, function ( task ) {
					task.apply( null, arg );
				} );
			},
			regist : events.addTail
		};
	}

	//$(document).ready(function(){}) $()
	function DomReady( fn ) {
		if ( document.addEventListener ) {
			document.addEventListener( 'DOMContentLoaded', function () {
				document.removeEventListener( 'DOMContentLoaded', arguments.callee, false );
				fn();
			}, false );
		}
		else if ( document.attachEvent ) {
			document.attachEvent( 'onreadystatechange', function () {
				if ( document.readyState == 'complete' ) {
					document.detachEvent( 'onreadystatechange', arguments.callee );
					fn();
				}
			} );
		}
	}

	// 事件
	function addHandler( element, type, handler, isCapture ) {
		if ( element.addEventListener ) {
			element.addEventListener( type, handler, isCapture === true );
		}
		else if ( element.attachEvent ) {

			type = "on" + type;
			element.attachEvent( type, handler );
		}
		else {
			element["on" + type] = handler;
		}
		return {
			remove : function () {
				if ( element.removeEventListener ) {
					element.removeEventListener( type, handler, isCapture === true );
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
		var canTouch = ("ontouchstart" in document) || (window.DocumentTouch && document instanceof DocumentTouch);
		if ( (/Chrome/gi).test( navigator.userAgent ) && (navigator.platform === "Win32") ) {
			canTouch = false;
		}
		return canTouch;
	}

	function isMobileUserAgent() {
		return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test( window.navigator.userAgent.toLowerCase() ));
	}

	function handleTouchEvent( event ) {
		event = getEvent( event );
		//只跟踪一次触摸
		var x, y;
		if ( event.touches.length == 1 ) {
			switch ( event.type ) {
				case "touchstart":
					x = event.touches[0].clientX;
					y = event.touches[0].clientY;
					break;

				//touchmove touchend  当touched触发时touches集合中就没有任何touch对象了 所以使用changedTouches集合
				case "touchmove":
					event.preventDefault(); //move是阻止默认 阻止滚动
					x = event.changedTouches[0].clientX;
					y = event.changedTouches[0].clientY;
					break;
				case "touchend":
					x = event.changedTouches[0].clientX;
					y = event.changedTouches[0].clientY;
					break;
				default :
					break;
			}
		}
	}

	function trigger( ele, type, options ) {
		var event, defaultArgs;
		if ( document.createEvent ) {
			if ( /key/gim.test( type ) ) {   //模拟键盘事件
				if ( document.implementation.hasFeature( "KeyboardEvents", "3.0" ) ) {
					//以DOM3级方式创建事件对象
					if ( client.browser.firefox ) {
						defaultArgs = {
							type : type || "keydown",
							bubbles : true,   //是否冒泡
							cancelable : true,  //是否可取消
							view : document.defaultView, //与事件关联视图
							ctrlKey : false,
							altKey : false,
							shiftKey : false,
							metaKey : false,
							keyCode : 0, //按下键的键码 对
							charCode : 0 //对keypress有用
						};
						options && insert( defaultArgs, options );
						event = document.createEvent( "KeyEvents" );
						event.initKeyEvent( defaultArgs.type, defaultArgs.bubbles,
							defaultArgs.cancelable, defaultArgs.view,
							defaultArgs.ctrlKey, defaultArgs.altKey,
							defaultArgs.shiftKey, defaultArgs.metaKey,
							defaultArgs.keyCode, defaultArgs.charCode );
					}
					else {
						defaultArgs = {
							type : type || "keydown",
							bubbles : true,   //是否冒泡
							cancelable : true,  //是否可取消
							view : document.defaultView, //与事件关联视图
							keyCode : 0, //按下键的键码
							keyLocation : 0, //表示按下了哪里的键位 0默认的主键盘   1左边键盘  2右边键盘 3数字键盘 4移动设备(虚拟键盘) 5手柄
							repeat : 1, //在一行中按了这个键多少次
							ctrlKey : false,
							altKey : false,
							shiftKey : false,
							metaKey : false
						};
						options && insert( defaultArgs, options );
						event = document.createEvent( "KeyboardEvents" );
						event.initKeyboardEvent( defaultArgs.type, defaultArgs.bubbles,
							defaultArgs.cancelable, defaultArgs.view,
							defaultArgs.key, defaultArgs.location,
							defaultArgs.modifiers, defaultArgs.repeat );
					}
					ele.dispatchEvent( event );
				}
				else {
					console.log( "nonsupport 不支持DOM3模拟键盘事件!" )
				}

			}
			else {//鼠标事件
				defaultArgs = {
					type : type || "click",
					bubbles : true,
					cancelable : true,
					view : document.defaultView,
					detail : 0, //与事件相关的详细信息
					screenX : 0,
					screenY : 0,
					clientX : 0,
					clientY : 0,
					ctrlKey : false,
					altKey : false,
					shiftKey : false,
					metaKey : false,
					button : 0
				};
				options && insert( defaultArgs, options );
				event = document.createEvent( "MouseEvents" );
				event.initMouseEvent( defaultArgs.type, defaultArgs.bubbles,
					defaultArgs.cancelable, defaultArgs.view, defaultArgs.detail,
					defaultArgs.screenX, defaultArgs.screenY,
					defaultArgs.clientX, defaultArgs.clientY,
					defaultArgs.ctrlKey, defaultArgs.altKey,
					defaultArgs.shiftKey, defaultArgs.metaKey,
					defaultArgs.button, defaultArgs.relatedTarget );
				ele.dispatchEvent( event );
			}

		}
		else if ( document.createEventObject ) { //ie8及以前
			event = document.createEventObject();
			options && insert( event, options );
			ele.fireEvent( "on" + type, event );
		}
		else {
			console.log( "nonsupport 不支持模拟键盘事件!" )
		}
	}

	//模拟变动事件
	function triggerMutationEvents( ele, type, options ) {
		var event, defaultArgs;
		defaultArgs = {
			type : type || "DOMNodeInserted",
			bubbles : true,   //是否冒泡
			cancelable : true,  //是否可取消
			relatedNode : null,
			preValue : "",
			newValue : "",
			attName : "",
			attrChange : 0 //对keypress有用
		};
		options && insert( defaultArgs, options );
		event = document.createEvent( "MutationEvents" );
		event.initMutationEvent( defaultArgs.type, defaultArgs.bubbles,
			defaultArgs.cancelable, defaultArgs.relatedNode,
			defaultArgs.preValue, defaultArgs.newValue,
			defaultArgs.attName, defaultArgs.attrChange );
		ele.dispatchEvent( event );
	}

	//模拟HTML事件
	function triggerHTMLEvents( ele, type, options ) {
		var event, defaultArgs;
		defaultArgs = {
			type : type || "focus",
			bubbles : true,   //是否冒泡
			cancelable : true  //是否可取消
		};
		options && insert( defaultArgs, options );
		event = document.createEvent( "HTMLEvents" );
		event.initEvent( defaultArgs.type, defaultArgs.bubbles, defaultArgs.cancelable );
		ele.dispatchEvent( event );
	}

	//DOM3的自定义DOM事件
	function triggerCustomEvents( ele, type, options ) {
		if ( document.implementation.hasFeature( "CustomEvents", "3.0" ) ) {
			var event, defaultArgs;
			defaultArgs = {
				type : type || "focus",
				bubbles : true,   //是否冒泡
				cancelable : true,  //是否可取消
				detail : "自定义事件"
			};
			options && insert( defaultArgs, options );
			event = document.createEvent( "CustomEvent" );
			event.initCustomEvent( defaultArgs.type, defaultArgs.bubbles, defaultArgs.cancelable, defaultArgs.detail );
			ele.dispatchEvent( event );
		}
	}

// 取移动的事件坐标用
	loopArray( ["pageX", "pageY", "clientX", "clientY"], function ( coordinateName ) {
		Object.defineProperty( UIEvent.prototype, "z" + coordinateName.replace( /^./, function ( ch ) {
			return ch.toUpperCase();
		} ), {
			get : function () {
				return "touches" in this && this.touches[0] !== undefined ? this.touches[0][coordinateName] : this[coordinateName];
			}
		} );
	} );

	// touch事件绑定器
	function TouchBind( IEEventName, OtherEventName, PCName ) {
		return function ( el, response, isCapture ) {
			return ua.canTouch ? addHandler( el, window.navigator.msPointerEnabled ? IEEventName : OtherEventName, response ) :
				addHandler( el, PCName, response, isCapture );
		};
	}

	var onTouchMove = TouchBind( "MSPointerMove", "touchmove", "mousemove" ),
		onTouchEnd = TouchBind( "MSPointerUp", "touchend", "mouseup" ),
		onTouchStart = function () {
			var onTouchStart = TouchBind( "MSPointerDown", "touchstart", "mousedown" );
			return function ( el, response, isCapture ) {
				return onTouchStart( el, function ( event ) {
					// 此次touch的move事件和end事件,这两个事件仅对于当次touch有效
					var touchMoveEvent = Event(), touchEndEvent = Event();
					var pageX = event.zPageX, pageY = event.zPageY;

					var move = onTouchMove( document, function ( event ) {
						pageX = event.zPageX;
						pageY = event.zPageY;

						// 将move事件和end事件的注册指令添加到event中
						event.onTouchMove = touchMoveEvent.regist;
						event.onTouchEnd = touchEndEvent.regist;

						touchMoveEvent.trig( event, pageX, pageY );
					} );

					var end = onTouchEnd( document, function ( event ) {
						touchEndEvent.trig( event, pageX, pageY );
						move.remove();
						end.remove();
					} );

					// 将move事件和end事件的注册指令添加到event中
					event.onTouchMove = touchMoveEvent.regist;
					event.onTouchEnd = touchEndEvent.regist;

					// 回调response
					response( event, pageX, pageY );
				}, isCapture );
			}
		}();


	// 一般的senser,判断是否超出圆
	function senser( event ) {
		return square( event.distanceX ) + square( event.distanceY ) > square( SwipeRadius );
	}

	// sense事件,根据触摸是否到达了阈值判断是否触发响应
	function sense( el, arg ) {
		return onTouchStart( el, function ( event, startX, startY ) {
			arg.onSenseStart && arg.onSenseStart( event );

			// sense事件,判断触摸移动是否到达sense阈值,若只是小幅移动,不触发响应
			var senseTrue = false;
			var senseEvent = event.onTouchMove( function ( event, pageX, pageY ) {
				// 判断是否移动到了sense阈值,如果移动到了,停止判断,触发senseTrue响应
				event.distanceX = pageX - startX;
				event.distanceY = pageY - startY;

				if ( senser( event ) ) {
					// 移除sense事件,不再侦测
					senseEvent.remove();
					senseTrue = true;
					// 触发senseTrue响应
					arg.onSenseTrue && arg.onSenseTrue( event, pageX, pageY );
				}
			} );

			// 如果抬起的时候没有senseTrue,触发senseFalse响应
			event.onTouchEnd( function ( event, pageX, pageY ) {
				if ( !senseTrue ) {
					arg.onSenseFalse && arg.onSenseFalse( event, pageX, pageY );
				}
				arg.onTouchEnd && arg.onTouchEnd();
			} );
		} );
	}


	// tap事件,轻触屏幕时(不引起sense)触发,在sense域时有class tap
	function onTap( el, response, stopPropagation ) {
		css( el, "cursor", "pointer" );
		if ( window.voiceOver ) { //苹果语音辅助程序 只需触摸文字即可选中使程序朗读
			return addHandler( el, "click", response );
		}
		else {
			return sense( el, {
				onSenseStart : function ( event ) {
					!el.classList.contains( "disabled" ) && el.classList.add( "tap" );
					stopPropagation && event.stopPropagation();
				},
				onSenseTrue : function () { //senseTrue为滑动
					el.classList.remove( "tap" );
				},
				onSenseFalse : function ( event, pageX, pageY ) {
					!el.classList.contains( "disabled" ) && response && response( event, pageX, pageY );
				},
				onTouchEnd : function () {
					el.classList.remove( "tap" );
				}
			} );
		}
	}

// swipeStart事件,沿某一方向滑动某个阈值时触发
	function SwipeStart( isHorizontal ) {
		return function ( el, response, arg ) {
			return sense( el, {
				onSenseStart : arg.onSenseStart,
				onSenseTrue : function ( event, pageX, pageY ) {
					var ratio = Math.abs( event.distanceY ) / Math.sqrt( square( event.distanceX ) + square( event.distanceY ) );
					if ( (ratio >= 0.5) ^ isHorizontal ) {

						preventDefault( event );
						event.direction = isHorizontal ? event.distanceX > 0 : event.distanceY > 0;
						response( event, pageX, pageY );
					}
					else {
						arg.onSenseFailure && arg.onSenseFailure();
					}
				},
				onSenseFalse : arg.onSenseFailure
			} );
		};
	}

	var onSwipeStartH = SwipeStart( true ), onSwipeStartV = SwipeStart( false );
	// 拖拽,只支持横向或纵向
	function Drag( isHorizontal ) {
		var swipeStart = isHorizontal ? onSwipeStartH : onSwipeStartV,
			getPos = isHorizontal ? function ( pageX ) {
				return pageX;
			} : function ( pageX, pageY ) {
				return pageY;
			};

		return function ( dragEl, moveEl, dragStart, arg ) {
			arg = arg || {};
			if ( moveEl.x === undefined ) {
				translate( moveEl, 0, 0 );
			}

			var swipe = swipeStart( dragEl, function ( event, pageX, pageY ) {

				var dragEndEvent = Event(); // 拖拽停止事件
				var preventDefault = false; // 是否阻止默认事件

				// 位移函数,该函数可以被覆盖
				var move = isHorizontal ? function ( val ) {
					translate( moveEl, val, 0 );
				} : function ( val ) {
					translate( moveEl, 0, val );
				};

				// 拖动开始时的位置(touch位置),偏移(元素位置)和时间戳
				var startPos = getPos( pageX, pageY ),
					startOffset = isHorizontal ? moveEl.zLeft + event.distanceX : moveEl.zTop + event.distanceY,
					startTime = event.timeStamp || +new Date();

				// 上一次移动的位置,时间戳和方向
				var lastPos = startPos,
					lastTime = startTime,
					lastDirection = event.direction;

				var track = [], trackTime = 0; // 记录和记录总时间

				// 拖动开始回调,在该回调中可以阻止默认拖动事件,并覆盖位移函数
				dragStart( {
					direction : event.direction,
					onDragEnd : dragEndEvent.regist,
					setMove : function ( moveFunc ) {
						move = moveFunc;
					},
					preventDefault : function () {
						preventDefault = true;
					},
					targetPos : startOffset
				} );

				// 如果默认事件被阻止,不进行后面的工作,直接返回
				// 也就是说,此时手指挪动不会导致元素移动
				if ( preventDefault ) {
					return;
				}

				// 记录一次移动
				function trackTouchMove( timeDiff, distDiff ) {
					// 如果一次移动大于200,清空记录
					if ( timeDiff > 200 ) {
						track = [];
						trackTime = 0;
						return;
					}
					trackTime += timeDiff;

					// 如果记录时间超过300毫秒,移除头部部分记录,使其减少到300毫秒
					var headTrack;
					while ( trackTime > 300 ) {
						headTrack = track.shift();
						trackTime -= headTrack.timeDiff;
					}

					track.push( {
						timeDiff : timeDiff,
						distDiff : distDiff
					} );
				}

				event.onTouchMove( function ( event, pageX, pageY ) {
					event.preventDefault();
					var targetPos, curDirection, // 目标位置,当前方向
						curPos = getPos( pageX, pageY ); // 当前位置

					// 两次移动的时间差与距离差
					var timeDiff = (event.timeStamp || +new Date()) - lastTime;
					var distDiff = curPos - lastPos;

					// 去抖动
					if ( lastDirection === undefined || !(distDiff * (lastDirection ? 1 : -1) < -20) ) {
						// 计算目标位置和当前方向
						targetPos = startOffset + curPos - startPos;
						curDirection = curPos === lastPos ? lastDirection : curPos > lastPos;

						if ( curDirection !== lastDirection || timeDiff > 200 ) {
							// 如果转向或者两次移动时间间隔超过200毫秒,重新计时
							track = [];
							trackTime = 0;
						}
						else {
							// 否则加入计时记录
							trackTouchMove( timeDiff, distDiff );
						}

						// 更新数据
						lastDirection = curDirection;
						lastPos = curPos;
						lastTime = event.timeStamp || +new Date();

						move( targetPos, {
							direction : curDirection,
							distance : curPos - startPos
						} );
					}
				} );

				event.onTouchEnd( function ( event, pageX, pageY ) {
					// 当前位置差和时间差
					var curPos = getPos( pageX, pageY ), now = (event.timeStamp || +new Date());

					// 加入记录
					trackTouchMove( now - lastTime, curPos - lastPos );

					// 根据记录计算速度
					var totalDiff = reduce( 0, track, function ( total, unit ) {
						return total + unit.distDiff;
					} );
					var speed = trackTime === 0 ? 0 : totalDiff / trackTime;

					// 触发拖动结束事件
					dragEndEvent.trig( {
						targetPos : startOffset + curPos - startPos,
						direction : speed === 0 ? lastDirection : speed > 0,
						distance : curPos - startPos,
						speed : speed,
						duration : now - startTime
					} );
				} );
			}, arg );

			return {
				remove : swipe.remove
			};
		}
	}

	var onDragH = Drag( true ), onDragV = Drag( false );

	function swipe( element, func ) {
		var moveHandle, pos = [], dir = [];
		addHandler( element, start, function ( evt ) {
			//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
			var touch = evt.touches && evt.touches[0] || evt;//获取第一个触点
			var x1 = Number( touch.pageX ),
				y1 = Number( touch.pageY );
			//记录触点初始位置
			pos.push( {pageX : x1, pageY : y1, timeStamp : evt.timeStamp, dir : " "} );
			moveHandle = addHandler( element, move, function ( evt ) {
				//evt.preventDefault();
				var touch = evt.touches && evt.touches[0] || evt;  //获取第一个触点
				var x = Number( touch.pageX ),//页面触点X坐标
					y = Number( touch.pageY ); //页面触点Y坐标
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
					var distanceX = pos[pos.length - 1].pageX - pos[0].pageX,
						distanceY = pos[pos.length - 1].pageY - pos[0].pageY, data;
					data = {
						direction : pos[pos.length - 2].dir,
						distanceX : distanceX,
						distanceY : distanceY,
						time : time
					};
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
			addClass( element, "tap" );
			startTime = evt.timeStamp;
		} );
		addHandler( element, end, function ( evt ) {
			removeClass( element, "tap" );
			endTime = evt.timeStamp;
			func();
		} );
	}

	function tapHold( element, func ) {
		var endTime, startTime;
		addHandler( element, start, function ( evt ) {
			addClass( element, "tap" );
			startTime = evt.timeStamp;
		} );
		addHandler( element, end, function ( evt ) {
			removeClass( element, "tap" );
			endTime = evt.timeStamp;
			if ( endTime - startTime > 750 ) {
				func();
			}
		} )
	}

	function getWheelDelta( ev ) {
		ev = ev == undefined ? window.event : ev;
		if ( ev.wheelDelta ) {
			return (client.engine.opera && client.engine.opera < 9.5 ? -ev.wheelDelta : ev.wheelDelta)
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

	function log( mes, System ) {
		if ( !System ) {
			var console = document.querySelector( "#debug" );
			if ( console == null ) {
				console = document.createElement( "div" );
				console.setAttribute( "id", "debug" );
				css( console, {
					background : "#dedede",
					border : "1px solid silver",
					height : "auto",
					"word-wrap" : "break-word",
					padding : "5px",
					"max-width" : "100px",
					position : "absolute",
					right : "0",
					top : "0"
				} );
				document.body.appendChild( console );
			}
			console.innerHTML += mes + "<br/>";
			window.console.log( mes );
		}
		else {
			window.console.log( mes );
		}

	}

	function error() {
		if ( !window.onerror ) {
			window.onerror = function ( sMessage, sUrl, sLine ) {
				alert( "信息: \n" + sMessage + "\n发生错误的文件: \n" + sUrl + "\n发生错误的行号: \n" + sLine );
				return true;

			};
		}
	}

	function CustomError( message ) {
		this.name = "CustomError";
		this.message = message;
	}

	CustomError.prototype = new Error();

	function follow( element, type, bl, func, screenW, screenH ) { //type=0||1||2 水平 竖直 综合
		var startX = 0, startY = 0,
			x, y, gesture,
			moveHandle = null, endHandle = null,
			minX = 100, minY = 100;
		addHandler( element, start, function ( evt ) {
			var touch = evt.touches && evt.touches[0] || evt; //获取第一个触点
			var touch2 = evt.touches && evt.touches[1];
			gesture = 0;
			if ( touch2 ) {
				gesture = 1;
			}
			var x1 = Number( touch.pageX ), //页面触点X坐标
				y1 = Number( touch.pageY ); //页面触点Y坐标
			if ( !moveHandle ) {
				moveHandle = addHandler( element, move, function ( evt ) {
					evt.preventDefault();

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
				} );
			}
		} );
		endHandle = addHandler( document.body, end, function touchEndFunc( event ) {
			event.preventDefault();
			var evt = [];
			startX = x;
			startY = y;
			evt.el = element;
			evt.myX = x;
			evt.myY = y;
			if ( func ) {
				func( evt );
			}
			moveHandle&&moveHandle.remove();

			endHandle = moveHandle = null;
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

	// endregion

	//region表单事件


	//取得选择的文本

	function getSelectedText( textBox ) {
		if ( typeof textbox.selectionStart == "number" ) {
			return textbox.value.substring( textBox.selectionStart, textBox.selectionEnd );
		}
		else if ( document.selection ) {
			return document.selection.createRange().text();
		}
	}


	//取得部分文本

	function selectText( textBox, startIndex, endIndex ) {
		if ( textBox.setSelectionRange ) {
			textBox.setSelectionRange( textBox, startIndex, endIndex );
		}
		else if ( textBox.createTextRange ) {
			var range = textBox.createTextRange();
			range.collapse( true );
			range.moveStart( 'character', startIndex );
			range.moveEnd( 'character', endIndex - startIndex );
			range.select();
		}
		textBox.focus();
	}

	//操作剪贴板

	function getClipboardText( event ) {
		var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData( "text" );
	}

	function setClipboardText( event, value ) {
		if ( event.clipboardData ) {
			return event.clipboardData.setData( "text/plain", value );
		}
		else if ( window.clipboardData ) {
			return window.clipboardData.setData( "text", value );
		}
	}


	//获得多个选择选项

	function getSelectedOptions( selectBox ) {
		var result = new Array(),
			option = null;

		for ( var i = 0, len = selectBox.options.length; i < len; i++ ) {
			option = selectBox.options[i];
			if ( option.selected ) {
				result.push( option );
			}
		}

		return result;
	}


	//添加选项

	function addOption( selectBox, optionText, optionValue, nextOption ) {
		var newOption = new Option( optionText, optionValue );
		selectBox.add( newOption, nextOption )
	}

	//移出选项

	function deleteOption( selectBox, deleteIndex ) {
		if ( deleteIndex ) {
			selectBox.remove( deleteIndex );
		}
		else {
			for ( var i = 0, len = selectBox.options.length; i < len; i++ ) {
				selectBox.remove( 0 );
			}
		}
	}

	//表单序列化

	function serialize( form ) {
		var parts = [],
			optValue;
		loopArray( form.elements, function ( field ) {
			switch ( field.type ) {
				case "select-one":
				case "select-multiple":
					//不包含没有名字的字段
					if ( field.name.length ) {
						loopArray( field.options, function ( option ) {
							if ( option.selected ) {
								if ( option.hasAttribute ) {
									optValue = (option.hasAttribute( "value" )) ? option.value : option.text;
								}
								else {
									optValue = (option.attributes["value"]) ? option.value : option.text; //是否用js指定过value属性
								}
								parts.push( encodeURIComponent( field.name ) + "=" + encodeURIComponent( optValue ) );
							}
						} )
					}
					break;
				case undefined://字段集
				case "file"://文件输入
				case "submit":
				case "reset":
				case "button":
					break;


				case "radio":
				case "checkbox":
					if ( field.checked ) {
						//doSomething
					}
					break;

				default :
					if ( field.name.length ) {
						parts.push( encodeURIComponent( field.name ) + "=" + encodeURIComponent( optValue ) );
					}
			}
		} )
	}


	//endregion

	//region load
	//onLoad
	function onLoad( ele, callback ) {
		addHandler( ele, "load", callback ); //只有window img有onload事件
	}

	//endregion


	//region cookie 加入收藏夹 设为首页

	//设置cookie值

	function setCookie( name, value, Hours ) {
		var d = new Date(),
			offset = 8,
			utc = d.getTime() + (d.getTimezoneOffset() * 60000),
			nd = utc + (3600000 * offset), exp = new Date( nd );
		exp.setTime( exp.getTime() + Hours * 60 * 60 * 1000 );
		document.cookie = name + "=" + escape( value ) + ";path=/;expires=" + exp.toGMTString() + ";domain=360doc.com;"
	}

	//获取cookie值

	function getCookie( name ) {
		var arr = document.cookie.match( new RegExp( "(^| )" + name + "=([^;]*)(;|$)" ) );
		if ( arr != null ) return unescape( arr[2] );
		return null
	}

	//加入收藏夹

	function AddFavorite( sURL, sTitle ) {
		try {
			window.external.addFavorite( sURL, sTitle )
		}
		catch ( e ) {
			try {
				window.sidebar.addPanel( sTitle, sURL, "" )
			}
			catch ( e ) {
				alert( "加入收藏失败，请使用Ctrl+D进行添加" )
			}
		}
	}

	//设为首页

	function setHomepage( sURL ) {
		if ( document.all ) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage( sURL )
		}
		else if ( window.sidebar ) {
			if ( window.netscape ) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege( "UniversalXPConnect" )
				}
				catch ( e ) {
					alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true" )
				}
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService( Components.interfaces.nsIPrefBranch );
			prefs.setCharPref( 'browser.startup.homepage', sURL )
		}
		else {
			alert( "设置首页失败，请手动设置" )
		}
	}

	//endregion

	// region url与ajax
	function IsURL( strUrl ) {
		var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i;
		if ( regular.test( strUrl ) ) {
			return true;
		}
		else {
			return false;
		}
	}

	//  去掉url前缀

	function removeUrlPrefix( a ) {
		a = a.replace( /：/g, ":" ).replace( /．/g, "." ).replace( /／/g, "/" );
		while ( a.trim.toLowerCase().indexOf( "http" ) == 0 ) {
			a = (a.trim.replace( /http:\/\//i, "" ));
		}
		return a;
	}

	function url( path, arg, hash ) {
		var url = path, i = 0;
		arg && loopObj( arg, function ( name, value ) {
			url += value ? (i++ === 0 ? "?" : "&") + encodeURIComponent( name ) + "=" + encodeURIComponent( value ) : "";
		} );
		url += hash ? "#" + hash : "";
		return url;
	}

	function addQueryStingArg( url, key, value ) {
		function addQueryStings( url, key, value ) {

			function addQuerySting( url, key, value ) {
				if ( url.indexOf( "?" ) == -1 ) {
					url += "?";
				}
				else {
					url += "&";
				}
				url += encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			}

			if ( typeof key == "object" ) {
				loopObj( key, function ( key, value ) {
					addQuerySting( url, key, value )
				} )
			}
			else if ( typeof key == "string" ) {
				addQuerySting( url, key, value )
			}

			return url;
		}

		if ( url.indexOf( "#" ) == -1 ) {
			url = addQueryStings( url, key, value );
		}
		else {
			var hash = url.hash;
			url = url.split( "#" )[0];
			url = addQueryStings( url, key, value );
			addHash( url, hash );
		}
		return url;

	}

	function addHash( url, hash ) {
		if ( url.indexOf( "#" ) == -1 ) {
			url += "#" + encodeURIComponent( hash );

		}
		else {
			url += encodeURIComponent( hash );
		}
		return url;
	}

	// 设置参数的默认值
	function defaultArg( arg, defaultArg ) {
		return extend( defaultArg, arg || {} );
	}

	function createXHR() {
		if ( window.XMLHttpRequest != "undefined" ) {
			createXHR = function () {
				return new XMLHttpRequest();
			};
		}
		else if ( window.ActiveXObject != "undefined" ) {
			createXHR = function () {
				if ( typeof  arguments.callee.activeXString != "string" ) {
					var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
						i, len;
					for ( i = 0, len = versions.length; i++; i < len ) {
						try {
							new ActiveXObject( versions[i] );
							arguments.callee.activeXString = versions[i];
							break;
						}
						catch ( ex ) {
							//跳过
						}
					}
				}
				return new ActiveXObject( (arguments.callee.activeXString) );
			};
		}
		else {
			createXHR = function () {
				throw new Error( "No XHR Object available" );
			}
		}
	}

	function createCORSRequest( type, url, onLoad ) {
		var xhr = new XMLHttpRequest();
		if ( "withCredentials" in xhr ) {
			xhr.open( type, url );
		}
		else if ( typeof XDomainRequest != "undefined" ) {
			xhr = new XDomainRequest();
			xhr.open( type, url );
		}
		else {
			xhr = null;
		}
		onLoad && xhr.onload( onLoad );
		xhr.send();
		return xhr;
	}

	function xWWW( data ) {
		var retVal = "", i = 0;
		loopObj( data, function ( key, value ) {
			if ( value !== undefined ) {
				retVal += (i++ == 0 ? "" : "&") + encodeURIComponent( key ) + '=' + encodeURIComponent( value );
			}
		} );
		return retVal;
	}

	function Ajax( arg ) {
		arg = defaultArg( arg, {
			requestHeader : {},
			type : "get",
			async : true,
			data : null,
			onLoad : null,
			onLoadStart : null,
			onLoadEnd : null,
			onError : null,
			onProgress : null,
			timeout : null,
			onTimeout : null,
			upload : null,
			withCredentials : false, //携带证书
			isJson : false,
			xml : false,
			overrideMimeType : null  //如“text/xml”

		} );
		arg.requestHeader = defaultArg( arg.requestHeader, {
			Accept : "*/*"
		} );

		var xhr = createXHR();
		xhr.onreadystatechange = function () { //onreadystatechange必须在open前
			if ( xhr.readyState == 4 ) {
				if ( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) { //304表示请求的资源未被修改 可以使用缓存的版本
					var responseData = xhr.responseText;
					if ( arg.isJson ) {
						responseData = JSON.parse( responseData );
					}
					arg.onLoad && arg.onLoad( responseData ); //response responseText responseType responseURL responseXML
				}
				else {
					arg.onError && arg.onError( xhr.onerror );
					console.error( "Request was unsuccessful: " + xhr.onerror );
				}
			}
		};

		xhr.open( arg.type, arg.url, arg.asyn );

		// 添加requestHeader
		loopObj( arg.requestHeader, function ( key, value ) {  //setRequestHeader必须在open后 send前
			xhr.setRequestHeader( key, value );  //xhr.setRequestHeader(key) xhr.setAllRequestHeaders()
		} );

		if ( arg.overrideMimeType && typeof xhr.overrideMimeType != "undefined" ) {//overrideMimeType必须在open后 send前
			xhr.overrideMimeType( arg.overrideMimeType ); //强迫XHR对象将响应当作overrideMimeType 如xml而非纯文本处理
		}

		xhr.send( xWWW( arg.data ) );

		return xhr;
	}


	// endregion


	//region XML
	//跨浏览器处理xml
	//创建空白文档
	function createDocument() {
		if ( typeof arguments.callee.activeXString != "string" ) {
			var versions = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument"];

			for ( var i = 0, len = versions.length; i < len; i++ ) {
				try {
					new ActiveXObject( versions[i] );
					arguments.callee.activeXString = versions[i];
					break
				}
				catch ( ex ) {

				}
			}
		}
		return new ActiveXObject( arguments.callee.activeXString );
	}

	function parsXml( xml ) {
		var xmlDom = null;

		if ( typeof DOMParser != "undefined" ) {
			var errors = null;

			xmlDom = (new DOMParser()).parseFromString( xml, "text/xml" );
			errors = xmlDom.getElementsByTagName( "parsererror" );
			if ( errors.length ) {
				throw new Error( "XML parsing error: " + errors[0].textContent );
			}
		}
		else if ( typeof ActiveXObject != "undefined" ) {
			xmlDom = createDocument();
			xmlDom.loadXML( xml );
			if ( xmlDom.parseError != 0 ) {
				throw new Error( "XML parsing error: " + xmlDom.parseError.reason );
			}
		}
		else {
			throw new Error( "No XML parser available" );
		}

		return xmlDom;
	}

	function serializeXml( xmlDom ) {
		if ( typeof XMLSerializer != "undefined" ) {
			return (new XMLSerializer()).serializeToString( xmlDom );
		}
		else if ( typeof xmlDom.xml != "undefined" ) {
			return xmlDom.xml;
		}
		else {
			throw new Error( "Can not serialize XML DOM" );
		}
	}


	//endregion


	//region Animate
	// 伴随节点的动画,插入文档时启动,移除文档时停止
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function ( run ) {
				window.setTimeout( run, 16 );
			};
	})();


	function nodeAnimate( node, animate ) {
		addHandler( node, "DOMNodeInsertedIntoDocument", animate.start );
		addHandler( node, "DOMNodeRemovedFromDocument", animate.stop );
	}

	function whichTransitionEvent() {
		var t,
			el = document.createElement( 'fakeelement' ),
			transitions = {
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
	function Transition( el, transition, style, styleValue, onEnd ) {
		return function retFunc() {
			onEnd = is.String( style ) ? onEnd : styleValue;
			css( el, "transition", transition );

			if ( ua.android && ua.androidVersion < 3 ) {
				css( el, style, styleValue );
				onEnd && onEnd();
			}
			else {
				css( el, "transition", transition );
				el.transition && el.transition.remove();
				var isEnd = false;

				function end() {
					if ( !isEnd ) {
						isEnd = true;
						removeCss( el, "transition" );
						onEnd && onEnd();
						transitionEnd.remove();
						removeEvent.remove();
					}
					el.transition = null;
				}

				var removeEvent = addHandler( el, "DOMNodeRemovedFromDocument", end );
				var transitionEnd = addHandler( el, whichTransitionEvent(), end );
				el.transition = transitionEnd;

				setTimeout( function () {
					css( el, style, styleValue );
				}, 20 );
			}
			return retFunc;
		};
	}
	function transition( el, transition, style, styleValue, onEnd ) {
		return Transition( el, transition, style, styleValue, onEnd )();
	}
	var translate = function ( el, left, top, transformStyle ) {
		el.zLeft = left;
		el.zTop = top;
		css( el, "transform", [TupleString( "translate3d" )( left + "px", top + "px", 0 ), transformStyle || ""].join( " " ) );
	};
	var requestAnimate = function () {
		var timeout = null;
		var tasks = LinkedList();

		return function ( task ) {
			var node = null;

			function start() {
				// 如果任务没有添加进链表,添加到链表中
				if ( node === null ) {
					task.start = new Date(); // 这个任务的开始时间
					node = tasks.addTail( task );

					// 如果当前没有计时,开始计时
					if ( timeout === null ) {
						var lastTime = new Date();
						timeout = window.setTimeout( function () {
							var curTime = new Date();
							if ( tasks.tail() !== null ) {
								timeout = requestAnimFrame( arguments.callee );
								LinkedList.loop( tasks, function ( task ) {
									task( curTime - task.start, curTime - lastTime );
								} );
							}
							else {
								timeout = null;
							}
							lastTime = curTime;
						}, 1000 / 60 );
					}
				}
			}

			start();

			return {
				start : start,
				stop : function () {
					node && node.remove();
					node = null;
				}
			};
		};
	}();

	function Bezier( x1, y1, x2, y2 ) {
		var xTolerance = 0.0001;

		return function ( xTarget ) {
			function bezier( t, p1, p2 ) {
				var ct = 1 - t, ct2 = ct * ct;
				var t2 = t * t, t3 = t2 * t;
				var tct2 = t * ct2, t2ct = t2 * ct;
				return 3 * p1 * tct2 + 3 * p2 * t2ct + t3;
			}

			function bezierD( t, p1, p2 ) {
				return (9 * p1 - 9 * p2 + 3) * t * t + (6 * p2 - 12 * p1) * t + 3 * p1;
			}

			var t = 0.5;
			while ( Math.abs( xTarget - bezier( t, x1, x2 ) ) > xTolerance ) {
				t = t - (bezier( t, x1, x2 ) - xTarget) / bezierD( t, x1, x2 );
			}

			return bezier( t, y1, y2 );
		}
	}

	var Timing = {
		linear : function ( t ) {
			return t;
		},
		quadraticEase : function ( t ) {
			return 1 - Math.pow( (1 - t), 2 );
		},
		ease : Bezier( 0.25, 1, 0.25, 1 ),
		easeInOut : Bezier( 0.42, 0, 0.58, 1 )
	};

	function animate( animationInfo ) {
		var duration = animationInfo.duration * 1000, // 时续时间
			timing = (animationInfo.timing || Timing.quadraticEase), // 缓动函数
			onStart = animationInfo.onStart, // 开始回调
			onAnimate = animationInfo.onAnimate, // 动画回调
			onEnd = animationInfo.onEnd, // 结束回调
			onReverseEnd = animationInfo.onReverseEnd; // 逆转结束回调

		var isAnimateStart = true, // 动画是否启动
			positive = true; // 是否沿着正方向进行

		onStart && onStart();
		onAnimate( 0 );

		var startTime = new Date();
		var timer = requestAnimate( function () {
			var t = new Date() - startTime;

			if ( t >= duration ) {
				timer.stop();
				onAnimate( positive ? 1 : 0 );
				isAnimateStart = false;
				positive ? onEnd && onEnd() : onReverseEnd && onReverseEnd();
			}
			else {
				onAnimate( timing( (positive ? t : duration - t) / duration ) );
			}
		} );

		return extend( timer, {
			reverse : function () {
				positive = !positive;
				if ( !isAnimateStart ) {
					timer.start();
					isAnimateStart = true;
					if ( positive === true ) {
						onStart && onStart();
					}
				}
			}
		} );
	}


	animate.Timing = Timing;
	animate.Bezier = Bezier;

	// 位移动画
	function moveAnimate( animationInfo ) {
		var onAnimate = animationInfo.onAnimate, // 动画回调
			startPos = animationInfo.startPos, // 起始位置
			distance = animationInfo.endPos - startPos; // 移动距离

		return animate( {
			timing : animationInfo.timing,
			duration : animationInfo.duration,
			onAnimate : function ( ratio ) {
				onAnimate( startPos + distance * ratio );
			},
			onEnd : animationInfo.onEnd
		} );
	}

	function scrollYTo( y, totalTime, spacingTime ) {
		spacingTime = spacingTime || 1 / 60;
		var scrollTop = document.querySelector( "body" ).scrollTop,
			stepY = (y - scrollTop) * (spacingTime / totalTime),
			isUp = y < scrollTop;

		function scroll() {
			scrollTop += stepY;
			document.querySelector( "body" ).scrollTop = scrollTop;
			if ( isUp == (y < scrollTop) ) {
				setTimeout( scroll, spacingTime );
			}
		}

		scroll();
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

	//endregion


	//region控件
	var PagePanel = function () {
		var CutEffect = {
			SlideIn : function ( screen, page ) {
				return {
					lay : function ( isIn ) {
						css( page, "transform", translate3d( isIn ? "100%" : 0, 0, 0 ) );
					},
					transition : function ( isIn, duration, onEnd ) {
						return transition( page, "ease-in-out " + duration + "s", "transform", translate3d( isIn ? 0 : "100%", 0, 0 ), onEnd );
					},
					clear : function () {
						removeCss( page, "transform" );
					},
					fixed : true
				};
			},
			FadeIn : function ( screen, page ) {
				return {
					lay : function ( isIn ) {
						css( page, "opacity", isIn ? 0 : 1 );
					},
					transition : function ( isIn, duration, onEnd ) {
						return transition( page, duration + "s", "opacity", isIn ? 1 : 0, onEnd );
					},
					clear : function () {
						removeCss( page, "opacity" );
					}
				};
			}
		};

		var CutinMode = {
			normal : 0,
			reverse : 1,
			noEffect : 2
		};

		function PagePanel( parent, globalArg ) {
			firstCall( PagePanel, function () {
				insertCSSRules( {
					".z-page" : {
						position : "absolute",
						left : 0,
						right : 0,
						top : 0,
						bottom : 0,
						"z-index" : 1
					},
					"body > .z-page" : {
						position : "fixed"
					}
				}, true );
			} );

			globalArg = defaultArg( globalArg, {
				effect : CutEffect.SlideIn,
				duration : 0.2
			} );

			// 初始化元素
			parent.classList.add( "z-page-panel" );
			var pages = {};

			var mainPage = parent.querySelector( ".main-page" ); // 主页
			var curPage = mainPage; // 当前页面

			// 遍历子页节点,存储该子页节点,并删除其id
			loopArray( parent.querySelectorAll( ".main-page, .sub-page, .slide-page" ), function ( page ) {
				pages[page.classList.contains( "main-page" ) ? "$" : extractAttribute( page, "id" )] = page;
				page !== mainPage && removeNode( page );
			} );

			// 如果是安卓的话,将全局滚动绑定到页面版的滚动 ios对页面内div的滚动支持较好
			!ua.ios && addHandler( window, "scroll", function () {
				curPage && curPage.zScroll && curPage.zScroll.trig();
			} );

			// 修饰页面,添加事件和display方法
			function doPage( newPage ) {
				var insertEvent = Event(),
					removeEvent = Event(),
					cutInEndEvent = Event(),
					cutOutStartEvent = Event();

				newPage.classList.add( "z-page" );
				!ua.ios && newPage.setAttribute( "data-page-scroll", "" );

				return insert( newPage, {
					// 显示页
					display : function ( arg ) {
						if ( newPage === curPage ) {
							return;
						}
						newPage.classList.add( "visibility" );
						arg = defaultArg( arg, globalArg );
						var oldPage = curPage;
						var cutInMode = arg.cutinMode || CutinMode.normal; // 切入模式,默认是正切入
						var isIn = cutInMode === CutinMode.normal; // 是否是切入
						var cutAnimate = arg.effect( parent, isIn ? newPage : oldPage ); // 切入动画

						// 加载到文档中
						if ( ua.ios ) {
							parent.appendChild( newPage );
							loopSelector( oldPage, "[data-scroll]", function ( node ) {
								node.pScrollTop = node.scrollTop;
							} );
							loopSelector( newPage, "[data-scroll]", function ( node ) {
								node.pScrollTop !== undefined && node.pScrollTop !== node.scrollTop && (node.scrollTop = node.pScrollTop);
							} );
						}
						else {
							cutAnimate.fixed ? document.body.appendChild( newPage ) : parent.appendChild( newPage );
							oldPage.pScrollTop = document.body.scrollTop;
							newPage.pScrollTop && css( newPage, "top", -newPage.pScrollTop + "px" );
						}
						isIn ? insertEvent.trig() : oldPage.cutOutStartEvent.trig();

						// 动画结束的清理工作
						function end() {
							//cutAnimate.clear && cutAnimate.clear( isIn );
							removeCss( newPage, ["top", "z-index"] );
							removeNode( oldPage );
							document.body.classList.remove( "cutting" );

							if ( !ua.ios ) {
								cutAnimate.fixed && parent.appendChild( newPage );
								document.body.scrollTop = newPage.pScrollTop;
								newPage.zScroll && newPage.zScroll.trig()
							}

							isIn ? cutInEndEvent.trig() : oldPage.removeEvent.trig();
							isIn && arg.onCutIn && arg.onCutIn();
						}

						// 触发动画
						var curScrollTop = document.body.scrollTop;
						css( newPage, "z-index", isIn ? 3 : -1 );
						document.body.classList.add( "cutting" );
						cutAnimate.lay && cutAnimate.lay( isIn );
						setTimeout( function () {
							if ( !ua.ios ) {
								document.body.scrollTop = curScrollTop;
							}
							newPage.classList.remove( "visibility" );
							cutInMode === CutinMode.noEffect ? end() : setTimeout( function () {
								cutAnimate.transition( isIn, arg.duration, end );
							}, 0 );
						}, 0 );

						curPage = newPage;
					},
					onInsert : insertEvent.regist,
					onRemove : removeEvent.regist,
					onCutInEnd : cutInEndEvent.regist,
					onCutOutStart : cutOutStartEvent.regist,
					cutOutStartEvent : cutOutStartEvent,
					removeEvent : removeEvent
				} );
			}

			doPage( mainPage );

			insert( parent, {
				curPage : function () {
					return curPage;
				},
				mainPage : function () {
					return mainPage;
				},
				pages : function () {
					return pages;
				},
				getPage : function ( pageId ) {
					return is.String( pageId ) ? pageId in pages ? doPage( pages[pageId].cloneNode( true ) ) : null : doPage( pageId );
				}
			} );

			return parent;
		}

		PagePanel.CutEffect = CutEffect;
		PagePanel.CutinMode = CutinMode;

		return PagePanel;
	}();


	// endregion
	//endregion

	//随机数时间戳

	//region other

	//  返回顶部的通用方法

	//  实现base64解码

	function base64_decode( data ) {
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
		if ( !data ) {
			return data;
		}
		data += '';
		do {
			h1 = b64.indexOf( data.charAt( i++ ) );
			h2 = b64.indexOf( data.charAt( i++ ) );
			h3 = b64.indexOf( data.charAt( i++ ) );
			h4 = b64.indexOf( data.charAt( i++ ) );
			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;
			if ( h3 == 64 ) {
				tmp_arr[ac++] = String.fromCharCode( o1 );
			}
			else if ( h4 == 64 ) {
				tmp_arr[ac++] = String.fromCharCode( o1, o2 );
			}
			else {
				tmp_arr[ac++] = String.fromCharCode( o1, o2, o3 );
			}
		}
		while ( i < data.length );
		dec = tmp_arr.join( '' );
		dec = utf8_decode( dec );
		return dec;
	}

	// 实现utf8解码

	function utf8_decode( str_data ) {
		var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
		str_data += '';
		while ( i < str_data.length ) {
			c1 = str_data.charCodeAt( i );
			if ( c1 < 128 ) {
				tmp_arr[ac++] = String.fromCharCode( c1 );
				i++;
			}
			else if ( c1 > 191 && c1 < 224 ) {
				c2 = str_data.charCodeAt( i + 1 );
				tmp_arr[ac++] = String.fromCharCode( ((c1 & 31) << 6) | (c2 & 63) );
				i += 2;
			}
			else {
				c2 = str_data.charCodeAt( i + 1 );
				c3 = str_data.charCodeAt( i + 2 );
				tmp_arr[ac++] = String.fromCharCode( ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63) );
				i += 3;
			}
		}
		return tmp_arr.join( '' );
	}


	function stringToUnicode( text ) {
		var str = "";
		for ( var i = 0; i < text.length; i++ ) {
			var temp = text.charCodeAt( i ).toString( 16 );
			str += "\\u" + new Array( 5 - String( temp ).length ).join( "0" ) + temp;
		}
		return str;
	}

	function unicodeToString( text ) {
		return unescape( text.replace( /\\u/g, "%u" ) )
	}


	function stringToEntity( text ) {
		var str = "";
		for ( var i = 0; i < text.length; i++ ) {
			str += "&#" + text.charCodeAt( i ) + ";";
		}
		return str;
	}

	function entityToString( text ) {
		var div = document.createElement( "div" );
		div.innerHTML = text;
		return div.innerHTML;
	}

	function backTop( btnId ) {
		var btn = document.getElementById( btnId );
		var d = document.documentElement;
		var b = document.body;
		var scrollHandler = addHandler( window, "scroll", set );

		function set() {
			btn.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block' : "none"
		}

		btn.style.display = "none";
		addHandler( btn, "click", function () {
			btn.style.display = "none";
			scrollHandler.remove();
			btn.timer = setInterval( function () {
				d.scrollTop -= Math.ceil( (d.scrollTop + b.scrollTop) * 0.1 );
				b.scrollTop -= Math.ceil( (d.scrollTop + b.scrollTop) * 0.1 );
				if ( (d.scrollTop + b.scrollTop) == 0 ) clearInterval( btn.timer, scrollHandler = addHandler( window, "scroll", set ) );
			}, 10 );
		} );

	}


	// 日期格式化函数+调用方法

	Date.prototype.format = function ( format ) {
		var o = {
			"M+" : this.getMonth() + 1, //month
			"d+" : this.getDate(),    //day
			"h+" : this.getHours(),   //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor( (this.getMonth() + 3) / 3 ),  //quarter
			"S" : this.getMilliseconds() //millisecond
		};
		if ( /(y+)/.test( format ) ) {
			format = format.replace( RegExp.$1,
				(this.getFullYear() + "").substr( 4 - RegExp.$1.length ) );
		}
		for ( var k in o ) {
			if ( new RegExp( "(" + k + ")" ).test( format ) ) {
				format = format.replace( RegExp.$1, RegExp.$1.length == 1 ? o[k] : ( "00" + o[k]).substr( ("" + o[k]).length ) );
			}
		}
		return format;
	};
	//alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
	//时间个性化输出功能

	/*
	 1、< 60s, 显示为“刚刚”
	 2、>= 1min && < 60 min, 显示与当前时间差“XX分钟前”
	 3、>= 60min && < 1day, 显示与当前时间差“今天 XX:XX”
	 4、>= 1day && < 1year, 显示日期“XX月XX日 XX:XX”
	 5、>= 1year, 显示具体日期“XXXX年XX月XX日 XX:XX”
	 */
	function timeFormat( time ) {
		var date = new Date( time ),
			curDate = new Date(),
			year = date.getFullYear(),
			month = date.getMonth() + 10,
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			curYear = curDate.getFullYear(),
			curHour = curDate.getHours(),
			timeStr;

		if ( year < curYear ) {
			timeStr = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
		}
		else {
			var pastTime = curDate - date,
				pastH = pastTime / 3600000;

			if ( pastH > curHour ) {
				timeStr = month + '月' + day + '日 ' + hour + ':' + minute;
			}
			else if ( pastH >= 1 ) {
				timeStr = '今天 ' + hour + ':' + minute + '分';
			}
			else {
				var pastM = curDate.getMinutes() - minute;
				if ( pastM > 1 ) {
					timeStr = pastM + '分钟前';
				}
				else {
					timeStr = '刚刚';
				}
			}
		}
		return timeStr;
	}

	function checkKey( iKey ) {
		if ( iKey == 32 || iKey == 229 ) {
			return true;
		}
		/*空格和异常*/
		if ( iKey > 47 && iKey < 58 ) {
			return true;
		}
		/*数字*/
		if ( iKey > 64 && iKey < 91 ) {
			return true;
		}
		/*字母*/
		if ( iKey > 95 && iKey < 108 ) {
			return true;
		}
		/*数字键盘1*/
		if ( iKey > 108 && iKey < 112 ) {
			return true;
		}
		/*数字键盘2*/
		if ( iKey > 185 && iKey < 193 ) {
			return true;
		}
		/*符号1*/
		if ( iKey > 218 && iKey < 223 ) {
			return true;
		}
		/*符号2*/
		return false;
	}

	function uniqueId() {
		var a = Math.random, b = parseInt;
		return Number( new Date() ).toString() + b( 10 * a() ) + b( 10 * a() ) + b( 10 * a() );
	}

// 全角半角转换

	//iCase: 0全到半，1半到全，其他不转化
	function chgCase( sStr, iCase ) {
		if ( typeof sStr != "string" || sStr.length <= 0 || !(iCase === 0 || iCase == 1) ) {
			return sStr;
		}
		var i, oRs = [], iCode;
		if ( iCase ) {/*半->全*/
			for ( i = 0; i < sStr.length; i += 1 ) {
				iCode = sStr.charCodeAt( i );
				if ( iCode == 32 ) {
					iCode = 12288;
				}
				else if ( iCode < 127 ) {
					iCode += 65248;
				}
				oRs.push( String.fromCharCode( iCode ) );
			}
		}
		else {/*全->半*/
			for ( i = 0; i < sStr.length; i += 1 ) {
				iCode = sStr.charCodeAt( i );
				if ( iCode == 12288 ) {
					iCode = 32;
				}
				else if ( iCode > 65280 && iCode < 65375 ) {
					iCode -= 65248;
				}
				oRs.push( String.fromCharCode( iCode ) );
			}
		}
		return oRs.join( "" );
	}


	//endregion

	//region 排序
	// 希尔排序
	function shellSort( array ) {

		// var array = [13,14,94,33,82,25,59,94,65,23,45,27,73,25,39,10];

		var tempArr = [1750, 701, 301, 132, 57, 23, 10, 4, 1];
		// reverse() 在维基上看到这个最优的步长 较小数组
		//var tempArr = [1031612713, 217378076, 45806244,9651787, 2034035, 428481, 90358, 19001, 4025, 836, 182, 34, 9, 1]
		//针对大数组的步长选择
		var i = 0;
		var tempArrtempArrLength = tempArr.length;
		var len = array.length;
		var len2 = parseInt( len / 2 );

		for ( ; i < tempArrLength; i++ ) {
			if ( tempArr[i] > len2 ) {
				continue;
			}

			tempSort( tempArr[i] );
		}

		// 排序一个步长
		function tempSort( temp ) {

			//console.log(temp) 使用的步长统计

			var i = 0, j = 0, f, tem, key;
			var tempLen = len % temp > 0 ? parseInt( len / temp ) + 1 : len / temp;


			for ( ; i < temp; i++ ) {// 依次循环列

				for ( j = 1; /*j < tempLen && */temp * j + i < len; j++ ) {
					//依次循环每列的每行
					tem = f = temp * j + i;
					key = array[f];

					while ( (tem -= temp) >= 0 ) {
						// 依次向上查找
						if ( array[tem] > key ) {
							array[tem + temp] = array[tem];
						}
						else {
							break;
						}
					}

					array[tem + temp] = key;

				}
			}

		}

		return array;

	}

	// 插入排序
	function insertSort( array ) {

		//var array =[0,1,2,44,4,324,5,65,6,6,34,4,5,6,2,43,5,6,62,43,5,1,4,51,56,76,7,7,2,1,45,4,6,7];

		var i = 1, j, temp, key,
			len = array.length;

		for ( ; i < len; i++ ) {

			temp = j = i;
			key = array[j];

			while ( --j > -1 ) {
				if ( array[j] > key ) {
					array[j + 1] = array[j];
				}
				else {
					break;
				}
			}

			array[j + 1] = key;
		}

		return array;
	}

	function systemSort( array ) {
		return array.sort( function ( a, b ) {
			return a - b;
		} );
	}

	// 冒泡排序
	function bubbleSort( array ) {
		var i = 0, len = array.length,
			j, d;
		for ( ; i < len; i++ ) {
			for ( j = 0; j < len; j++ ) {
				if ( array[i] < array[j] ) {
					d = array[j];
					array[j] = array[i];
					array[i] = d;
				}
			}
		}
		return array;
	}

	// 快速排序
	function quickSort( array ) {
		//var array = [8,4,6,2,7,9,3,5,74,5];
		//var array =[0,1,2,44,4,324,5,65,6,6,34,4,5,6,2,43,5,6,62,43,5,1,4,51,56,76,7,7,2,1,45,4,6,7];
		var i = 0;
		var j = array.length - 1;
		var Sort = function ( i, j ) {

			// 结束条件
			if ( i == j ) {
				return
			}

			var key = array[i];
			var tempi = i; // 记录开始位置
			var tempj = j; // 记录结束位置

			while ( j > i ) {
				// j <<-------------- 向前查找
				if ( array[j] >= key ) {
					j--;
				}
				else {
					array[i] = array[j];
					//i++ ------------>>向后查找
					while ( j > ++i ) {
						if ( array[i] > key ) {
							array[j] = array[i];
							break;
						}
					}
				}
			}

			// 如果第一个取出的 key 是最小的数
			if ( tempi == i ) {
				Sort( ++i, tempj );
				return;
			}

			// 最后一个空位留给 key
			array[i] = key;

			// 递归
			Sort( tempi, i );
			Sort( j, tempj );
		};

		Sort( i, j );

		return array;
	}

	//endregion

	// region 导出
	window.Z = window.Z || {};
	insert( window.Z, {
		// 常量
		client : client,
		is : is,//判断类型
		ua : ua,//判断浏览器
		log : log,
		error : error,
		//CustomError 自定义抛出error


		//string object prototype

		//url
		//String.path
		//String.arg
		//String.hash

		//String.replaceAll 替换全部
		//String.trim 清除空格
		//String.startWith
		//String.endWith
		HtmlEncode : HtmlEncode, //转义html标签
		//Date.Format 时间日期格式转换
		//String.path
		//String.path


		// util
		run : run,// 运行脚本
		inRange : inRange,// 判断x是否在[a,b)或[b,a)区间内
		range : range,// 将x限制在[a,b]或[b,a]内
		square : square,// 平方函数
		loop : loop,// 循环
		loopArray : loopArray,// 遍历数组
		loopObj : loopObj,
		extend : extend,
		concat : concat,
		insert : insert,
		equals : equals,//对象比较
		hasPrototypeProperty : hasPrototypeProperty,
		hasPlugin : hasPlugin,//检测浏览器插件
		parsePairString : parsePairString,
		firstCall : firstCall,// 函数第一次被调用时执行回调
		LinkedList : LinkedList,//双向链表
		inheritPrototype : inheritPrototype,//寄生组合继承

		//mobile util


		//DOM
		inDocument : inDocument,// 判断一个节点是否在文档内
		onInsert : onInsert,
		insertDom : insertDom,//insert after before
		containsNode : containsNode,//节点是否为一节点的后代
		getInnerText : getInnerText,
		setInnerText : setInnerText,
		getInitZoom : getInitZoom,//获取移动设备初始化大小
		getPageLeft : getPageLeft,// 计算一个元素相对于文档的偏移
		getPageTop : getPageTop,
		docHeight : docHeight,
		docWidth : docWidth,
		leftPos : leftPos, //窗口位置
		topPos : topPos,
		getPageHeight : getPageHeight,//获取页面高度
		getPageScrollLeft : getPageScrollLeft,//获取页面scrollLeft
		getPageViewWidth : getPageViewWidth,//获取页面可视宽度
		getPageWidth : getPageWidth,//获取页面宽度
		getPageScrollTop : getPageScrollTop,//获取页面scrollTop
		getPageViewHeight : getPageViewHeight,//获取页面可视高度
		getBoundingClientRect : getBoundingClientRect,//确定元素大小
		removeNode : removeNode,//// 移除节点
		evalScript : evalScript,//获取脚本内容
		stripScript : stripScript,//清空脚本
		loadScript : loadScript,// 加载脚本
		loadScriptString : loadScriptString,
		hasClass : hasClass,
		addClass : addClass,
		removeClass : removeClass,
		toggleClass : toggleClass,
		toggleState : toggleState,// 切换状态
		switchClass : switchClass,// 根据flag,添加或删除class
		extractAttribute : extractAttribute,// 抽取属性,抽取后将该属性删除
		loopSelector : loopSelector,
		querySelectorAll : querySelectorAll,// 遍历选择器 包括自己
		doNodeByAttribute : doNodeByAttribute,// 根据属性处理元素
		element : element,// 创建一个元素的快捷方式
		doHTML : doHTML,
		HTMLTemplate : HTMLTemplate,

		// css
		css : css,// 设置CSS值,可以设置一条或者设置一组
		removeCss : removeCss,// 移除CSS值,可以移除一条,或者移除一组
		getStyle : getStyle,//获取内嵌style样式
		getCurrentStyle : getCurrentStyle,//currentStyle包含内嵌style和运行时的runtimeStyle 包含内联
		cssRuleString : cssRuleString,// 生成CSS样式字符串(为添加CSS规则准备)
		insertCSSRules : insertCSSRules,// 添加CSS规则 添加到head的style标签
		TupleString : TupleString,// 如TupleString( "rgba" )( 2, 3, 4, 0.4 )会返回rgba(2,3,4,0.4);
		translate3d : translate3d,
		translate : translate,
		autoLayout : autoLayout,//自动计算左右边距
		autoCenter : autoCenter,

		// 事件
		Event : Event,//链表事件
		DomReady : DomReady,//$(document).ready(function(){})
		addHandler : addHandler,
		removeHandler : removeHandler,
		getEvent : getEvent,
		getEventTarget : getEventTarget,
		preventDefault : preventDefault,
		isTouchDevice : isTouchDevice, //判断是否Touch屏幕
		isMobileUserAgent : isMobileUserAgent,//判断是否移动设备访问
		handleTouchEvent : handleTouchEvent,
		trigger : trigger,//模拟事件
		triggerMutationEvents : triggerMutationEvents,//模拟变动事件
		triggerHTMLEvents : triggerHTMLEvents,//模拟HTML事件
		triggerCustomEvents : triggerCustomEvents,//自定义模拟事件

		onTap : onTap,
		swipe : swipe,
		tapHold : tapHold,
		getWheelDelta : getWheelDelta,//鼠标滑轮事件
		getCharCode : getCharCode,//获取键码
		follow : follow,//跟随
		gestureChange : gestureChange,//缩放
		onSwipeStartH : onSwipeStartH,
		onSwipeStartV : onSwipeStartV,
		onDragH : onDragH,
		onDragV : onDragV,
		moveAnimate:moveAnimate,

		//表单事件
		getSelectedText : getSelectedText, //取得选择的文本
		selectText : selectText,//取得部分文本使用
		getClipboardText : getClipboardText,//操作剪贴板
		setClipboardText : setClipboardText,
		getSelectedOptions : getSelectedOptions,//获得多个选择选项
		addOption : addOption,
		deleteOption : deleteOption,
		serialize : serialize,//表单序列化


		// url Ajax
		IsURL : IsURL,//判断是否为网址
		removeUrlPrefix : removeUrlPrefix,//去掉url前缀
		url : url,
		defaultArg : defaultArg,
		createXHR : createXHR,
		createCORSRequest : createCORSRequest,//跨域请求 客户端设置Origin:http://www.zodiac.com
		// 服务端设置Access-Control-Allow-Origin:http://www.zodiac.com或者Access-Control-Allow-Origin:*
		addQueryStingArg : addQueryStingArg, //追加url参数
		addHash : addHash,//追加url哈希查询
		Ajax : Ajax,

		//xml
		parsXml : parsXml,//解析xml字符串
		serializeXml : serializeXml,//序列化xmlDom

		// 加载
		onLoad : onLoad,

		//cookie 加入收藏夹 设置首页
		setCookie : setCookie,
		getCookie : getCookie,
		AddFavorite : AddFavorite,//加入收藏夹 不支持chrome
		setHomepage : setHomepage, //设置首页 不支持chrome

		//animate
		nodeAnimate : nodeAnimate,
		transition : transition,
		scrollYTo : scrollYTo,
		Timer : Timer,


		//other
		utf8_decode : utf8_decode, // 实现utf8解码
		stringToUnicode : stringToUnicode,
		unicodeToString : unicodeToString,
		stringToEntity : stringToEntity,
		entityToString : entityToString,
		base64_decode : base64_decode,//实现base64解码
		backTop : backTop,//返回顶部的通用方法
		// Date.prototype.format  // 日期格式化函数+调用方法
		timeFormat : timeFormat,//时间个性化输出功能
		checkKey : checkKey,//确认是否键盘有效输入值
		uniqueId : uniqueId, //随机数时间戳
		chgCase : chgCase, //只有中文输入法才会有“全/半角”的区分 全角半角转换 一个英文字符（如“a”)所占的位置，人们称其为“半角”
		// 而一个汉字所占的位置则等于两个英文字符，故称其为“全角”
		// 在全角状态下输英文字符会被当做中文字符处理 占两个字符的位置
		// ---------- 一些排序算法
		// js 利用sort进行排序
		systemSort : systemSort,
		// 冒泡排序
		bubbleSort : bubbleSort,
		// 快速排序
		quickSort : quickSort,

		// 插入排序
		insertSort : insertSort,

		// 希尔排序
		shellSort : shellSort


	} );
    window.W = window.Z;
	// endregion
})();