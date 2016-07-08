/**
 * Created by 小龙 on 2014/9/29.
 */
QUnit.test( "hello test", function ( assert ) {
	assert.ok( 1 == "1", "Passed!" );
} );


var test = [
		"QUnit.asyncTest()",//Add an asynchronous test to run. The test must include a call to QUnit.start().
		"QUnit.module()", //Group related tests under a single label. 一个标签下的组相关测试
		"QUnit.test()" //Add a test to run.
	],
	assertProperties = [
		"deepEqual",//深度递归比较,基本类型,数组、对象、正则表达式、日期和功能
		"notDeepEqual",
		"equal",
		"notEqual",
		"strictEqual",//严格比较 值和类型
		"notStrictEqual",
		"propEqual",//用于严格对比对象 包括对象的值、属性的数据类型 （类似== 和===的差别）
		"notPropEqual",
		"expect",//期望(数量)注册一个预期的计数。如果断言运行的数量不匹配预期的统计,测试就会失败。
		"ok",// 一个布尔检查
		"push",//输出封装的JavaScript函数返回的结果报告
		"throws"//测试如果一个回调函数抛出一个异常,并有选择地比较抛出的错误。
	],
	asyncControl = [
		"asyncTest", // QUnit测试异步代码。asyncTest将自动停止测试运行器,等待您的代码调用QUnit.start()继续。
		"start", //Start running tests again after the testrunner was stopped
		"stop"  //当异步测试有多个出口点,使用QUnit.stop 增加解除test runner等待 应该调用QUnit.start()的次数。
	],
	callbackHandlers = [
		"begin",
		"done",
		"log",
		"moduleStart",
		"moduleDone",
		"testStart",
		"testDone"
	],
	Configuration = [
		"assert",
		"config",
		"QUnit.dump.parse()",
		"QUnit.extend() "
	];

//region test
QUnit.test( "a test", function ( assert ) {
	function square( x ) {
		return x * x;
	}

	var result = square( 2 );
	assert.equal( result, 4, "square(2) equals 4" );
} );
QUnit.asyncTest( "asynchronous test: one second later!", function ( assert ) {
	assert.expect( 1 );
	setTimeout( function () {
		assert.ok( true, "Passed and ready to resume!" );
		QUnit.start();
	}, 1000 );
} );
//endregion


//region assert 断言


//deepEqual   对应notDeepEqual() 深度递归比较,基本类型,数组、对象、正则表达式、日期和功能
QUnit.test( "deepEqual test", function ( assert ) {
	var obj = { foo : "bar" };
	assert.deepEqual( obj, { foo : "bar" }, "Two objects can be the same in value" );
} );
QUnit.test( "notDeepEqual test", function ( assert ) {
	var obj = { foo : "bar" };
	assert.notDeepEqual( obj, { foo : "bla" }, "Different object, same key, different value, not equal" );
} );

//equal 对应notEqual()
QUnit.test( "a test", function ( assert ) {
	assert.equal( 1, "1", "String '1' and number 1 have the same value" );
	assert.equal( 0, 0, "Zero, Zero; equal succeeds" );
	assert.equal( "", 0, "Empty, Zero; equal succeeds" );
	assert.equal( "", "", "Empty, Empty; equal succeeds" );
	assert.equal( "three", 3, "Three, 3; equal fails" );
	assert.equal( null, false, "null, false; equal fails" );
} );
QUnit.test( "a test", function ( assert ) {
	assert.notEqual( 1, "2", "String '2' and number 1 don't have the same value" );
} );
//strictEqual()  notStrictEqual()
QUnit.test( "strictEqual test", function ( assert ) {
	assert.strictEqual( 1, 1, "1 and 1 have the same value and type" );
} );

QUnit.test( "a test", function ( assert ) {
	assert.notStrictEqual( 1, "1", "String '1' and number 1 have the same value but not the same type" );
} );


//propEqual notPropEqual 用于严格对比对象 包括对象的值、属性的数据类型 （equal和propEqual 类似== 和===的差别）
QUnit.test( "notPropEqual test", function ( assert ) {
	function Foo( x, y, z ) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	Foo.prototype.doA = function () {
	};
	Foo.prototype.doB = function () {
	};
	Foo.prototype.bar = 'prototype';
	var foo = new Foo( 1, "2", [] );
	var bar = new Foo( "1", 2, {} );
	assert.notPropEqual( foo, bar, "Properties values are strictly compared." );
} );


