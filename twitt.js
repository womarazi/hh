function shownsfw(){
    const a = document.querySelectorAll('article [role="button"] div[dir="auto"]');
    for(let e of a) {
      e.click();
      while(e) {
        if (e.tagName !== "ARTICLE") { e = e.parentElement; continue; }
        e.classList.add("nsfw");
        e.style.outline = "2px solid red";
        break;
      }
    }
}
setInterval(shownsfw, 500);
