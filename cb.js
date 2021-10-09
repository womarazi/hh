
var $chat = $('#ChatTabContainer');
var chat = $chat[0];
var $msgs = $chat.find('.msg-text');
function parsemsg(index, msg){
  if (!msg || !msg.dataset) console.error(msg);
  const $msg = $(msg);
  // user level meanings: broadcaster|mod|purplebigtip|bluerecenttip|tealhascoins|graynotokens
  const ret = {user: '', userlevel:'broadcaster|mod|purplebigtip|bluerecenttip|tealhascoins|gray', tipamount:0, times: ['list of all repetition with times'], content: ''};
  ret.user = msg.dataset.nick;
  ret.times = [new Date()];
  ret.index = index; //container.children.indexOf(msg);
  ret.content = msg.innerText;
  if (!ret.user) { ret.userlevel = 'notice'; return ret; }
  var userhtml = $msg.find('.purecolor')[0];
  if (userhtml) ret.userlevel = userhtml.getAttribute('class').substr('purecolor '.length).trim();
  const tip = $msg.find('.isTip')[0];
  if (tip) {
    const tiptxt = tip.innerText;
    const tipi = tiptxt.lastIndexOf('tipped');
    ret.tipamount = Number.parseInt(tiptxt.substring(tipi + 'tipped'.length).trim());
  }
  return ret;
}

var msgparsed = $msgs.map(parsemsg);
console.log('msgparsed:', msgparsed)
