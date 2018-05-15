/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    window.Content = App.extend({
        run: function(next){
            var lastIdx = null;
            var table = $('#dataTableExample').DataTable($.po('dataTable'));

            $('#admui-pageContent')
                .on('mouseover', '#dataTableExample tbody td', function () {
                    var colIdx = table.cell(this).index().column;
                    if (colIdx !== lastIdx) {
                        $(table.cells().nodes()).removeClass('highlight');
                        $(table.column(colIdx).nodes()).addClass('highlight');
                    }
                })
                .on('mouseleave', '#dataTableExample tbody', function () {
                    $(table.cells().nodes()).removeClass('highlight');
                });

            next();
        }
    });
})(window, document, jQuery);

