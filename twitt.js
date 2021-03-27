function shownsfw(){
    const a = document.querySelectorAll('article [role="button"] div[dir="auto"]');
    let wholepagensfw = document.querySelector('[data-testid="emptyState"] [role="button"] div[dir="auto"]');
    wholepagensfw?.click();
    for(let e of a) {
      console.log('showing nsfw:', e);
      e.click();
      while(e) {
        if (e.tagName !== "ARTICLE") { e = e.parentElement; continue; }
        e.classList.add("nsfw");
        e.style.outline = "2px solid red";
        break;
      }
    }
}
// setInterval(shownsfw, 500);
