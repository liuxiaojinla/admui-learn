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
                "ajax": {
                    "url": $.ctx + "/data/examples/tables/dt-ajax-6.json",
                    "dataSrc": ""
                },
                "columns": [
                    {"data": "name"},
                    {"data": "position"},
                    {"data": "office"},
                    {"data": "extn"},
                    {"data": "start_date"},
                    {"data": "salary"}
                ]
            }));

            next();
        }
    });
})(window, document, jQuery);

