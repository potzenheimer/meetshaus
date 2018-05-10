if (typeof a25 == 'undefined') {
    var a25 = {};
}

var font = new FontFaceObserver('Noto Sans');
font.load().then(function () {
    document.documentElement.className += " app-fonts--loaded";
});

// Trigger font face observer protection
var fontPrimary = new FontFaceObserver('Noto Sans');
var fontSecondary = new FontFaceObserver('AurulentSansRegular');
var fontSecondaryBold = new FontFaceObserver('AurulentSansBold');
var fontSecondaryItalic = new FontFaceObserver('AurulentSansItalic');

fontPrimary.load().then(function () {
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

Promise.all([fontPrimary.load(),
            fontSecondary.load(),
            fontSecondaryBold.load(),
            fontSecondaryItalic.load()]
    ).then(function () {
        document.documentElement.className += " fonts--loaded";
});

// Anonymous only scripts (mainly used in login views)
if ($(".userrole-anonymous")[0]) {
    // Show password by default
    $('input[type="password"]').hideShowPassword(true, 'focus');
    //$('input[type="password"]').showPassword('focus', {});
    // Float labels (requires corresponding css)
    $('.app-signin-input').jvFloat();

};
