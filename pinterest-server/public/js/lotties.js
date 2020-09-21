if (document.getElementById('lottie-fun')) {
  var animationFun = bodymovin.loadAnimation({
    container: document.getElementById('lottie-fun'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '../lotties/fun.json'
  })
}

if (document.getElementById('lottie-candidate')) {
  var animationCandidate = bodymovin.loadAnimation({
    container: document.getElementById('lottie-candidate'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '../lotties/candidate.json'
  })
}

if (document.getElementById('lottie-blog')) {
  var animationBlog = bodymovin.loadAnimation({
    container: document.getElementById('lottie-blog'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '../lotties/blog.json'
  })
}