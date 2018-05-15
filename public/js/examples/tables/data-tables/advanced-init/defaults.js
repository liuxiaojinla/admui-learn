/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    window.Content = App.extend({
        run: function(next){
            $.extend(true, $.fn.dataTable.defaults, $.po('dataTable'), {
                "searching": false,
                "ordering": false
            });

            $('#dataTableExample').DataTable();

            next();
        }
    });
})(window, document, jQuery);

