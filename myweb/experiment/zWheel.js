/**
 * Created by 小龙 on 2015/1/5.
 */

(function () {
	var loop = Z.loop,
		loopArray = Z.loopArray,
		TupleString = Z.TupleString,
		insert = Z.insert,
		css = Z.css,
		onDragV = Z.onDragV,
		firstCall = Z.firstCall,
		insertCSSRules = Z.insertCSSRules,
		animate = Z.animate,
		moveAnimate = Z.moveAnimate,
		onTouchStart = Z.onTouchStart,
		Event = Z.Event;

	var PI = Math.PI,
		translate3d = TupleString( "translate3d" ),
		rotateX = TupleString( "rotateX" );

	function arrayIndex( arr, index ) {
		var len = arr.length;
		return arr[((index % len) + len) % len];
	}

	function WheelPanel( parent, arg ) {
		firstCall( WheelPanel, function () {
			insertCSSRules( {
				".z-wheel-panel" : {
					position : "relative"
				},
				".z-wheel-panel > div" : {
					top : 0,
					left : 0,
					right : 0,
					position : "absolute"
				}
			} );
		} );

		parent.classList.add( "z-wheel-panel" );

		var s = arg.sideNumber, // 边的数量
			r = arg.radius, // 半径
			items = [],
			curCenterIndex;

		var scrollEndEvent = Event(),
			itemDisplayEvent = Event(),
			centerChangeEvent = Event();

		// 创建项
		loop( s, function ( i ) {
			var item = document.createElement( "div" );
			item.itemIndex = i;
			parent.appendChild( item );
			items.push( item );
		} );

		var lastOffset = 0, lastDisplay = {}, itemHeight, firstDisplay = true;

		function offset( offsetDeg ) {
			if ( Math.abs( offsetDeg - lastOffset ) > Math.PI / 2 ) {
				offset( offsetDeg + ( offsetDeg > lastOffset ? -1 : 1 ) * Math.PI / 2 );
			}

			// 计算项高
			if ( itemHeight === undefined ) {
				itemHeight = items[0].offsetHeight;
			}

			var centerIndex = (Math.round( -offsetDeg / PI * s / 2 ) % s + s) % s; // 当前中心项
			var curDisplay = {}, // 当前显示项
				newDisplay = []; // 新显示的项

			loopArray( items, function ( item, i ) {
				// 将角度限制在0-360度之间,如果yDeg过小(使用了指数表示法,如1.23e-10),直接设置它为0,放置css样式值出错
				var deg = (((PI / s * 2 * i + offsetDeg) % (2 * PI)) + 2 * PI) % (2 * PI);
				Math.abs( deg ) < 0.01 && (deg = 0);

				var y = item.curY = Math.sin( deg ), // y偏移
					z = Math.cos( deg ), // z偏移
					visible = z > 0; // 当z > 0时,表示该项在前半部分,显示它

				css( item, {
					transform : translate3d( 0, y * r + r - itemHeight / 2 + "px", z * r - r + "px" ) + " " + rotateX( deg + "rad" ),
					visibility : visible ? "visible" : "hidden"
				} );

				// 记录显示的项,如果它上次未显示,视为新显示的项
				if ( visible ) {
					curDisplay[i] = true;
					if ( !lastDisplay[i] ) {
						newDisplay.push( item );
					}
				}
			} );

			// 按照从下往上的顺序排序新显示的项
			newDisplay = newDisplay.sort( function ( lhs, rhs ) {
				return lhs.curY - rhs.curY;
			} );

			// 计算wheelIndex
			if ( offsetDeg > lastOffset ) {
				loopArray( newDisplay.reverse(), function ( item ) {
					item.wheelIndex = (items[(item.itemIndex + 1) % s].wheelIndex || 0) - 1;
				} );
			}
			else {
				loopArray( newDisplay, function ( item ) {
					item.wheelIndex = (items[(item.itemIndex - 1 + s) % s].wheelIndex || 0) + 1;
				} );
			}

			if ( firstDisplay ) {
				var diff = -items[0].wheelIndex;
				loopArray( newDisplay, function ( item ) {
					item.wheelIndex += diff;
				} );
				firstDisplay = false;
			}

			// 如果有新显示的项,触发itemDisplay事件
			if ( newDisplay.length !== 0 ) {
				itemDisplayEvent.trig( newDisplay );
			}

			// 如果中心项改变,回调centerChangeEvent事件
			if ( centerIndex !== curCenterIndex ) {
				curCenterIndex = centerIndex;
				centerChangeEvent.trig();
			}

			lastOffset = offsetDeg;
			lastDisplay = curDisplay;
			parent.zTop = offsetDeg * 100;
		}

		var scrollAnimate = null, dragStart = false, direction;

		// 结束动画
		function endAnimate( tSpeed ) {
			var start = parent.zTop / 100, speed = Math.abs( tSpeed ) < 0.3 ? 0 : tSpeed;
			var sign = speed === 0 ? direction ? 1 : -1 : speed > 0 ? 1 : -1;
			var end = Math.round( (start + speed * 3 + sign * PI / s / 2) * s / PI / 2 ) * PI / s * 2;
			if ( arg.min !== undefined ) {
				end = -Math.max( arg.min * 2 * PI / s, -end );
			}
			if ( arg.max !== undefined ) {
				end = -Math.min( arg.max * 2 * PI / s, -end );
			}

			scrollAnimate = moveAnimate( {
				timing : animate.Bezier( 0.19, 1, 0.22, 1 ),
				duration : 0.3 * Math.exp( Math.abs( speed ) / 1.3 ),
				startPos : start,
				endPos : end,
				onAnimate : offset,
				onEnd : function () {
					scrollAnimate = null;
					scrollEndEvent.trig();
				}
			} );
		}

		// 触摸面板时,停止上一次的滚动
		onTouchStart( parent, function ( event ) {
			dragStart = false;
			if ( scrollAnimate ) {
				scrollAnimate.stop();
				scrollAnimate = null;
			}

			event.onTouchEnd( function () {
				if ( !dragStart ) {
					endAnimate( 0 );
				}
			} );
		} );

		onDragV( parent, parent, function ( event ) {
			dragStart = true;
			event.setMove( function ( targetPos ) {
				var centerWheelIndex = items[curCenterIndex || 0].wheelIndex;
				targetPos /= 100;

				function limitPos( limit, sign ) {
					var idealPos = -limit * 2 * PI / s;
					return idealPos + sign * Math.atan( Math.abs( targetPos - idealPos ) ) * PI / s * 5;
				}

				if ( arg.min !== undefined && centerWheelIndex < arg.min ) {
					targetPos = limitPos( arg.min, 1 );
				}
				if ( arg.max !== undefined && centerWheelIndex > arg.max ) {
					targetPos = limitPos( arg.max, -1 );
				}
				offset( targetPos );
			} );

			event.onDragEnd( function ( event ) {
				direction = event.direction;
				endAnimate( event.speed );
			} );
		} );

		return insert( parent, {
			curItem : function () {
				return items[curCenterIndex];
			},
			scrollTo : function ( index ) {
				scrollAnimate && scrollAnimate.stop();
				scrollAnimate = moveAnimate( {
					timing : animate.Bezier( 0.19, 1, 0.22, 1 ),
					duration : 0.3,
					startPos : -curCenterIndex * 2 * PI / s,
					endPos : -index * 2 * PI / s,
					onAnimate : offset
				} );
			},
			display : offset,
			onItemDisplay : itemDisplayEvent.regist,
			onScrollEnd : scrollEndEvent.regist,
			onCenterChange : centerChangeEvent.regist
		} );
	}

	function WheelOptionPanel( parent, options ) {
		var parentHeight = parent.offsetHeight;
		loopArray( parent.children, function ( wheel, i ) {
			var option = options[i];
			Z.WheelPanel( wheel, {
				radius : parentHeight / 2 << 0,
				sideNumber : 16,
				min : 0,
				max : option.length - 1
			} );

			wheel.onItemDisplay( function ( newDisplay ) {
				loopArray( newDisplay, function ( item ) {
					var wheelIndex = item.wheelIndex;
					if ( wheelIndex >= 0 && wheelIndex < option.length ) {
						item.innerHTML = option[wheelIndex];
					}
					else {
						item.innerHTML = "";
					}
				} );
			} );

			wheel.display( 0 );
		} );

		return insert( parent, {
			value : function () {
				var retVal = [];
				loopArray( parent.children, function ( wheel ) {
					retVal.push( wheel.curItem().innerHTML );
				} );
				return retVal;
			},
			onChange : function ( task ) {
				loopArray( parent.children, function ( wheel ) {
					wheel.onCenterChange( task );
				} );
				task();
			}
		} );
	}

	insert( Z, {
		WheelPanel : WheelPanel,
		WheelOptionPanel : WheelOptionPanel,
		arrayIndex : arrayIndex
	} );
})();