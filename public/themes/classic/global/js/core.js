/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    'use strict';

    $.leavePage = null; // 离开页面方法

    $.ctx = ''; // 项目名称

    $.configs = $.configs || {}; // 配置基本信息

    $.extend($.configs, {
        _data: {},
        get: function (name) {
            var data = this._data;

            for (var i = 0; i < arguments.length; i++) {
                name = arguments[i];

                data = data[name];
            }

            return data;
        },
        set: function (name, value) {
            this._data[name] = value;
        },
        extend: function (name, options) {
            var value = this.get(name);
            return $.extend(true, value, options);
        }
    });

    // 获取颜色配置信息
    $.colors = function (name, level) {
        if (!$.configs.colors && typeof $.configs.colors[name] === 'undefined') {
            return null;
        }

        if (level && typeof $.configs.colors[name][level] !== 'undefined') {
            return $.configs.colors[name][level];
        } else {
            return $.configs.colors[name];
        }
    };

    // 调用注册插件的配置参数
    $.po = function (name, options) {
        var defaults = $.components.getDefaults(name);
        return $.extend(true, {}, defaults, options);
    };

    // 本地存储对象操作 localStorage
    $.storage = $.storage || {};

    $.extend($.storage, {
        set: function (key, value, time) { //存入缓存
            var cacheExpireDate, cacheVal;

            if (!localStorage) {
                console.error('该浏览器不支持localStorage对象');
            }

            if (!key || !value) {
                return null;
            }

            // 定时情况
            if (!time || isNaN(time)) {
                cacheExpireDate = null;
            } else {
                cacheExpireDate = (new Date() - 1) + time * 1000 * 60;
            }

            cacheVal = {val: value, exp: cacheExpireDate};

            if (typeof value === "object") {
                cacheVal = JSON.stringify(cacheVal);
            }

            localStorage.setItem(key, cacheVal);
        },
        get: function (key) { // 获取存储内容
            var value, now, exp;

            if (!localStorage) {
                console.error('该浏览器不支持localStorage对象');
            }

            value = localStorage.getItem(key);

            if (!value) {
                return null;
            }

            if (typeof value === 'string') {
                value = JSON.parse(value);
            }

            now = new Date() - 1;
            exp = value.exp;

            if (exp && now > exp) { // 缓存内容已过期
                this.remove(key);
                return null;
            }

            return value.val;
        },
        remove: function (key) { // 删除指定缓存
            if (!localStorage) {
                console.error('该浏览器不支持localStorage对象');
            }

            localStorage.removeItem(key);
        }
    });

    // 本地存储对象操作 sessionStorage
    $.sessionStorage = $.sessionStorage || {};

    $.extend($.sessionStorage, {
        set: function (key, value) { //存入缓存
            if (!sessionStorage) {
                console.error('该浏览器不支持sessionStorage对象');
            }

            if (!key || !value) {
                return null;
            }

            if (typeof value === "object") {
                value = JSON.stringify(value);
            }

            sessionStorage.setItem(key, value);
        },
        get: function (key) { // 获取存储内容
            var value;

            if (!sessionStorage) {
                console.error('该浏览器不支持sessionStorage对象');
            }

            value = sessionStorage.getItem(key);

            if (!value) {
                return null;
            }

            if (typeof value === 'string') {
                value = JSON.parse(value);
            }

            return value;
        },
        remove: function (key) { // 删除指定缓存
            if (!sessionStorage) {
                console.error('该浏览器不支持sessionStorage对象');
            }

            sessionStorage.removeItem(key);
        }
    });

    $.objExtend = $.objExtend || {}; // 公用模块对象

    $.extend($.objExtend, {
        _queue: {
            prepare: [],
            run: [],
            complete: []
        },
        run: function () {
            var self = this;
            this.dequeue('prepare', function () {
                self.trigger('before.run', self);
            });

            this.dequeue('run', function () {
                self.dequeue('complete', function () {
                    self.trigger('after.run', self);
                });
            });
        },
        dequeue: function (name, done) { // 队列当前状态离队，进行下一步操作
            var self = this,
                queue = this.getQueue(name),
                fn = queue.shift(),
                next = function () {
                    self.dequeue(name, done);
                };

            if (fn) {
                fn.call(this, next);
            } else if ($.isFunction(done)) {
                done.call(this);
            }
        },
        getQueue: function (name) { // 获取队列状态信息
            if (!$.isArray(this._queue[name])) {
                this._queue[name] = [];
            }

            return this._queue[name];
        },
        extend: function (obj) { // 公用模块对象扩展方法
            $.each(this._queue, function (name, queue) {
                if ($.isFunction(obj[name])) {
                    queue.unshift(obj[name]);

                    delete obj[name];
                }
            });
            $.extend(this, obj);
            return this;
        },
        trigger: function (name, data, $el) { // 离队状态执行动作

            if (typeof name === 'undefined') {
                return;
            }
            if (typeof $el === 'undefined') {
                $el = $("#admui-pageContent");
            }

            $el.trigger(name + '.app', data);
        }
    });

    $.components = $.components || {}; // 实现插件的提前检测和调用

    $.extend($.components, {
        _components: {},
        register: function (name, obj) {
            this._components[name] = obj;
        },
        init: function (args, name, context) {
            var self = this, obj;
            args = args || true;

            if (typeof name === 'undefined') {
                $.each(this._components, function (name) {
                    self.init(args, name);
                });
            } else {
                context = context || document;

                obj = this.get(name);

                if (!obj) {
                    return;
                }

                switch (obj.mode) {
                    case 'default':
                        return this._initDefault(name, context);
                    case 'init':
                        return this._initComponent(obj, context);
                    case 'api':
                        return this._initApi(obj, context, args);
                    default:
                        this._initApi(obj, context, args);
                        this._initComponent(obj, context);
                        return;
                }
            }
        },
        _initDefault: function (name, context) { // jquery 3rd的基本用法
            if (!$.fn[name]) {
                return;
            }

            var defaults = this.getDefaults(name);

            $('[data-plugin=' + name + ']', context).each(function () {
                var $this = $(this),
                    options = $.extend(true, {}, defaults, $this.data());

                $this[name](options);
            });
        },
        _initComponent: function (obj, context) { // jquery 3rd的高级用法
            if ($.isFunction(obj.init)) {
                obj.init.call(obj, context);
            }
        },
        _initApi: function (obj, context, args) { // 其他处理
            if (args && $.isFunction(obj.api)) {
                obj.api.call(obj, context);
            }
        },
        getDefaults: function (name) {
            var component = this.get(name);

            return component && typeof component.defaults !== "undefined" ? component.defaults : {};
        },
        get: function (name) {
            if (typeof this._components[name] !== "undefined") {
                return this._components[name];
            } else {
                console.error('component:' + name + ' 脚本文件没有注册任何信息！');
                return undefined;
            }
        }
    });

    $.site = $.site || {}; // 网站基础设置

    window.Content = $.extend({}, $.objExtend); // 内容页基础扩展方法

    // 网站消息通知对象
    window.notifyFn = window.notifyFn || {
        render: function () { // 当前通知辅助渲染（图标&日期）
            var self = this;

            template.helper('iconType', function (type) {
                switch (type) {
                    case 'SYSTEM':
                        return 'fa-desktop system';
                    case 'TASK':
                        return 'fa-tasks task';
                    case 'SETTING':
                        return 'fa-cog setting';
                    case 'EVENT':
                        return 'fa-calendar event';
                    default:
                        return 'fa-comment-o other';
                }
            });

            template.helper('timeMsg', function (date) {
                var msgTime, arr,
                    currentTime = new Date();

                // ios new Data兼容
                arr = date.split(/[- : \/]/);
                msgTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);

                return self.timeDistance(msgTime, currentTime);

            });
        },
        timeDistance: function (reference, current) { // 间隔时间
            var time;

            time = current.getTime() - reference.getTime();

            for (var i = 0; i < 6; i++) {
                switch (i) {
                    case 0:
                        time = time / 1000;
                        if (time >= 1 && time < 60) {
                            return time.toFixed(0) + '秒前';
                        } else if (time < 1) {
                            return '刚刚';
                        }
                        break;
                    case 1:
                        time = time / 60;
                        if (time >= 0 && time < 60) {
                            return time.toFixed(0) + '分钟前';
                        }
                        break;
                    case 2:
                        time = time / 60;
                        if (time >= 0 && time < 60) {
                            return time.toFixed(0) + '小时前';
                        }
                        break;
                    case 3:
                        time = time / 24;
                        if (time >= 0 && time < 60) {
                            return time.toFixed(0) + '天前';
                        }
                        break;
                    case 4:
                        time = time / 30;
                        if (time >= 0 && time < 60) {
                            return time.toFixed(0) + '月前';
                        }
                        break;
                    case 5:
                        time = time / 365;
                        if (time >= 0 && time < 60) {
                            return time.toFixed(0) + '年前';
                        }
                        break;
                }
            }
        }
    };

})(window, document, jQuery);
