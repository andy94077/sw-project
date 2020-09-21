<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
<script src="https://cdn.bootcss.com/spin.js/2.3.2/spin.min.js"></script>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<noscript>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/noscript.css') }}">
</noscript>     
<script src="{{ asset('js/validateit.min.js') }}"></script>   
<script src="{{ asset('js/jquery.detect_swipe.js') }}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.6.8/lottie.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-123321304-1"></script>
<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'UA-123321304-1');

    $(document).ready( function(){
        AOS.init();
        $(window).scroll(function(){
            $('nav.topnav').toggleClass('sticky-topnav',($(window).scrollTop() > 50) );
            $('nav.mobilenav').toggleClass('sticky-mobilenav',($(window).scrollTop() > 50) );
            @if( Request::is( app()->getLocale().'/product/*') )
              $('nav.topnav').toggleClass('pronav',($(window).scrollTop() < 50) );
            @endif
        });
        $('#mission .mainslide').on('swipeleft',  function(){showDivs(++divIndex)})
                                .on('swiperight', function(){showDivs(--divIndex)});

        $('.productslide').on('swipeleft',  function(){showSlides(++slideIndex)})
                          .on('swiperight', function(){showSlides(--slideIndex)});
    });


</script>


