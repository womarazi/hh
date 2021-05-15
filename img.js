function imgmain(){
    if (excludeDomains.indexOf(location.host) >= 0) return;
    const container = document.createElement('div');
    document.body.append(container);
    container.style.display = 'absolute';
    container.style.zIndex = '100000';
    container.style.width = 'auto';
    container.style.height = 'auto';
    container.style.overflow = 'auto';
    container.style.maxWidth = '50%';
    container.style.left = '0';
    container.dataset.position = 'left';
    const img = document.createElement('img');
    container.append(img);
   
    function showImage(e){
      if (e.target.tagName !== 'IMG' || e.target.src === img.src) return;
      container.style.display = 'block';
      img.src = e.target.src;
    }
    function hideImage(e){
      if (e.target.tagName !== 'IMG' || e.target.src !== img.src) return;
      container.style.display = 'none';
    }
    function moveContainer(){
      if (container.dataset.position === 'left') {
        container.dataset.position = 'right';
        container.style.right = '0';
        container.style.left = '';
      } else {
        container.dataset.position = 'left';
        container.style.right = '';
        container.style.left = '0'; }
    }
    $(container).on('click', moveContainer);
    $(document.body).on('mouseenter', showImage);
    $(document.body).on('mouseleave', hideImage);

}

const excludeDomains = [];

document.addEventListener("DOMContentLoaded", imgmain);
