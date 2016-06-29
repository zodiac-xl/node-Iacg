var oldAjax = new Object($.ajax);

var customAjax = function (options) {

    var defer = $.Deferred();

    options = $.extend({
        url: "",
        type: 'GET',
        dataType: "json",
        des: '未知接口',//接口描述
        showSuccess: false//是否toastr 提示成功信息
    }, options);

    oldAjax(options).done(function (e) {
        var successDes = options.des + "成功";

        e.des = successDes;
        defer.resolve(e);
        if (options.showSuccess) {
            toastr.success(e.des);
        }
        console.info(successDes);
    }).fail(function (e) {
        var failDes = options.des + "失败" + (e.message ? "：" + e.message : "");

        e.des = failDes;
        defer.reject(e);
        toastr.error(failDes);
        console.error(options.des + "失败：" + (e.message || e.status || "no message or status code"));
    });

    return defer.promise();
};

$.ajax = function (args) {
    return customAjax.apply(this, args);
}
