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
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                })
                .on('click', '#DTDelRow', function () {
                    table.row('.selected').remove().draw(false);
                });

            next();
        }
    });
})(window, document, jQuery);

