function shownsfw(){
    const a = document.querySelectorAll('article [role="button"] div[dir="auto"] > span > span');
    let wholepagensfw = document.querySelector('[data-testid="emptyState"] [role="button"] div[dir="auto"]');
    // wholepagensfw?.click();
    for (let e of a) {
      if (e.innerText != "View") continue;
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
setInterval(shownsfw, 500); // ytftufufguy
