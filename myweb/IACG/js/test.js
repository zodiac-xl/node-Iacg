/**
 * Created by 小龙 on 2014/5/20.
 */







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
	swipe : swipe,//滑动
	tap : tap,//轻触或点击
	tapHold : tapHold,//长按
	getWheelDelta : getWheelDelta,//鼠标滑轮事件
	getCharCode : getCharCode,//获取键码
	follow : follow,//跟随
	gestureChange : gestureChange,//缩放

	//DOM
	loopNodeList : loopNodeList,//遍历节点
	inDocument : inDocument,//判断节点是否在文档中
	removeNode : removeNode,
	appendHead : appendHead,//appendChild到目标元素的第一个子元素
	appendChildren : appendChildren,// 将源元素的全部子元素添加到目标元素中
	extractAttribute : extractAttribute,//抽取属性 并删除原属性
	querySelectorAll:querySelectorAll,// 处理选择器选子元素和选自己的问题
	element:element,//快速创建一个元素
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
