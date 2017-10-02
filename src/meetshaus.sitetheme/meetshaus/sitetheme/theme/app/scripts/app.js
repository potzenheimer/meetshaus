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
