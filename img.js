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
    container.style.maxWidth = '50%';
    container.style.left = '0';
    container.dataset.position = 'left';
    const img = document.createElement('img');
    container.append(img);
    let timers = [];
   
    function showImage(e){
      console.log('show image', e);
      if (e.target.tagName !== 'IMG' || e.target.src === img.src) return;
      container.style.display = 'block';
      img.src = e.target.src;
      for(let timer of timers) clearTimeout(timer);
      timers = [];
    }
    function hideImage(e){
      console.log('hide image', e);
      if (e.target.tagName !== 'IMG' || e.target.src !== img.src) return;
      container.style.display = 'none';
    }
    function hideImageDelay(e) {
      console.log('hide image delay', e);
      if (e.target.tagName !== 'IMG' || e.target.src !== img.src) return;
      timers.push(setTimeout(()=>hideImage(e), 500));
    }
    function moveContainer(){
      console.log('move container', e);
      if (container.dataset.position === 'left') {
        container.dataset.position = 'right';
        container.style.right = '0';
        container.style.left = '';
      } else {
        container.dataset.position = 'left';
        container.style.right = '';
        container.style.left = '0'; }
    }
    container.addEventListener('click', moveContainer);
    document.body.addEventListener('mouseenter', showImage);
    document.body.addEventListener('mouseleave', hideImageDelay);

}

const excludeDomains = [];

document.addEventListener("DOMContentLoaded", imgmain);
