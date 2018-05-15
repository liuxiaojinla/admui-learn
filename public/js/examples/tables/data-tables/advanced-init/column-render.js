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
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            return data + ' (' + row[3] + ')';
                        },
                        "targets": 0
                    },
                    {
                        "visible": false,
                        "targets": [3]
                    }
                ]
            }));

            next();
        }
    });
})(window, document, jQuery);

