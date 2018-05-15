/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window) {
    'use strict';

    window.Content = {
        run: function(){
            var defereds = []; // 定义一个数组存放Deferred对象

            $('img, video, audio').each(function () { // imgs循环所有图片
                var dfd = $.Deferred(); // 新建一个deferred对象

                // 图片加载完成之后，改变deferred对象的执行状态
                $(this).load(function () {
                    dfd.resolve();
                });

                defereds.push(dfd); // push到数组中
            });

            $.when(defereds).done(function () {
                $('#masonry').each(function () {
                    var $this = $(this),
                        options = $.extend(true, {}, $.po('masonry'), $this.data());

                    $this.masonry(options);
                });
            });
        }
    };
})(document, window);
