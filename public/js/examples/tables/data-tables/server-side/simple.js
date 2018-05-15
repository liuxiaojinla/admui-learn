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
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "http://demo.admui.com/employee/all",
                    "dataType": "jsonp"
                }
            }));

            next();
        }
    });
})(window, document, jQuery);

