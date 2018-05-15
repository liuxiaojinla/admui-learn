/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    window.Content = App.extend({
        run: function(next){
            $('#dataTableExample').dataTable($.po('dataTable', {
                "initComplete": function () {
                    var api = this.api();
                    api.$('td').click(function () {
                        api.search(this.innerHTML).draw();
                    });
                }
            }));

            next();
        }
    });
})(window, document, jQuery);

