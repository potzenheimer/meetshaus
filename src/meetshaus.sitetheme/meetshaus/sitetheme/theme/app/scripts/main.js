requirejs(['require',
        '/scripts/fontfaceobserver.js',
        '/scripts/respimage.js',
        '/scripts/hideShowPassword.js',
        '/scripts/jvfloat.js',
        '/scripts/ls.parent-fit.js',
        '/scripts/lazysizes-umd.js',
        '/scripts/a25.js',
        '/scripts/a25.helpers.js'
    ],
    function(require) {
        'use strict';
        if (typeof a25 == 'undefined') {
            var a25 = {};
        }

        // Trigger font face observer protection
        var fontPrimary = new FontFaceObserver('Noto Sans', {
            weight: 400
        });
        var fontSecondary = new FontFaceObserver('AurulentSansRegular');
        var fontSecondaryBold = new FontFaceObserver('AurulentSansBold');
        var fontSecondaryItalic = new FontFaceObserver('AurulentSansItalic');

        fontPrimary.load(null, 3000).then(function () {
            document.documentElement.className += " font__primary--loaded";
        });

        fontSecondary.load().then(function () {
            document.documentElement.className += " font__secondary--loaded";
        });

        fontSecondaryBold.load().then(function () {
            document.documentElement.className += " font__secondary-bold--loaded";
        });

        fontSecondaryItalic.load().then(function () {
            document.documentElement.className += " font__secondary-italic--loaded";
        });

        Promise.all([
            fontPrimary.load(null, 3000),
            fontSecondary.load(null, 3000),
            fontSecondaryBold.load(null, 3000),
            fontSecondaryItalic.load(null, 3000)
            ]
        ).then(function () {
            document.documentElement.className += " fonts--loaded";
        });
    });
