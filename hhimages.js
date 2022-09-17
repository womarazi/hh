

function hhgimmain() {
  let path = location.pathname.split("/"); // "/pictures/girls/634930584/avb0-1200x.webp"
  let gid = path[3];
  let imgkind = path[4][3];
  let maxstars = 6;
  let baseurl = "https://hh2.hh-content.com/pictures/girls/";
  let urls = [];
  const div = document.createElement('div');
  div.className.add("image_control_buttons");
  let divcontent = '';
  for ( let i = 0; i <= maxstars; i++) {
    let url = baseurl + gid + (i===0 ? "/avb" : "/ava") + "-1200.webp";
    urls.push(url);
    divcontent += '<a class="gimage_a" href="' + url + '"><button class="gimage_btn">' + i + '</button></a>';
  }
  
  div.innerHTML = divcontent;
  document.body.append(div);
}


hhgimmain()
