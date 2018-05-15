/**
 * Admui v1.3.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function(window, document, $){
    "use strict";

    $.components.register("datepair", {
        mode: "default",
        defaults: {
            startClass: 'datepair-start',
            endClass: 'datepair-end',
            timeClass: 'datepair-time',
            dateClass: 'datepair-date'
        }
    });
})(window, document, jQuery);