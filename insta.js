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
       img.src = resobj[0].url;
       img.setAttribute('src', resobj[0].url);
       console.log('set res:', {resobj, img});
    }
}

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
docReady(maxressetup);