//expect 期望(数量)注册一个预期的计数。如果断言运行的数量不匹配预期的统计,测试就会失败。
QUnit.test( "a test", function ( assert ) {
	assert.expect( 3 );
	function calc( x, operation ) {
		return operation( x );
	}

	var result = calc( 2, function ( x ) {
		assert.ok( true, "calc() calls operation function" );
		return x * x;
	} );
	assert.equal( result, 4, "2 squared equals 4" );
} );


//ok  一个布尔检查
QUnit.test( "ok test", function ( assert ) {
	assert.ok( true, "true succeeds" );
	assert.ok( "non-empty", "non-empty string succeeds" );
	assert.ok( false, "false fails" );
	assert.ok( 0, "0 fails" );
	assert.ok( NaN, "NaN fails" );
	assert.ok( "", "empty string fails" );
	assert.ok( null, "null fails" );
	assert.ok( undefined, "undefined fails" );
} );

//push() 输出封装的JavaScript函数返回的结果报告
//一些测试套件可能需要表达一个期望,不是由任何QUnit内置的断言。这种需要一个封装的JavaScript函数,该函数返回一个布尔值,表示结果,这个值可以传递到QUnit的断言。
QUnit.assert.mod2 = function ( value, expected, message ) {
	var actual = value % 2;
	this.push( actual === expected, actual, expected, message );
};
QUnit.test( "mod2", function ( assert ) {
	assert.expect( 2 );
	assert.mod2( 2, 0, "2 % 2 == 0" );
	assert.mod2( 3, 1, "3 % 2 == 1" );
} );

//测试如果一个回调函数抛出一个异常,并有选择地比较抛出的错误。
QUnit.test( "throws", function ( assert ) {
	function CustomError( message ) {
		this.message = message;
	}

	CustomError.prototype.toString = function () {
		return this.message;
	};
	assert.throws(
		function () {
			throw "error"
		},
		"throws with just a message, not using the 'expected' argument"
	);
	assert.throws(
		function () {
			throw new CustomError( "some error description" );
		},
		/description/,
		"raised error message contains 'description'"
	);
	assert.throws(
		function () {
			throw new CustomError();
		},
		CustomError,
		"raised error is an instance of CustomError"
	);
	assert.throws(
		function () {
			throw new CustomError( "some error description" );
		},
		new CustomError( "some error description" ),
		"raised error instance matches the CustomError instance"
	);
	assert.throws(
		function () {
			throw new CustomError( "some error description" );
		},
		function ( err ) {
			return err.toString() === "some error description";
		},
		"raised error instance satisfies the callback function"
	);
} );

//endregion


//region async-control异步控制

//QUnit.asyncTest() QUnit测试异步代码。asyncTest将自动停止测试运行器,等待您的代码调用QUnit.start()继续。
QUnit.asyncTest( "asynchronous test: one second later!", function ( assert ) {
	assert.expect( 1 );
	setTimeout( function () {
		assert.ok( true, "Passed and ready to resume!" );
		QUnit.start();
	}, 1000 );
} );
QUnit.asyncTest( "asynchronous test: video ready to play", function ( assert ) {
	assert.expect( 1 );
	var $video = $( "video" );
	$video.on( "canplaythrough", function () {
		assert.ok( true, "video has loaded and is ready to play" );
		QUnit.start();
	} );
} );

//QUnit.start() Start running tests again after the testrunner was stopped
//QUnit.stop()  当异步测试有多个出口点,使用QUnit.stop 增加解除test runner等待 应该调用QUnit.start()的次数。
QUnit.test( "a test", function ( assert ) {
	assert.expect( 1 );
	QUnit.stop();
	setTimeout( function () {
		assert.equal( "someExpectedValue", "someExpectedValue", "ok" );
		QUnit.start();
	}, 150 );
} );

//endregion


//region module QUnit.module()后发生的所有测试调用将被分到模块,直到调用其他其他QUnit.module()。
// 测试结果的测试名称都将使用模块名称。可以使用该模块名称来选择模块内的所有测试运行。

