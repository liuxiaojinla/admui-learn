/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (docuemnt, window, $) {
    'use strict';

    /* globals Breakpoints, screenfull*/

    $.extend($.site, {
        theme: function () { // 主题渲染
            var $body = $('body'),
                settingsName = 'admui.base.skinTools',
                $link = $('#admui-siteStyle', $('head')),
                settings = localStorage.getItem(settingsName),
                etx = $link.prop('href').indexOf('?v=') === -1 ? '' : '.min', themeColor, sidebar, navbar,
                menuDisplay, menuTxtIcon;

            if (!settings) {
                return;
            }

            settings = JSON.parse(settings).val;
            themeColor = this.themeColor = settings.themeColor;
            sidebar = settings.sidebar;
            navbar = settings.navbar;
            menuDisplay = settings.menuDisplay;
            menuTxtIcon = settings.menuTxtIcon;

            // 在前端渲染主题不是最优雅体验最好的，建议通过后端渲染
            if (themeColor && themeColor !== 'primary') {
                $link.attr('href', '/themes/classic/base/skins/' + themeColor + etx + '.css');
            }

            if (sidebar && sidebar === 'site-menubar-light') {
                $('#admui-siteMenubar').addClass('site-menubar-light');
            }

            if (navbar && navbar !== '') {
                $('.site-navbar').addClass(navbar);
            }

            if (settings.navbarInverse === '') {
                $('.site-navbar').removeClass('navbar-inverse');
            }

            if (menuDisplay && menuDisplay === 'site-menubar-fold') {
                $.site.menubar.fold();

                if (menuTxtIcon && menuTxtIcon === 'site-menubar-keep') {
                    $body.addClass('site-menubar-keep');
                } else {
                    $body.addClass('site-menubar-fold-alt');
                }
            }

            if (settings.tabFlag === '') {
                $body.removeClass('site-contabs-open');
            }

        },
        _tabsDraw: function () { // 标签页重绘
            var settingsName = 'admui.base.contentTabs',
                settings = $.sessionStorage.get(settingsName),
                tab, checkedTabId, checkedTabUrl, tabTpl, tabUrl, tabName,
                locationUrl = location.pathname,
                $conTabs = $('.con-tabs'),
                contentTabs = $.site.contentTabs,
                _result = locationUrl === '/',
                callback = function (key, tabId, url) {

                    if (key === tabId || _result) {
                        checkedTabUrl = url;
                        return;
                    }

                    $conTabs.find('li:first').removeClass('active');
                };

            checkedTabId = settings.checked;

            for (var key in settings) {
                tab = settings[key];

                if (key === 'checked' || key === 'tabId') {
                    continue;
                } else if (key === 'tab-0') {
                    callback(key, checkedTabId, tab.url);
                    continue;
                }

                tabUrl = tab.url;
                tabName = tab.name;
                tabTpl = '<a href="' + tabUrl + '" ' + 'target="' + key + '"' +
                    '" title="' + tabName + '' + '" rel="contents"><span>' + tabName + '</span><i class="icon' +
                    ' wb-close-mini">' + '</i></a></li>';

                if (key === checkedTabId && !_result) {
                    checkedTabUrl = tabUrl;
                    tabTpl = '<li class="active">' + tabTpl;
                } else {
                    tabTpl = '<li>' + tabTpl;
                }

                $conTabs.append(tabTpl);
            }

            if (!_result && locationUrl !== checkedTabUrl) {
                this._urlRequest(locationUrl);
            }

            contentTabs.enable($conTabs.find('.active'));

            if (Object.keys(settings).length >= 19) {
                contentTabs.tabSize();
                contentTabs.tabEvent($conTabs, 'media');
            }
        },
        _urlRequest: function (url) { // 处理存储信息中没有的页面访问（创建新的标签页）
            var title = '未知页面';

            $('.site-menu a').each(function () {
                var $item = $(this);

                if ($item.attr('href') === url) {
                    title = $.trim($item.attr('title') || $item.text());

                    return false;
                }
            });

            $.site.contentTabs.buildTab({name: title, url: url});
        },
        pjaxFun: function () {
            var $body = $('body');

            $(document).pjax('a[data-pjax]', {replace: true});

            $(document).on('submit', 'form[data-pjax]', function (event) {
                var container = $(this).attr("data-pjax");
                $.pjax.submit(event, container, {replace: true});
            });

            $(document).on('pjax:start', function () {
                window.onresize = null;
                window.App = null;
                window.Content = $.extend({}, $.objExtend);

                $("#admui-pageContent").off();
                $(window).off('resize');
                $('#admui-navMenu').responsiveHorizontalTabs({ // 导航条响应式
                    tabParentSelector: '#admui-navTabs',
                    fnCallback: function (el) {
                        if ($('#admui-navMenu').is(':visible')) {
                            el.removeClass('is-load');
                        }
                    }
                });
                $(window).on('resize', $.site.contentTabs.resize);

                $('head').find('script[pjax-script]').remove();
                $body.addClass("site-page-loading");
                $body.find('script:last').nextAll().remove();
                $body.find('nav:first').prevAll(':not(script)').remove();
                $(document).off('click.site.bootbox', '[data-plugin="bootbox"]');
                $(document).off('click.site.alertify', '[data-plugin="alertify"]');

                //清除body标签上新添加的内联样式
                $('body').removeAttr('style');
                $('html').removeAttr('style');

                if ($.isFunction($.leavePage)) {
                    $.leavePage();
                    $.leavePage = null;
                }

            });

            $(document).on('pjax:callback', function () {
                $.components.init();
                if (window.Content !== null) {
                    window.Content.run();
                }

                $body.removeClass("site-page-loading");

            });

            $(document).on('pjax:success', function () {
                // 清除控制台console信息
                // console.clear();

                // 给标签也换title
                var $labelNav = $(".con-tabs"),
                    title = $.trim($('title').text()),
                    labelTitle = $.trim($labelNav.find('li.active').text());

                if (title !== labelTitle) {
                    $labelNav.find("li.active span").text(title);
                }

            });
        },
        run: function () {

            $.ctx = $('#admui-signOut').data('ctx') || $.ctx;

            function hideNavbar() {
                var $body = $('body');

                $body.addClass('site-navbar-collapsing');
                $('#admui-navbarCollapse').collapse('hide');

                setTimeout(function () {
                    $body.removeClass('site-navbar-collapsing');
                }, 10);

                $body.removeClass('site-navbar-collapse-show');
            }

            if (typeof $.site.menu !== 'undefined') {
                $.site.menu.init();
            }

            if (typeof $.site.contentTabs !== 'undefined') {
                $.site.contentTabs.init();
            }

            // 导航条响应式
            $('#admui-navbar').responsiveHorizontalTabs({
                tabParentSelector: '#admui-navTabs',
                fnCallback: function (el) {
                    if ($('#admui-navbar').is(':visible')) {
                        el.removeClass('is-load');
                    }
                }
            });

            // 导航条&菜单的响应式工作
            if (typeof $.site.menubar !== 'undefined') {
                $('#admui-siteMenubar').on('changing.site.menubar', function () {
                    var $menubar = $('[data-toggle="menubar"]');

                    $menubar.toggleClass('hided', !$.site.menubar.opened);
                    $menubar.toggleClass('unfolded', !$.site.menubar.folded);
                });

                $.site.menubar.init();

                Breakpoints.on('change', function () {
                    $.site.menubar.change();
                });

                /*
                 *  小屏幕下导航条展开 | 收起按钮
                 *  搜索按钮（href）
                 * */
                $(document).on('click', '[data-toggle="collapse"]', function (e) {
                    var $trigger = $(e.target),
                        href, target, $target;

                    if (!$trigger.is('[data-toggle="collapse"]')) {
                        $trigger = $trigger.parents('[data-toggle="collapse"]');
                    }

                    target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
                    $target = $(target);

                    if ($target.hasClass('navbar-search-overlap')) {
                        $target.find('input').focus();

                        e.preventDefault();
                    } else if ($target.attr('id') === 'admui-navbarCollapse') {
                        var isOpen = !$trigger.hasClass('collapsed'),
                            $body = $(document.body);

                        $body.addClass('site-navbar-collapsing');
                        $body.toggleClass('site-navbar-collapse-show', isOpen);

                        $('#admui-navbar').responsiveHorizontalTabs({
                            tabParentSelector: '#admui-navTabs',
                            fnCallback: function (el) {
                                el.removeClass('is-load');
                            }
                        });

                        setTimeout(function () {
                            $body.removeClass('site-navbar-collapsing');
                        }, 350);
                    }
                });

                $(document).on('click', '[data-toggle="menubar"]', function () { // 菜单展开|收起控制按钮
                    if (Breakpoints.is('xs') && $('body').hasClass('site-menubar-open')) {
                        hideNavbar();
                    }

                    $.site.menubar.toggle();
                });

                // 点击内容页面，菜单收起&导航条收起
                $('.site-page').on('click', '#admui-pageContent', function () {
                    if (Breakpoints.is('xs') && $('body').hasClass('site-menubar-open')) {
                        $.site.menubar.hide();

                        hideNavbar();
                    }
                });

                // 图标对应菜单展开
                $('#admui-navbar >.nav-tabs >li:not(.no-menu)').on('click', function (e) {
                    if ($(e.target).closest('li').is('.dropdown')) {
                        return;
                    }

                    if (Breakpoints.is('xs')) {
                        $.site.menubar.open();
                    }
                });
            }

            // 全屏模式操作
            if (typeof screenfull !== 'undefined') {
                $(document).on('click', '[data-toggle="fullscreen"]', function () {
                    if (screenfull.enabled) {
                        screenfull.toggle();
                    }

                    return false;
                });

                if (screenfull.enabled) {
                    document.addEventListener(screenfull.raw.fullscreenchange, function () {
                        $('[data-toggle="fullscreen"]').toggleClass('active', screenfull.isFullscreen);
                    });
                }
            }

            // 对下拉列表的其他功能
            $(document).on('show.bs.dropdown', function (e) {
                var $target = $(e.target), $menu,
                    $trigger = e.relatedTarget ? $(e.relatedTarget) : $target.children('[data-toggle="dropdown"]'),
                    animation = $trigger.data('animation');

                if (animation) {
                    $menu = $target.children('.dropdown-menu');

                    $menu.addClass('animation-' + animation);

                    $menu.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        $menu.removeClass('animation-' + animation);
                    });
                }
            });

            $.components.init();
            window.Content.run();

            if (window.localStorage) {
                this.theme();
                this._tabsDraw();
            }

            this.pjaxFun();
        }
    });

    $.site.run();

})(document, window, jQuery);