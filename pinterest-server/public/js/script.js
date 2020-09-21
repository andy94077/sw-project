// sticky nav
$(window).scroll(function() {
    if ($(this).scrollTop() > 10){  
        $('header').addClass("sticky");
    }
    else{
        $('header').removeClass("sticky");
    }
});