//Example: Use the QUnit.module() function to group tests together:
QUnit.module( "group a" );
QUnit.test( "a basic test example", function ( assert ) {
	assert.ok( true, "this test is fine" );
} );
QUnit.test( "a basic test example 2", function ( assert ) {
	assert.ok( true, "this test is fine" );
} );
QUnit.module( "group b" );
QUnit.test( "a basic test example 3", function ( assert ) {
	assert.ok( true, "this test is fine" );
} );
QUnit.test( "a basic test example 4", function ( assert ) {
	assert.ok( true, "this test is fine" );
} );

//Example: A sample for using the setup and teardown callbacks
QUnit.module( "module A", {
	setup : function () {
// prepare something for all following tests
	},
	teardown : function () {
// clean up after each test
	}
} );

//Example: Lifecycle properties are shared on respective test context 在测试环境下共享各自的生命周期内的属性

QUnit.module( "Machine Maker", {
	setup : function () {
	},
	parts : [ "wheels", "motor", "chassis" ]
} );
QUnit.test( "makes a robot", function ( assert ) {
	this.parts.push( "arduino" );
	assert.equal( this.parts, "robot" );
	assert.deepEqual( this.parts, [ "robot" ] );
} );
QUnit.test( "makes a car", function ( assert ) {
	assert.equal( this.parts, "car" );
	assert.deepEqual( this.parts, [ "car", "car" ] );
} );


//endregion


//region callback

//begin  Register a callback to fire whenever the test suite begins.
QUnit.begin( function ( details ) {
	console.log( "Test amount:", details.totalTests );
} );

//done  Register a callback to fire whenever the test suite ends.
QUnit.done( function ( details ) {
	console.log( "Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime );
} );

//log  Register a callback to fire whenever an assertion completes.
QUnit.log( function ( details ) {
	if ( details.result ) {
		return;
	}
	var loc = details.module + ": " + details.name + ": ",
		output = "FAILED: " + loc + ( details.message ? details.message + ", " : "" );
	if ( details.actual ) {
		output += "expected: " + details.expected + ", actual: " + details.actual;
	}
	if ( details.source ) {
		output += ", " + details.source;
	}
	console.log( output );
} );

//moduleStart  Register a callback to fire whenever a module begins.
QUnit.moduleStart( function ( details ) {
	console.log( "Now running: ", details.name );
} );

//moduleDone  Register a callback to fire whenever a module ends.
QUnit.moduleDone( function ( details ) {
	console.log( "Finished running: ", details.name, "Failed/total: ", details.failed, details.total );
} );

//testStart Register a callback to fire whenever a test begins.
QUnit.testStart( function ( details ) {
	console.log( "Now running: ", details.module, details.name );
} );

//testDone Register a callback to fire whenever a test ends.
QUnit.testDone( function ( details ) {
	console.log( "Finished running: ", details.module, details.name, "Failed/total: ", details.failed, details.total, details.duration );
} );

//endregion


//region Configuration

//assert Namespace for QUnit assertions
QUnit.test( "`ok` assertion defined in the callback parameter", function ( assert ) {
	assert.ok( true, "on the object passed to the `test` function" );
} );

//config Configuration for QUnit
QUnit.config.autostart = false;
QUnit.config.current.testName = "zodiac";
QUnit.config.urlConfig.push( {
	id : "jquery",
	label : "jQuery version",
	value : [ "1.7.2", "1.8.3", "1.9.1" ],
	tooltip : "What jQuery Core version to test against"
} );


//QUnit.dump.parse() 它解析数据结构和对象序列化为字符串。也解析DOM元素outerHtml为字符串
QUnit.log( function ( obj ) {
// Parse some stuff before sending it.
	var actual = QUnit.dump.parse( obj.actual );
	var expected = QUnit.dump.parse( obj.expected );
// Send it.
} );
var qHeader = document.getElementById( "qunit-header" ),
	parsed = QUnit.dump.parse( qHeader );
console.log( parsed );
// Logs: "<h1 id=\"qunit-header\"></h1>"

//QUnit.extend() Copy the properties defined by the mixin object into the target object
QUnit.test( "QUnit.extend", function ( assert ) {
	var base = {
		a : 1,
		b : 2,
		z : 3
	};
	QUnit.extend( base, {
		b : 2.5,
		c : 3,
		z : undefined
	} );
	assert.equal( base.a, 1, "Unspecified values are not modified" );
	assert.equal( base.b, 2.5, "Existing values are updated" );
	assert.equal( base.c, 3, "New values are defined" );
	assert.ok( !( "z" in base ), "Values specified as `undefined` are removed" );
} );


//endregion