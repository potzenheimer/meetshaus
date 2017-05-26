'use strict';
(function ($) {
    $(document).ready(function () {
            var font = new FontFaceObserver('Noto Sans');
            font.load().then(function () {
                document.documentElement.className += " app-fonts--loaded";
            });
            var $bannerBar = document.querySelectorAll('.app-js-carousel'),
                $galleryContainer = document.querySelectorAll('.js-gallery');
            // Show banner bar
            if ($bannerBar.length) {
                var bannerflkty = new Flickity('.app-js-carousel', {
                    autoPlay: 7000,
                    contain: true,
                    wrapAround: true,
                    imagesLoaded: true,
                    cellSelector: '.app-banner-item',
                    cellAlign: 'left',
                    selectedAttraction: 0.025,
                    friction: 0.28
                });
            }
            // Content image galleries
            if ($galleryContainer.length) {
                var flkty = new Flickity('.js-gallery', {
                    autoPlay: true,
                    contain: true,
                    wrapAround: true,
                    imagesLoaded: true,
                    cellSelector: '.app-gallery-cell',
                    cellAlign: 'left'
                });
            }

            // Anonymous only scripts (mainly used in login views)
            if ($(".userrole-anonymous")[0]){
                $('input[type="password"]').showPassword('focus', {
                });
                $('.app-signin-input').jvFloat();
                var $mcNote = $('#app-signin-suggestion');
                Mailcheck.defaultDomains.push('eda.kreativkombinat.de')
                $('#ac-name').on('blur', function (event) {
                    console.log("event ", event);
                    console.log("this ", $(this));
                    $(this).mailcheck({
                        // domains: domains,                       // optional
                        // topLevelDomains: topLevelDomains,       // optional
                        suggested: function (element, suggestion) {
                            // callback code
                            console.log("suggestion ", suggestion.full);
                            $mcNote.removeClass('hidden').addClass('fadeInDown');
                            $mcNote.html("Meinten Sie <i>" + suggestion.full + "</i>?");
                            $mcNote.on('click', function (evt) {
                                evt.preventDefault();
                                $('#ac-name').val(suggestion.full);
                                $mcNote.removeClass('fadeInDown').addClass('fadeOutUp').delay(2000).addClass('hidden');
                            });
                        },
                        empty: function (element) {
                            // callback code
                            $mcNote.html('').addClass('hidden');
                        }
                    });
                });
                // Setup media query for enabling dynamic layouts only on
                // larger screen sizes
                var mq = window.matchMedia("(min-width: 480px)");
                if (mq.matches) {
                    // Enable e.g. masonry scripts based on available screen size
                }
            };
        }
    );
}(jQuery));
