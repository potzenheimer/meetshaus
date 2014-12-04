'use strict';
(function ($) {
    $(document).ready(function () {
        if ($('body').hasClass('lt-ie7')) {return; }
        // Application specific javascript code goes here
        // $('#app-toolbar').headroom();
        // cache container
        var $container = $('#link-container');
        // initialize isotope
        $container.isotope({
          // options...
        });
        // filter items when filter link is clicked
        $('#filters a').click(function () {
            var selector = $(this).attr('data-filter');
            $container.isotope({ filter: selector });
            return false;
        });
    }
    );
}(jQuery));