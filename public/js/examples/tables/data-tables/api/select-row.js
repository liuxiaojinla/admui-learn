/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    window.Content = App.extend({
        run: function (next) {
            var table = $('#dataTableExample').DataTable($.po('dataTable')),
                $pageContent = $('#admui-pageContent');

            $pageContent
                .on('click', '#dataTableExample tbody tr', function () {
                    $(this).toggleClass('selected');
                })
                .on('click', '#DTSelectRow', function () {
                    toastr.info('选中了 ' + table.rows('.selected').data().length + ' 行数据');
                });

            next();
        }
    });
})(window, document, jQuery);

