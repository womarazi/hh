function maxressetup(){
   document.addEventListener("click", maxresreplace);
}
function maxresreplace() {
    const imgs = document.querySelectorAll('img[srcset]');
    for (const img of imgs) {
       const srcs = img.getAttribute('srcset');
       let resobj = 
           ('££££,' + srcs)
               .replaceAll(',https:', '££££,https')
               .split('££££,')
               .splice(1)
               .map( s => { let a = s.split(' '); return {url: a[0], res: Number.parseInt(a[1])}});
       resobj = resobj.sort( (e2, e1) => e1.res - e2.res);
       let src2 = img.getAttribute('src2');
       let biggestsrc = resobj[0].url;
       if (src2 === biggestsrc) continue;
       img.src = biggestsrc;
       img.setAttribute('src', biggestsrc);
       img.setAttribute('src2', biggestsrc);
       console.log('instagram.js set res:', {resobj, img, biggestsrc}, resobj[0]);
    }
}


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

docReady(maxressetup);
