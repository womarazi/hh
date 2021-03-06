  function imgmain(){
    if (excludeDomains.indexOf(location.host) >= 0) return;
    const container = document.createElement('div');
    document.body.append(container);
    container.style.position = 'fixed';
    container.style.display = 'none';
    container.style.zIndex = '100000';
    container.style.width = 'auto';
    container.style.height = 'auto';
    container.style.overflow = 'auto';
    container.style.maxWidth = '33vw';
    container.style.maxHeight = '100vh';
    container.style.left = '0';
    container.style.top = '0';
    container.dataset.position = 'left';
    const img = document.createElement('img');
    container.append(img);
    let timers = [];

    function showImage(e){
      console.log('show image', {e, timers});
      for(let timer of timers) clearTimeout(timer);
      timers = [];
      // if (e.target.src === img.src) return;
      img.src = e.target.src;
      container.style.display = 'block';
    }
    function hideImage(e){
      console.log('hide image', {e, timers});
      // if (e.target.tagName !== 'IMG' || e.target.src !== img.src) return;
      container.style.display = 'none';
    }
    function hideImageDelay(e) {
      console.log('hide image delay', {e, timers});
      // if (e.target.tagName !== 'IMG' || e.target.src !== img.src) return;
      if (timers.length) return;
      timers.push(setTimeout(()=>hideImage(e), 1000));
    }
    function moveContainer(e){
      console.log('move container', {e, timers});
      if (container.dataset.position === 'left') {
        container.dataset.position = 'right';
        container.style.right = '0';
        container.style.left = '';
      } else {
        container.dataset.position = 'left';
        container.style.right = '';
        container.style.left = '0'; }
    }
    function mouseover(e){
      console.log('mouseover');
      if (e.target.tagName === 'IMG') showImage(e); else hideImageDelay(e);
    }
    container.addEventListener('click', moveContainer);
    document.body.addEventListener('mouseover', mouseover);
    // document.body.addEventListener('mouseenter', showImage);
    // document.body.addEventListener('mouseleave', hideImageDelay);

  }

  const excludeDomains = ["nutaku.waifusurprise.com"];

  document.addEventListener("DOMContentLoaded", imgmain);
