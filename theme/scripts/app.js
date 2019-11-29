requirejs(['require',
        '/scripts/svg4everybody.js',
        '/scripts/flickity.pkgd.js',
        '/scripts/navbar.js',
        '/scripts/collapsible.js',
        '/scripts/accordion.js',
        '/scripts/slider.js',
        '/scripts/paneleditor.js',
        '/scripts/x-ray.js',
        '/scripts/fontfaceobserver.js',
        '/scripts/respimage.js',
        '/scripts/ls.parent-fit.js',
        '/scripts/lazysizes-umd.js'
    ],
    function(require, svg4everybody, Flickity, navbar, collapsible, accordion, slider, panelEditor) {
        'use strict';

        // Trigger font face observer protection
        var fontPrimary = new FontFaceObserver('Lora', {
            weight: 400
        });
        var fontSecondary = new FontFaceObserver('Montserrat');

        fontPrimary.load(null, 3000).then(function () {
            document.documentElement.className += " font__primary--loaded";
        });

        fontSecondary.load(null, 3000).then(function () {
            document.documentElement.className += " font__secondary--loaded";
        });

        Promise.all([fontPrimary.load(null, 3000),
            fontSecondary.load(null, 3000)
        ])
            .then(function () {
                document.documentElement.className += " fonts--loaded";
            });

        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            document.documentElement.className += " u-device--ios";
        };

        // SVG Sprite polyfill
        svg4everybody();

        // Nav Bar
        navbar.init({
            backdropDisplay: true
        });

        // Collapsible element
        collapsible.init();

        // Collapsible element
        accordion.init();

        // Panel page and widget editor
        panelEditor.init();

        slider.init({
            autoPlay: 6000
        });

        // Load Slider Resize
        window.addEventListener('load', function() {
            var sliders = Array.prototype.slice.call(document.querySelectorAll('.js-slider-resize'));
            if (sliders) {
                sliders.forEach(function(slider) {
                    var flkty = Flickity.data(slider);
                    flkty.resize()
                });
            }
        });



    });
