/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    window.Content = App.extend({
        run: function(next){
            $('#dataTableExample').DataTable($.po('dataTable', {
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
            }));

            next();
        }
    });
})(window, document, jQuery);

