requirejs(['require',
'/++theme++meetshaus.sitetheme/dist/scripts/flickity.pkgd.js',
'/++theme++meetshaus.sitetheme/dist/scripts/fontfaceobserver.js',
'/++theme++meetshaus.sitetheme/dist/scripts/hideShowPassword.js',
'/++theme++meetshaus.sitetheme/dist/scripts/jvfloat.js',
'/++theme++meetshaus.sitetheme/dist/scripts/respimage.js',
'/++theme++meetshaus.sitetheme/dist/scripts/ls.parent-fit.js',
'/++theme++meetshaus.sitetheme/dist/scripts/lazysizes-umd.js',],
 function(require, Flickity) {
'use strict';
var font = new FontFaceObserver('Noto Sans');
font.load().then(function () {
    document.documentElement.className += " app-fonts--loaded";
});

// Anonymous only scripts (mainly used in login views)
if ($(".userrole-anonymous")[0]) {
    // Show password by default
    $('input[type="password"]').hideShowPassword(true, 'focus');
    //$('input[type="password"]').showPassword('focus', {});
    // Float labels (requires corresponding css)
    $('.app-signin-input').jvFloat();

};
});