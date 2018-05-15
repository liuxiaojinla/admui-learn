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
                "ajax": $.ctx + "/data/examples/tables/dt-ajax-5.json",
                // 默认为data，这里定义为demo
                "dataSrc": "demo"
            }));

            next();
        }
    });
})(window, document, jQuery);

