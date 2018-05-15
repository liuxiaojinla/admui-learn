/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    /* global moment */

    window.Content = {
        timeButton: function () { // 重置时间
            $('#exampleTimeButton').on('click', function () {
                $('#inputTextCurrent').timepicker('setTime', new Date());
            });
        },
        inlineDatepicker: function () { // 内嵌日期选择器
            var $inlineDatepicker = $('#inlineDatepicker');
            $inlineDatepicker.datepicker($.po('datepicker', {
                language: 'zh-CN'
            }));
            $inlineDatepicker.on("changeDate", function () {
                $("#inputHiddenInline").val(
                    $("#inlineDatepicker").datepicker('getFormattedDate')
                );
            });
        },
        inputTokenfieldTypeahead: function () { // Tokenfield 和 Typeahead 结合使用
            var engine = new Bloodhound({
                local: [{
                    value: 'red-红色'
                }, {
                    value: 'blue-蓝色'
                }, {
                    value: 'green-绿色'
                }, {
                    value: 'yellow-黄色'
                }, {
                    value: 'violet-紫罗兰'
                }, {
                    value: 'brown-棕色'
                }, {
                    value: 'purple-紫色'
                }, {
                    value: 'black-黑色'
                }, {
                    value: 'white-白色'
                }],
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace
            });

            // engine.initialize();

            $('#inputTokenfieldTypeahead').tokenfield({
                typeahead: [null, {
                    name: 'engine',
                    displayKey: 'value',
                    source: engine.ttAdapter()
                }]
            });
        },
        inputTokenfieldEvents: function () {  // Tokenfield 事件
            $('#inputTokenfieldEvents')
                .on('tokenfield:createtoken', function (e) {
                    var data = e.attrs.value.split('|');
                    e.attrs.value = data[1] || data[0];
                    e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0];
                })
                .on('tokenfield:createdtoken', function (e) {
                    // 邮件验证
                    var re = /\S+@\S+\.\S+/;
                    var valid = re.test(e.attrs.value);
                    if (!valid) {
                        $(e.relatedTarget).addClass('invalid');
                    }
                })
                .on('tokenfield:edittoken', function (e) {
                    if (e.attrs.label !== e.attrs.value) {
                        var label = e.attrs.label.split(' (');
                        e.attrs.value = label[0] + '|' + e.attrs.value;
                    }
                })
                .on('tokenfield:removedtoken', function (e) {
                    if (e.attrs.length > 1) {
                        var values = $.map(e.attrs, function (attrs) {
                            return attrs.value;
                        });
                        toastr.info(e.attrs.length + '已删除：' + values.join(', '));
                    } else {
                        toastr.info('已删除：' + e.attrs.value);
                    }
                })
                .tokenfield();
        },
        tagsObj: function () { // 标签使用对象
            var cities = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: $.ctx + '/data/examples/forms/cities.json'
            });
            cities.initialize();

            var $input = $('#inputTagsObject');
            $input.tagsinput($.po('tagsinput', {
                itemValue: 'value',
                itemText: 'text',
                typeaheadjs: [{
                    hint: true,
                    highlight: true,
                    minLength: 1
                }, {
                    name: 'cities',
                    displayKey: 'text',
                    source: cities.ttAdapter()
                }]
            }));

            $input.tagsinput('add', {
                "value": 1,
                "text": "北京",
                "continent": "北京"
            });
            $input.tagsinput('add', {
                "value": 2,
                "text": "广州",
                "continent": "广东"
            });
            $input.tagsinput('add', {
                "value": 3,
                "text": "韶关",
                "continent": "广东"
            });
            $input.tagsinput('add', {
                "value": 4,
                "text": "深圳",
                "continent": "广东"
            });
            $input.tagsinput('add', {
                "value": 5,
                "text": "珠海",
                "continent": "广东"
            });
        },
        tagsSort: function () { //标签分类
            var cities = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: $.ctx + '/data/examples/forms/cities.json'
            });
            cities.initialize();

            var $input = $('#inputTagsCategorizing');

            $input.tagsinput($.po('tagsinput', {
                tagClass: function (item) {
                    switch (item.continent) {
                        case '北京':
                            return 'label label-primary';
                        case '广东':
                            return 'label label-danger';
                        case '浙江':
                            return 'label label-success';
                        case '新疆':
                            return 'label label-default';
                        case '江苏':
                            return 'label label-warning';
                    }
                },
                itemValue: 'value',
                itemText: 'text',
                typeaheadjs: [{
                    hint: true,
                    highlight: true,
                    minLength: 1
                }, {
                    name: 'cities',
                    displayKey: 'text',
                    source: cities.ttAdapter()
                }]
            }));

            $input.tagsinput('add', {
                "value": 1,
                "text": "北京",
                "continent": "北京"
            });
            $input.tagsinput('add', {
                "value": 2,
                "text": "广州",
                "continent": "广东"
            });
            $input.tagsinput('add', {
                "value": 3,
                "text": "韶关",
                "continent": "广东"
            });
            $input.tagsinput('add', {
                "value": 4,
                "text": "深圳",
                "continent": "广东"
            });
            $input.tagsinput('add', {
                "value": 5,
                "text": "珠海",
                "continent": "广东"
            });

        },
        multiSelect: function () { // Multi-Select
            $('.multi-select-methods').multiSelect();

            $('#buttonSelectAll').click(function () {
                $('.multi-select-methods').multiSelect('select_all');
                return false;
            });

            $('#buttonDeselectAll').click(function () {
                $('.multi-select-methods').multiSelect('deselect_all');
                return false;
            });

            $('#buttonSelectSome').click(function () {
                $('.multi-select-methods').multiSelect('select', ['BMW', 'Audi', 'Benz']);
                return false;
            });

            $('#buttonDeselectSome').click(function () {
                $('.multi-select-methods').multiSelect('select', ['BMW', 'Audi', 'Benz']);
                return false;
            });

            $('#buttonRefresh').on('click', function () {
                $('.multi-select-methods').multiSelect('refresh');
                return false;
            });

            $('#buttonAdd').on('click', function () {
                $('.multi-select-methods').multiSelect('addOption', {
                    value: 42,
                    text: '测试项 42',
                    index: 0
                });
                return false;
            });
        },
        typeahead: function () { // Typeahead
            var states = ["Andorra , 安道尔", "Afghanistan , 阿富汗", "Antigua and Barbuda , 安提瓜和巴布达", "Anguilla , 安格拉", "Albania , 阿尔巴尼亚", "Armenia , 亚美尼亚", "Netherlands Antilles , 荷兰属地", "Angola , 安哥拉", "Antarctica , 南极洲", "Argentina , 阿根廷", "American Samoa , 东萨摩亚", "Austria , 奥地利", "Australia , 澳大利亚", "Aruba , 阿鲁巴", "Azerbaijan , 阿塞拜疆", "Bosnia Hercegovina , 波黑", "Barbados , 巴巴多斯", "Bangladesh , 孟加拉国", "Belgium , 比利时", "Burkina Faso , 布基纳法索", "Bulgaria , 保加利亚", "Bahrain , 巴林", "Burundi , 布隆迪", "Benin , 贝宁", "Bermuda , 百慕大 ", "China, 中国"];

            // 基本 & 样式
            var substringMatcher = function (strs) {
                return function findMatches(q, cb) {
                    var matches, substrRegex;

                    matches = [];

                    substrRegex = new RegExp(q, 'i');

                    $.each(strs, function (i, str) {
                        if (substrRegex.test(str)) {
                            matches.push(str);
                        }
                    });

                    cb(matches);
                };
            };

            $('#exampleTypeaheadBasic, #exampleTypeaheadStyle').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                name: 'states',
                source: substringMatcher(states)
            });

            // bloodhound
            var state = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: states
            });

            $('#exampleTypeaheadBloodhound').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                name: 'states',
                source: state
            });

            // typeahead 异步加载
            // ----------------
            var countries = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: $.ctx + '/data/examples/forms/countries.json'
            });

            $('#exampleTypeaheadPrefetch').typeahead(null, {
                name: 'countries',
                source: countries
            });
        },
        colorpickerEvent: function () {
            $('#colorpickerEvent').colorpicker().on('changeColor', function (e) {
                toastr.info('颜色值已改变');
                e.stopPropagation();
            });
        },
        dateRangePicker: function () {
            var $drpConfigText = $('#drpConfigText'),
                updateConfig = function () {
                    var options = {},
                        timePickerIncrement = $('#timePickerIncrement').val(),
                        cancelClass = $('#cancelClass').val(),
                        opens = $('#opens').val(),
                        drops = $('#drops').val(),
                        buttonClasses = $('#buttonClasses').val(),
                        applyClass = $('#applyClass').val();

                    if ($('#singleDatePicker').is(':checked')) {
                        options.singleDatePicker = true;
                    }

                    if ($('#showDropdowns').is(':checked')) {
                        options.showDropdowns = true;
                    }

                    if ($('#showWeekNumbers').is(':checked')) {
                        options.showWeekNumbers = true;
                    }

                    if ($('#showISOWeekNumbers').is(':checked')) {
                        options.showISOWeekNumbers = true;
                    }

                    if ($('#timePicker').is(':checked')) {
                        options.timePicker = true;
                    }

                    if ($('#timePicker24Hour').is(':checked')) {
                        options.timePicker24Hour = true;
                    }

                    if (timePickerIncrement.length && timePickerIncrement !== 1) {
                        options.timePickerIncrement = parseInt(timePickerIncrement, 10);
                    }

                    if ($('#timePickerSeconds').is(':checked')) {
                        options.timePickerSeconds = true;
                    }

                    if ($('#autoApply').is(':checked')) {
                        options.autoApply = true;
                    }

                    if ($('#dateLimit').is(':checked')) {
                        options.dateLimit = {days: 7};
                    }

                    if ($('#ranges').is(':checked')) {
                        options.ranges = {
                            'Today': [moment(), moment()],
                            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        };
                    }

                    if ($('#locale').is(':checked')) {
                        options.locale = {
                            format: 'MM/DD/YYYY',
                            separator: ' - ',
                            applyLabel: 'Apply',
                            cancelLabel: 'Cancel',
                            fromLabel: 'From',
                            toLabel: 'To',
                            customRangeLabel: 'Custom',
                            weekLabel: 'W',
                            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            firstDay: 1
                        };
                    }

                    if (!$('#linkedCalendars').is(':checked')) {
                        options.linkedCalendars = false;
                    }

                    if (!$('#autoUpdateInput').is(':checked')) {
                        options.autoUpdateInput = false;
                    }

                    if (!$('#showCustomRangeLabel').is(':checked')) {
                        options.showCustomRangeLabel = false;
                    }

                    if ($('#alwaysShowCalendars').is(':checked')) {
                        options.alwaysShowCalendars = true;
                    }

                    if ($('#parentEl').val().length) {

                    }
                    options.parentEl = $('#parentEl').val();

                    if ($('#startDate').val().length) {

                    }
                    options.startDate = $('#startDate').val();

                    if ($('#endDate').val().length) {

                    }
                    options.endDate = $('#endDate').val();

                    if ($('#minDate').val().length) {

                    }
                    options.minDate = $('#minDate').val();

                    if ($('#maxDate').val().length) {

                    }
                    options.maxDate = $('#maxDate').val();

                    if (opens.length && opens !== 'right') {
                        options.opens = opens;
                    }

                    if (drops.length && drops !== 'down') {
                        options.drops = drops;
                    }

                    if (buttonClasses.length && buttonClasses !== 'btn btn-sm') {
                        options.buttonClasses = buttonClasses;
                    }

                    if (applyClass.length && applyClass !== 'btn-success') {
                        options.applyClass = applyClass;
                    }

                    if (cancelClass.length && cancelClass !== 'btn-default') {
                        options.cancelClass = cancelClass;
                    }

                    $drpConfigText.val("$('#demo').daterangepicker(" + JSON.stringify(options, null, '    ') + ", function(start, end, label) {\n  console.log(\"New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')\");\n});");

                    $('#drpConfigDemo').daterangepicker($.po('daterangepicker', options), function (start, end, label) {
                        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
                    });
                };

            $drpConfigText.keyup(function () {
                eval($(this).val());
            });

            $('#rangePickerConfig').find('input:not("#drpConfigDemo, #drpConfigText"),select').change(function () {
                updateConfig();
            });

            $('#startDate').daterangepicker($.po('daterangepicker', {
                singleDatePicker: true,
                startDate: moment().subtract(6, 'days')
            }));

            $('#endDate').daterangepicker($.po('daterangepicker', {
                singleDatePicker: true,
                startDate: moment()
            }));

            updateConfig();
        },
        iconFun: function () {
            var options = {
                fullClassFormatter: function (value) {
                    return "icon " + value;
                },
                templates: {
                    popover: '<div class="iconpicker-popover popover"><div class="arrow"></div>' + '<div class="popover-title"></div><div class="popover-content"></div></div>',
                    footer: '<div class="popover-footer"></div>',
                    buttons: '<button class="iconpicker-btn iconpicker-btn-cancel btn btn-default btn-sm">取消</button>' + ' <button class="iconpicker-btn iconpicker-btn-accept btn btn-primary btn-sm">确认</button>',
                    search: '<input type="search" class="form-control iconpicker-search" placeholder="查找图标">',
                    iconpicker: '<div class="iconpicker"><div class="iconpicker-items"></div></div>',
                    iconpickerItem: '<a role="button" href="#" class="iconpicker-item"><i></i></a>'
                }
            };

            $('#definedIcon1').iconpicker($.extend({
                title: '自定义配置',
                icons: ['fa-github', 'fa-heart', 'fa-html5', 'fa-css3'],
                selectedCustomClass: 'label label-success',
                mustAccept: true,
                placement: 'bottomRight',
                showFooter: true
            }, options));

            $('#definedIcon2').iconpicker($.extend({
                title: '使用 glypghicons',
                icons: $.merge([
                        'glyphicon-home',
                        'glyphicon-repeat',
                        'glyphicon-search',
                        'glyphicon-arrow-left',
                        'glyphicon-arrow-right',
                        'glyphicon-star'],
                    $.iconpicker.defaultOptions.icons),
                fullClassFormatter: function (val) {
                    if (val.match(/^fa-/)) {
                        return 'fa ' + val;
                    } else {
                        return 'glyphicon ' + val;
                    }
                }
            }, options));
        },
        run: function () {
            this.inlineDatepicker();
            this.inputTokenfieldEvents();
            this.inputTokenfieldTypeahead();
            this.multiSelect();
            this.tagsObj();
            this.tagsSort();
            this.timeButton();
            this.typeahead();
            this.colorpickerEvent();
            this.dateRangePicker();
            this.iconFun();
        }
    };

})(document, window, jQuery);
