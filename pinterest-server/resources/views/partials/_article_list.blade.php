@if($post_top)
<!-- newest blog -->
<div class="container bg-light">
    <section class="section-mobile-newblog" data-aos="fade-up" data-aos-duration="800">
        <a href="{{route('frontend.article',['locale' => app()->getLocale(), 'id' => $post_top['slug']])}}">
            <div>
                <img class="lazy mb-20" src="{{URL::to('/')}}/img/demo.jpg" data-original="{{$post_top->image->url['desktop']}}"> 
            </div>
            <h3 class="mb-10"><span class="highlight">{{$post_top['title']}}</span></h3>
            <p>{{Str::limit(trim(html_entity_decode(strip_tags($post_top['body']))),400,'...')}}</p>
        </a>
    </section>
</div>
@if(count($posts)>0)
<!-- posts -->
<div class="container">
    <section>
      <div id="articlesContainer">
        <a name="target"></a>
        @foreach ($posts as $k=>$article)
          <div class="essay-group" data-aos="fade-up" data-aos-duration="800" @if($k>0)data-aos-delay="{{200*$k}}" @endif>
              <a href="{{route('frontend.article',[ 'id' => $article['slug']])}}" @if($loop->index>0) @endif >
                  <div class="blog-list">
                      <div class="fit-img">
                          <picture>
                              <source media="(min-width: 480px)" srcset="">
                              <source media="(max-width: 800px)" srcset="">
                              <source media="(max-width: 1280px)" srcset="">
                              <source media="(min-width: 1281px)" srcset="">
                              <img class="lazy" src="{{URL::to('/')}}/img/demo.jpg" data-original="{{$article->image->url['mobile']}}" alt="" style="width:100%;height:100%">
                          </picture>
                      </div>
                      <h4><span class="highlight">{{Str::limit(trim($article['title']) ,46,'...')}}</span></h4>
                      <p>{{Str::limit(trim(html_entity_decode(strip_tags($article['body']))),80,'...')}}</p>
                  </div>
              </a>
          </div>
          @endforeach
        </div>
        <div id="loadingSpinner" class="spinner" style="display: none;">
          <img src="/img/spinner.svg" alt="">
        </div>
        {{-- <noscript>
            {{$posts->links('partials._frontend_pagination')}}
        </noscript> --}}
    </section>
</div>
{{-- 
<script>
(function($){
  var scrollThreshold = 100,
      perPage = {{$posts->perPage()}},
      total = {{$posts->total()}},
      totalPages = Math.ceil(total / perPage),
      currentPage = 1,
      locale = '{{app()->getLocale()}}',
      loadLock = false;
  $(window).on('scroll',function() {
    if($(window).scrollTop() + $(window).height() > ($(document).height() - scrollThreshold)) {
      if(!loadLock){
        currentPage++;
        loadNextPage(currentPage);
      }
    }
  });
  var loadNextPage = function(pageNumber){
    loadLock = true;
    var url = window.location.href;
    if(pageNumber <= totalPages){
      $("#loadingSpinner").show();
      $.ajax({
        'url' : url,
        'data' : {'lazyLoad' : true, 'page' : pageNumber},
        'method' : 'get',
        'dataType' : 'html'
      }).done(function(html){
        $("#articlesContainer").append(html);
        $("#loadingSpinner").hide();
        setTimeout(function(){
          loadLock = false;
        },1000);
      })
    }
  }
})(jQuery);
</script> --}}
@endif
@endif