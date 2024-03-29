var imgdebug = false;  
function imgmain(){
    console.log('img.js main executed');
    for (let dom of excludeDomains) if (location.host.indexOf(dom) >= 0) return;
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
    let priority = ["background-image", "background", "src"];
    
    function isurl(urlstr) {
        let url = null;
        if (urlstr.includes(" ")) return null;
        if (!urlstr.includes("/") || !urlstr.includes("\\")) return null;
        try { url = new URL(urlstr, "http://www.justtovalidate.kon"); } catch(e){ }
        return url;
    }
    function getimage(imghtml) {
        let style = getComputedStyle(imghtml);
        let urlstr = null;
        for (let prio of priority) {
          urlstr = style[prio] || imghtml[prio];
          let url = null;
          switch(urlstr){
              case "none":
              case "":
              case "inherit":
              case "default": break;
              default: url = isurl(urlstr); break;
          }
          if (imgdebug) console.log({imghtml, url, urlstr, prio, style});
          if (url) return urlstr;
        }
        return null;
    }
    function deepgetimage(html){
       while(html) {
           let urlstr = getimage(html);
           if (urlstr) return urlstr;
           html = html.parentElement;
       }
       return null;
    }

    function showImage(e){
      if (imgdebug) console.log('show image', {e, img, timers, target:e.target, src:e.target?.src});
      for(let timer of timers) clearTimeout(timer);
      timers = [];
      // if (e.target.src === img.src) return;
      let imghtml = e.target;
      let urlstr = deepgetimage(imghtml);
      img.src = urlstr; //e.target.src;
      container.style.display = 'block';
    }
    function hideImage(e){
      if (imgdebug) console.log('hide image', {e, timers});
      // if (e.target.tagName !== 'IMG' || e.target.src !== img.src) return;
      container.style.display = 'none';
    }
    function hideImageDelay(e) {
      if (imgdebug) console.log('hide image delay', {e, timers});
      // if (e.target.tagName !== 'IMG' || e.target.src !== img.src) return;
      if (timers.length) return;
      timers.push(setTimeout(()=>hideImage(e), 1000));
    }
    function moveContainer(e){
      if (imgdebug) console.log('move container', {e, timers});
      if (container.dataset.position === 'left') {
        container.dataset.position = 'right';
        container.style.right = '0';
        container.style.left = '';
      } else {
        container.dataset.position = 'left';
        container.style.right = '';
        container.style.left = '0'; }
    }
    let selectors = JSON.parse(localStorage.getItem('_imgjs_selector') || '["img"]');
    function mouseover(e){
      if (imgdebug) console.log('img.js mouseover', {selectors, target:e.target});
      for (let selector of selectors) if (e.target?.matches(selector)) { showImage(e); return; }
      hideImageDelay(e);
    }
    container.addEventListener('click', moveContainer);
    document.body.addEventListener('mouseover', mouseover);
    // document.body.addEventListener('mouseenter', showImage);
    // document.body.addEventListener('mouseleave', hideImageDelay);

  }

const excludeDomains = ["nutaku.waifusurprise.com", "hentaiheroes"];

if (!window.docReady)
    window.docReady = function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
docReady(imgmain);

console.log('img.js injected');
