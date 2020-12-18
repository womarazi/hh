console.log("hh.js v1 6/18/2020");
setTimeout(main0, 500);

function refreshPage(){
  setUrl(document.location.href);
}

function addKobanAutoButton() {
  let kobanbtn = document.createElement("button");
  buttonContainer.append(kobanbtn);
  kobanbtn.style.borderRadius = "15px";
  kobanbtn.style.width = kobanbtn.style.height = "30px";
  kobanbtn.style.border = "3px solid yellow";
  kobanbtn.style.backgroundColor = localStorage.getItem("useKoban") === "true" ? "green" : "red";
  $(kobanbtn).on('click', () => {
    const b = localStorage.getItem("useKoban") === "true";
    console.log("useKoban ? ", b, " --> ", !b, !b ? "green" : "red", kobanbtn);
    localStorage.setItem("useKoban", !b);
    kobanbtn.style.backgroundColor == !b ? "green" : "red";
  });
}
var buttonContainer;

var start = document.createElement("button");
var autorun = document.createElement("button");
var autorunp = document.createElement("button");

function main0() {
  /*inj_jsLoad(
    "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/",
    "jquery.min.js"
  );
  inj_jsLoad(inj_basepath, "util.js");*/
  if (!(document.readyState === "complete" || document.readyState === "interactive")){
    console.log('timeout hhmain0 100; status:'+document.readyState);
    setTimeout(main0, 100);
    return;}
  if (!document.body || $ === undefined || !$) {
    alert('old timeout hhmain0 100, should never happen!');
    setTimeout(main0, 100);
    return; }
  
  buttonContainer = document.createElement("div");
  document.body.append(buttonContainer);
  buttonContainer.append(start);
  buttonContainer.append(autorun);
  buttonContainer.append(autorunp);
  addKobanAutoButton()
  buttonContainer.style.position = "absolute";
  buttonContainer.style.right = '30px';
  buttonContainer.style.top = '30px';
  buttonContainer.style.zIndex = "1001";
  start.style.borderRadius = autorun.style.borderRadius =  autorunp.style.borderRadius = "15px";
  start.style.border = autorun.style.border = autorunp.style.border = "3px solid black";
  start.style.width = autorun.style.width = autorunp.style.width = "30px";
  start.style.height = autorun.style.height = autorunp.style.height = "30px";
  start.innerHTML = "->";
  autorun.innerHTML = 'G';
  switch (window.location.pathname) {
    case "battle.html":
    case "/tower-of-fame.html":
      towerOfFameSetup();
      break;
  }
  $startButton = $(start).on("click", hhmain);
  $autorunButton = $(autorun).on("click", autorunClick);
  $pageautorunButton = $(autorunp).on("click", autorunClick);
  autorunClick();
}

function autorunClick(evt) {
  var realClick = evt ? true : false;
  var autorun = $autorunButton[0];
  var isGlobal = evt && evt.currentTarget === autorun;
  var isLocal = evt && !isGlobal;
  var pathArray = window.location.pathname.substring(1).split('/');
  var params = getJsonFromUrl();
  var pagename = pathArray[0];
  if (params["league_battle"] !== undefined) { pagename = "tower-of-fame.html"; }
  if (params["id_arena"] !== undefined) { pagename = "arena.html"; }
  if (params["id_season_arena"] !== undefined) { pagename = "season-arena.html"; }
  ////////////////
  var lskey_g = 'injectAutorun';
  var lskey_p = 'pageAutorun_' + pagename
  var lskey = '';
  if (isGlobal) { lskey = lskey_g; }
  if (isLocal) { lskey = lskey_p; }
  if (realClick) {
    if (lskey) localStorage[lskey] = (localStorage[lskey] === "true" ? false : true);
  }
  console.log(
      "autorunclick(realclick?",
      realClick,
      ", storage?",
      localStorage.injectAutorun,
      "(",
      typeof localStorage.injectAutorun,
      ")",
      //sessionStorage.injectAutorun,
      ")"
  );

  if (localStorage[lskey_g] === "true") {
    autorun.style.backgroundColor = "green";
    console.log("start(", realClick, ")");
  } else {
    autorun.style.backgroundColor = "red";
  }
  console.log('lskey_p:', lskey_p, 'val:', localStorage[lskey_p]);
  if (localStorage[lskey_p] === "true") {
    autorunp.style.backgroundColor = "green";
    console.log("start(", realClick, ")");
  } else {
    autorunp.style.backgroundColor = "red";
  }
  
  if (localStorage[lskey_g] === 'true' && localStorage[lskey_p] === 'true') $startButton.trigger("click");
}

var $startButton;
function championmain(){
  const time = $('.champions-bottom__rest [property="teamRest"]')[0];
  const maxChampionWait = 15*60*60*1000;
  if (time) {
    const timestr = time.innerText;
    const sec = timeparse(timestr);
    console.log('waiting: ' + timestr , ' = ', sec, ' secondi');
    setTimeout(championmain, sec * 1.1 * 1000);
    return; }
  $fightbutton = $('button.champions-bottom__start-battle');
    
    
  $fightbutton.trigger('click');
  console.log('btn:', $fightbutton);
  setTimeout(refreshPage, 3*1000);
}

class cGirl {
  type = null; // | 'hk' | 'kh' | 'ch'
  attack = 0;
  ego = 0;
  excitement = 0;
  kh = 0;// at 0-star lv1
  hk = 0;
  ch = 0;
} // class cGirl end

class cstage {
  atk = 0;
  hkdef = 0;
  khdef = 0;
  chdef = 0;

deduceMissingData() {
  this.hkdef = this.hkdef || 0;
  this.khdef = this.khdef || 0;
  this.chdef = this.chdef || 0;
  const foundCounter = (this.hkdef ? 1 : 0) + (this.khdef ? 1 : 0) + (this.chdef ? 1 : 0);
  const avgDef = (this.hkdef + this.chdef + this.khdef) / foundCounter;
  this.hkdef = this.hkdef || avgDef;
  this.khdef = this.khdef || avgDef;
  this.chdef = this.chdef || avgDef;
}
} // class cstage end

class cCharacter {
  type = null; // | 'hk' | 'kh' | 'ch'
  you = null;
  lv = 0;
  ego = 0;
  harmony = 0;
  excitement = 0;
  stage1 = new cstage();
  stage2 = new cstage();
  stage3 = new cstage();
  mojoReward = 0;
  girl1 = new cGirl();
  girl2 = new cGirl();
  girl3 = new cGirl();

deduceMissingData() {
  this.stage1.deduceMissingData();
  this.stage2.deduceMissingData();
  this.stage3.deduceMissingData();
  if (!this.stage2.atk) this.stage2.atk = ((this.stage1.atk + this.stage3.atk) || 0) / 2;
  if (!this.stage2.khdef) this.stage2.khdef = ((this.stage1.khdef + this.stage3.khdef) || 0) / 2;
  if (!this.stage2.hkdef) this.stage2.hkdef = ((this.stage1.hkdef + this.stage3.hkdef) || 0) / 2;
  if (!this.stage2.chdef) this.stage2.chdef = ((this.stage1.chdef + this.stage3.chdef) || 0) / 2;
  }

winratio(enemy, judge = null, tentativi = 100, out = null) { // return % [0, 1]
  let wins = 0;
  let tentativi0 = tentativi;
  while(tentativi-- > 0) {
    wins += this.fight(enemy, judge, out) ? 1 : 0;
  }
  return wins / tentativi0;
}

fight(enemy, judge = null, out = null){ // return boolean
  let status1 = {}
  let status2 = {}
  let fillstatus = () => {
    status1.ego = this.ego;
    status2.ego = enemy.ego;
    status1.excit = status2.excit = 0;
    status1.stage = status2.stage = 1;
    status1.chshield = status2.chshield = 1; } // ch bonus active (def 1x or 2x)
  
  fillstatus();
  let wins = 0;
  while (true) {
    this.attack(enemy, status1, status2, judge, out) ? 1 : 0;
    if (status2.ego <= 0) return true;
    enemy.attack(this, status2, status1, judge, out);
    if (status1.ego <= 0) return false;
  }
}

attack(enemy, mystatus, enstatus, judge = 0, out = null){
  // out = { you: { stage1: {damages: {}}, stage2...}, enemy: {... same as you }}}
  if (out) {
    if (!out.you) out.you = {};
    if (!out.you.stage1) out.you.stage1 = {};
    if (!out.you.stage1.damages) out.you.stage1.damages = {};
    if (!out.you.stage2) out.you.stage2 = {};
    if (!out.you.stage2.damages) out.you.stage2.damages = {};
    if (!out.you.stage3) out.you.stage3 = {};
    if (!out.you.stage3.damages) out.you.stage3.damages = {};
    if (!out.enemy) out.enemy = {};
    if (!out.enemy.stage1) out.enemy.stage1 = {};
    if (!out.enemy.stage1.damages) out.enemy.stage1.damages = {};
    if (!out.enemy.stage2) out.enemy.stage2 = {};
    if (!out.enemy.stage2.damages) out.enemy.stage2.damages = {};
    if (!out.enemy.stage3) out.enemy.stage3 = {};
    if (!out.enemy.stage3.damages) out.enemy.stage3.damages = {};
  }

  let mystage = this['stage' + mystatus.stage];
  let enstage = enemy['stage' + mystatus.stage];
  console.log('pg.this:', this, 'status:', mystatus, '     enemy:', enemy, ' status:', enstatus);
  this.excitement += this['girl' + mystatus.stage].excitement;
  const classPoses = 4;
  const allPoses = classPoses * 3;
  let poseChance = 1 / allPoses;
  if (judge) { // in realtà dovrei fare match con judge && girl type, non con judge && hero type
    if (isSameType(judge, this.type)) { poseChance = 0.7 * (1 / classPoses); } else
    if (isLosingType(judge, this.type)) { poseChance = 0.05 * (1 / classPoses); } else
    if (isWinningType(judge, this.type)) { poseChance = 0.25 * (1 / classPoses); }
  }
  let harmonyChance = this.harmonyRatio(enemy);
  /*
  note:
  hk = 1.5x damage
  kh = heal 10% max hp
  ch = double defense
  */
  let gotCrit = checkRandom(harmonyChance);
  let gotOrgasm = checkRandom(0);
  let judgeBonus = checkRandom(poseChance) ? 1.05 : 1;
  let orgasmBonus0 = 1.5;
  let hkCrit = gotCrit && this.type == 'hk' ? 1.5 : 1;
  let khHeal = gotCrit && this.type == 'kh' ? 0.1 : 0;
  let orgasmBonus = gotOrgasm ? orgasmBonus0 : 1;
  this.chshield = gotCrit && this.type == 'ch' ? 2 : 1;
  let dmg = judgeBonus * orgasmBonus * hkCrit * mystage.atk - enstage[enemy.type + 'def'] * enstatus.chshield;
  let playerstr = this.you !== enemy.you ? (this.you ? 'YOU' : 'OPPONENT') : 'PLAYER LV' + this.lv;
  let oppstr = this.you !== enemy.you ? (enemy.you ? 'YOU' : 'OPPONENT') : 'PLAYER LV' + this.lv;
  console.log(playerstr, 'deals dmg = judgeBonus * orgasmBonus * hkCrit * mystage.atk - enstage[' + enemy.type + 'def' + '] * enstatus.chshield');
  console.log(playerstr, 'deals dmg =', dmg, ' = ',  judgeBonus, ' * ', orgasmBonus, ' * ', hkCrit, ' * ', mystage.atk, ' - ', enstage[enemy.type + 'def'], ' * ', enstatus.chshield);
  enstatus.ego -= dmg;
  mystatus.ego += dmg * khHeal;
  let outcomestr = '';
  if (playerstr === 'YOU') outcomestr = 'YOU WON'; else
  if (oppstr === 'YOU') outcomestr = 'YOU LOST !!!'; else outcomestr = ' player lv' + this.lv + ' won';
  if (enstatus.ego <= 0) {
    outcomestr = outcomestr + ' remaining ego:' + mystatus.ego + ' / ' + this.ego +  ' ( ' + (mystatus.ego / this.ego * 100) + '% )'; }
  else { outcomestr = ''; }
  console.info(oppstr + ' ego: ', (enstatus.ego + dmg) / 1000, 'k - ', dmg / 1000, 'k = ', enstatus.ego / 1000,  'k;      ' + outcomestr);
  
  if (!out || this.you === enemy.you) return; // do not collect statistics
  let outt = this.you ? out.you : out.enemy;
  let dmgkey = ((hkCrit !== 1 ? ' & HK_Crit' : '') + (judgeBonus !== 1 ? ' & Pose' : '') + (gotOrgasm ? ' & Orgasm' : '') + (enstatus.chshield !== 1 ? ' CH_Shield' : '')).substr(2).trim() || 'Base';
  console.info('outt:', outt, '.stage' + mystatus.stage, outt['stage' + mystatus.stage], '.damages.', dmgkey);
  outt.poseChance = poseChance;
  outt.harmonyChance = harmonyChance;
  if (outt['stage' + mystatus.stage].damages[ dmgkey ] === dmg) { ; }
  else if (!outt['stage' + mystatus.stage].damages[ dmgkey ] ) { outt['stage' + mystatus.stage].damages[ dmgkey ] = dmg; }
  else {
    dmgkey += ' ERR_';
    let diffCounter = 1;
    while (dmg && outt['stage' + mystatus.stage].damages[ dmgkey +diffCounter] && outt['stage' + mystatus.stage].damages[ dmgkey + diffCounter] !== dmg) { diffCounter++; }
    outt['stage' + mystatus.stage].damages[ dmgkey + diffCounter] = dmg;
  }
  // gfhjklòà
}

harmonyRatio(enemy) {
  let harmonyChance = 0.25;
  if (this.harmony && enemy.harmony) {
    let myh = this.harmony;
    let enh = enemy.harmony;
    if (this.type && enemy.type) {
      if (isWinningType(this.type, enemy.type)) { myh *= 1.2; }
      if (isWinningType(enemy.type, this.type)) { enh *= 1.2; }
    }
    harmonyChance = 0.5 * myh / (myh + enh);
  }
  return harmonyChance;
}

listDamages(enemy) {
  let harmonyChance = 0.25;
  if (this.harmony && enemy.harmony) {
    let myh = this.harmony;
    let enh = enemy.harmony;
    if (this.type && enemy.type) {
      if (isWinningType(this.type, enemy.type)) { myh *= 1.2; }
      if (isWinningType(enemy.type, this.type)) { enh *= 1.2; }
    }
    harmonyChance = 0.5 * myh / (myh + enh);
  }
  return harmonyChance;
}

fromBattleBlock($battleBlock, isYou) {
  const $pg = $battleBlock; // $('.battle_user_block')
  let defOrder = ['hk', 'ch', 'kh'];
  this.you = $pg[0].classList.contains('battle_hero');
  this.type = defOrder[ $pg.find('[carac^="class"]')[0].getAttribute('carac').substr('class'.length) - 1];
  this.lv = +$pg.find('.level_target')[0].innerText.replace(',', ''); // [1] contiene lv for alpha girl, etc...
  this.ego = +$pg.find('.battle-bar-ego')[0].innerText.replace('Ego', '').replace(',', '');
  let $mainStats = $pg.find('.main_stats');
  let $defStats = $pg.find('[carac^="def"]');
  this.hk = +$mainStats[0].innerText.replace(',', '');
  this.ch = +$mainStats[1].innerText.replace(',', '');
  this.kh = +$mainStats[2].innerText.replace(',', '');
  for (let i = 0; i < $defStats.length; i++) {
    let defArrs = $defStats[i].parentElement.innerText.replaceAll(',', '').split('-');
    this.stage1[ defOrder[i] + 'def'] = +defArrs[0];
    this.stage3[ defOrder[i] + 'def'] = +defArrs[1];
  }
  let atkArr = $pg.find('[carac="damage"]')[0].parentElement.innerText.replaceAll(',', '').split('-');
  this.stage1.atk = +atkArr[0];
  this.stage3.atk = +atkArr[1];
  this.excitement = +$pg.find('[carac="excit"]')[0].parentElement.innerText.replaceAll(',', '');
  this.harmony = parseFloat($pg.find('[carac="chance"]')[0].parentElement.innerText.replaceAll(',', ''));
  this.deduceMissingData();
  //  this.deduceMissingData(); usseless to force commit
}

} // class cCharacter end

function isSameType(type1, type2){ return type1 === type2 }
function isLosingType(type1, type2){
  return type1 !== type2 && (type1 === 'kh' && type2 === 'hk' || type1 === 'ch' && type2 === 'kh' ||  type1 === 'hk' && type2 === 'ch'); }
function isWinningType(type1, type2){
  return type1 !== type2 && (type1 === 'kh' && type2 === 'ch' || type1 === 'ch' && type2 === 'hk' ||  type1 === 'hk' && type2 === 'kh'); }


function checkRandom(percentage) { // return bool (pass or not pass)
  return Math.random() < percentage;
}

function seasonArenaMain() {
  const $allpg = $('#season-arena .season_arena_block');
  if ($allpg.length !== 4) { console.error('arena season character length error', $allpg); return; }
  const $you = $($allpg[0]);
  const $op1 = $($allpg[1]);
  const $op2 = $($allpg[2]);
  const $op3 = $($allpg[3]);
  const $opp = $($op1, $op2, $op3);
  
  const you = new cCharacter();
  const opponents = [new cCharacter(), new cCharacter(), new cCharacter()];
  const all = [you, ...opponents];
  const inputExpressionStr = "mojo + xp * 0";
  let scoreFunction = eval("(mojo, xp, wr) => { return wr * ( " + inputExpressionStr + ")}");
  for (let i = 0; i < all.length; i++) {
    console.log('index:', i);
    const isYou = i === 0;
    const pg = all[i];
    pg.you = isYou;
    pg.guiindex = i;
    const $pg = $($allpg[i]);
    console.log('$pg:', $pg);
    $pg.on('click', () => { you.fight(pg); });
    let atkarr = $pg.find('[carac="damage"]')[0].parentElement.innerText.replaceAll(',', '').split('-');
    let mainDefArr = $pg.find('[carac^="def"]')[0].parentElement.innerText.replaceAll(',', '').split('-');
    console.log('setting [' + i + ']', atkarr, mainDefArr);
    const $rewardpt = $pg.find('.slot_victory_points');
    pg.mojoReward = $rewardpt.length && +$rewardpt[0].innerText;
    const rewardptg = $pg.find('.slot_season_xp_girl').last()[0];
    pg.girlExpReward = rewardptg.length && +rewardptg.innerText;
    const pglvhtml = $pg.find('.text_hero_level')[0];
    let str = pglvhtml.innerText.replace('Level', '');
    pg.lv = +parseFloat(str);
    pg.ego = +$pg.find('[carac="ego"]')[0].parentElement.innerText.replaceAll(',', '');
    const harmonyhtml = $pg.find('[hh_title="Harmony"] .pull_right')[0];
    pg.harmony = +parseFloat(harmonyhtml.innerText.replaceAll(',', ''));
    let classHtml = $pg.find('[carac^="class"]')[0];
    if (classHtml.getAttribute('carac') === 'class1') { pg.type ='hk'; }
    if (classHtml.getAttribute('carac') === 'class2') { pg.type ='ch'; }
    if (classHtml.getAttribute('carac') === 'class3') { pg.type ='kh'; }
    pg.stage1.atk = +atkarr[0];
    pg.stage3.atk = +atkarr[1];
    switch (pg.type) {
      default: console.error('invalid hero class:', pg, classHtml, $pg); return;
      case 'hk':
        pg.stage1.hkdef = +mainDefArr[0];
        pg.stage3.hkdef = +mainDefArr[1];
        break;
      case 'kh':
        pg.stage1.khdef = +mainDefArr[0];
        pg.stage3.khdef = +mainDefArr[1];
        break;
      case 'ch':
        pg.stage1.chdef = +mainDefArr[0];
        pg.stage3.chdef = +mainDefArr[1];
        break; }
    pg.deduceMissingData();
    const winratio = you.winratio(pg);
    pg.prizescore = scoreFunction(pg.mojoReward, pg.girlExpReward, winratio);
    pglvhtml.innerHTML = pg.lv + ' WR: ' + (winratio * 100) + '%' +
      '<div class="wrdata" style="scale: 0.8; border: 2px solid;" >' +
      'avg Prize:<div class="slot slot_victory_points" cur="victory_points"><p>' + (pg.mojoReward * winratio) + '</p></div>' +
      '<div class="slot slot_season_xp_girl"><p>Girl</p><p>' +  (pg.girlExpReward * winratio) + '</p></div>' +
      '<div class="slot slot_season_xp_girl" style="background: goldenrod;"><p>Score</p><p>' +  (pg.prizescore) + '</p></div>' +
    '</div>';
    harmonyhtml.innerText = pg.harmony + ' | ' + Math.floor(pg.harmonyRatio(you) * 100 * 100) / 100 + '% ';
  }
  window['allpg'] = all;
  const bestOpponent = opponents.sort((a, b) => a.prizescore - b.prizescore)[0];
  $allpg[bestOpponent.guiindex].style.background = '#30601070';
  console.log('season arena script end:', all, $allpg);
  //aaaaaaaaaaaaaasfdgnmfdretwqfsgdtesdbfnhd
}

function contestmain() {
  $contestEndedRoots = $('.contest_header.ended');
  const ranks = $contestEndedRoots.find('.rank').map( (i, e) => +e.firstChild.nodeValue);
  const $retireButtons = $contestEndedRoots.find('.purple_button_L');
  if (ranks.length !== $retireButtons.length) { alert ('contestmain code became obsolete'); return; }
  
  const now = new Date();
  const serverResetHour = 14;
  const getServerMidnight = (date) => {
    const daychange = (date.getHours() < serverResetHour); // cannot set day backward, causa problemi se cambia mese...
    date.setHours(0, 0, 0, 0);
    return date.getTime() - (daychange ? 24 * 60 * 60 * 1000 : 0);
  }

  let todaymidnight = getServerMidnight(now);
  const hours = now.getHours();
  const hoursLeft = (24 - (1 + hours) + 14) % 24;
  console.log('Changing server-day in: ', hoursLeft, '   =   (24 - (1 + hours) + 14) % 24   =   (24 - (1 + ' + hours + ') + 14) % 24');
  setTimeout(contestmain, Math.max(10, hoursLeft * 1.1) * 60 * 60 * 1000); // day-change check, setto un max per evitare hibernating issues
  let lastdate = +localStorage.contestretiredate;
  
  const setRetireDate = () => {
    localStorage.contestretiredate = lastdate = todaymidnight = getServerMidnight(new Date());
  }
  
  $retireButtons.on('click', setRetireDate);
  if (todaymidnight - lastdate <= 2 * 60 * 60 * 60 * 1000) return; // every 2 days i collect.
  // collect the least ranked challenge ended.
  let minindex = 0;
  let minvalue = ranks[0];
  for (let i = 1; i < ranks.length; i++) {
    if (minvalue < ranks[i]) { minvalue = ranks[i]; minindex = i; }
  }
  //sdfghjklò
  // minindex = 0; // perchè forse è "se hai una challenge non ritirata da 4 giorni" invece di "se non ritiri challenge per 4 giorni"
  console.log('collecting:', $retireButtons[minindex]);
  $($retireButtons[minindex]).trigger('click');
}

function closeRewardPopup(retrycount = 0, afterSuccessFunc = null) {
  let $btn = $('#rewards_popup .blue_button_L:visible');
  if ($btn.length) {
    $btn.trigger('click');
    afterSuccessFunc && afterSuccessFunc();
    return;
  }
  if (retrycount > 10) return;
  setTimeout( () => closeRewardPopup(retrycount++, afterSuccessFunc), 1000);
}

function popmain(collected = false, retrycount = 0) {
  return; // currently disabled, update it.
  const $collect = $('#pop .pop_central_part .purple_button_L:visible');
  const retry = () => setTimeout(()=>popmain(true), 1000, retrycount+1);
  if (retrycount > 5) { pageRefresh(); return; }
  
  console.log('pop collect check');
  if ($collect.length) {
    if (!collected) $collect.trigger('click');
    closeRewardPopup();
    retry();
    return; }
  

  const $autoassign = $('#pop .pop_right_part .blue_button_L[rel="pop_auto_assign"]:visible');
  console.log('pop assign check', $autoassign, 'disabled:', $autoassign[0].disabled);
  if ($autoassign.length && !$autoassign[0].disabled) { $autoassign.trigger('click'); retry(); return; }
  
  const $depart = $('#pop .pop_central_part .blue_button_L[rel="pop_action"]:visible');
  console.log('pop depart check', $depart);
  if ($depart.length) { $depart.trigger('click'); retry(); return; }
  
  const $kobanend = $('#pop .pop_central_part .orange_button_L[rel="pop_finish"]:visible');
  const $trackbar = $('#pop .pop_central_part .hh_bar .frontbar:visible');
  const $timeleft = $('#pop .pop_central_part .pop_remaining span');
  const timeleft_num = timeparse($timeleft[0].innerText);

  console.log('$collect', $collect, '$autoassign', $autoassign, '$depart', $depart, '$kobanend', $kobanend, '$trackbar', $trackbar, '$timeleft', $timeleft);
  if (!$kobanend.length || !$trackbar.length || !$timeleft.length) { retry(); return; }
  const percent = +$trackbar[0].style.width.replaceAll('\%', '') /100; // tra 0 e 1
  retrycount = 0;
  setTimeout(()=>popmain(true), (timeleft_num * 1 + 1) *1000, retrycount);
  
  
}

function hhmain() {
  console.log("hhMain");
  const pathArray = window.location.pathname.substring(1).replaceAll('\.html', '').split('/');
  // window.is_cheat_click = () => false;
  switch (pathArray[0]) {
    case "tower-of-fame":
      towerOfFameMain();
      break;
      
    case "home":
    case "shop":
    case "quest":
    case "":
    case "hero":
    case "world":
    case "champions-map":
    case "pachinko": break;
    case "season-arena":
      seasonArenaMain();
      break;
    case "harem": harem0(); break;
    case "activities":
      // if (window.location.pathname.indexOf('tab=contests') > 0) return;
      missionmain();
      contestmain();
      popmain();
      break;

    case "battle":
      var params = getJsonFromUrl();
      if (params["id_arena"] !== undefined) {
        return trollFight(true, false, false);
      }
      if (params["id_troll"] !== undefined) {
        return trollFight(false, true, false);
      }
      if (params["league_battle"] !== undefined) {
        return trollFight(false, false, true);
      }
      if (params["id_season_arena"] !== undefined) {
        return trollFight(false, false, false, true);
      }
      break;
      
    case "arena":
      arenaMain();
      break;
      
    case "champions":
      championmain();
      break;
      
    default:
      switch(pathArray[1]){
        default: break;
      }

  }
}

function maketoweruserlist(userlist = null) {
  if (!userlist) { userlist = {}; }
  window.userlist = userlist;
  const $leagues = $('.leagues_table');
  const $idarr = $leagues.find('[sorting_id]');
  let i;
  for (i = 0; i < $idarr.length; i++) { // user list validator
    let userid = $idarr[i].getAttribute('sorting_id');
    if (userlist[userid] || $idarr[i].classList.contains('personal_highlight')) continue;
    $($idarr[i]).trigger('click');
    gettoweruserinfo(userid, userlist);
    // temp end, ma restituisco l'oggetto che verrà riempito.
    return userlist; }
  // real end
  localStorage.setItem('_hhtowerlist', JSON.stringify(userlist) );
  window.userlist = userlist;
  $('#buttonmakeuserlist')[0].style.backgroundColor = 'white';
  return userlist; }

function gettoweruserinfo(userid, userList, timeout = 200, msecwaiting = 0, singleupdate = false) {
  let $userinfo = $('#leagues_right');
  let tmp;
  
  tmp = $userinfo.find('.avatar_border > img')[0].getAttribute('onclick');
  if (msecwaiting > 3000) {
    // todo: così perdo i progressi finora analizzati, dovrei ri-triggerare il click o salvare la struttura incompleta e marchiarla come incompleta.
    refreshPage(); return; }
  if (tmp !== 'hero_page_popup({ id: ' + userid + ' })') {
    msecwaiting += timeout;
    setTimeout(() => { gettoweruserinfo(userid, userList, timeout, msecwaiting)}, timeout);
    return; };
  userList[userid] = {};
  if (!+userList.length) userList.length = 0;
  userList.length+=1;
  userList[userid].name = $userinfo.find('.title')[0].innerText;
  userList[userid].lv = +$userinfo.find('.level')[0].innerText;
  userList[userid].ishk = $userinfo.find('[carac="class1"]').length ? true : false;
  userList[userid].isch = $userinfo.find('[carac="class2"]').length ? true : false;
  userList[userid].iskh = $userinfo.find('[carac="class3"]').length ? true : false;
  // console.log('debuggg', userList[userid], $userinfo, $userinfo.find('.lead_ego'));
  // userList['error']['error']['error'] = 'error';
    let tonum = (str) => {
    let num = parseFloat(str);
    if (str.indexOf('K') > 0) return num*1000;
    if (str.indexOf('M') > 0) return num*1000*1000;
    if (str.indexOf('k') > 0) return num*1000;
    if (str.indexOf('m') > 0) return num*1000*1000;
    return num; };
  tmp = $userinfo.find('.lead_ego')[0].children[1].innerText;
  userList[userid].hp = +replaceCharAt(tmp, tmp.indexOf(','), '');
  
  // console.log('debuggg', userList[userid], $userinfo, $userinfo.find('.lead_ego'));
  // userList['error']['error']['error'] = 'error';
  
  let $girllevels = $userinfo.find('.girls_wrapper .level');
  userList[userid].girls = [];
  userList[userid].girls[0] = +$girllevels[0].innerText;
  userList[userid].girls[1] = +$girllevels[1].innerText;
  userList[userid].girls[2] = +$girllevels[2].innerText;
  let $stat = $userinfo.find('.stats_wrap');

  userList[userid].hk = tonum($stat.find('[carac="1"]')[0].nextSibling.innerText);
  userList[userid].ch = tonum($stat.find('[carac="2"]')[0].nextSibling.innerText);
  userList[userid].kh = tonum($stat.find('[carac="3"]')[0].nextSibling.innerText);
  userList[userid].defhk = tonum($stat.find('[carac="def1"]')[0].nextSibling.innerText);
  userList[userid].defch = tonum($stat.find('[carac="def2"]')[0].nextSibling.innerText);
  userList[userid].defkh = tonum($stat.find('[carac="def3"]')[0].nextSibling.innerText);
  userList[userid].hp = tonum($stat.find('[carac="endurance"]')[0].nextSibling.innerText);
  userList[userid].atk = tonum($stat.find('[carac="damage"]')[0].nextSibling.innerText);
  userList[userid].excit = tonum($stat.find('[carac="excit"]')[0].nextSibling.innerText);
  userList[userid].chance = tonum($stat.find('[carac="chance"]')[0].nextSibling.innerText);
  userList[userid].win = $userinfo.find('.challenge .result.won').length;
  userList[userid].loses = $userinfo.find('.challenge .result.lost').length;
  userList[userid].fought = userList[userid].win + userList[userid].loses;
  /*if (userList[userid].name === 'rocken') { 
    console.log('debug:', $userinfo);
    return; }*/
  if (singleupdate) return;
  maketoweruserlist(userList);
}

function replaceCharAt(string, index, replacestr) {
  if (index < 1 || index === null || index === undefined || isNaN(+index)) return string;
  return string.substr(0, +index) + replacestr + string.substr(index + 1); }

function towerOfFameSetup() {
  const buttonch = document.createElement('button');
  const buttonkh = document.createElement('button');
  const buttonhk = document.createElement('button');
  const buttonmakeuserlist = document.createElement('button');
  buttonch.innerText = 'CH';
  buttonkh.innerText = 'KH';
  buttonhk.innerText = 'HK';
  const buttoncontainer = document.createElement('div');
  buttoncontainer.style.position = 'absolute';
  buttoncontainer.style.top = (40 + 30*2) +'px';
  buttoncontainer.style.right = '0px';
  buttoncontainer.style.zIndex = 1001;
  buttoncontainer.style.backgroundColor = 'gray';
  buttonmakeuserlist.style.margin = buttonch.style.margin = buttonkh.style.margin = buttonhk.style.margin = '10px';
  buttonmakeuserlist.style.border = buttonch.style.border = buttonkh.style.border = buttonhk.style.border = '5px solid black';
  buttonmakeuserlist.style.height = buttonch.style.height = buttonkh.style.height = buttonhk.style.height =
  buttonmakeuserlist.style.width = buttonch.style.width = buttonkh.style.width = buttonhk.style.width = '30px';
  
  buttonmakeuserlist.style.padding = buttonch.style.padding = buttonkh.style.padding = buttonhk.style.padding = '0';
  buttonmakeuserlist.style.borderRadius = buttonch.style.borderRadius = buttonkh.style.borderRadius = buttonhk.style.borderRadius = '15px';
  
  buttonch.style.borderColor = 'red';
  buttonkh.style.borderColor = 'white';
  buttonhk.style.borderColor = 'black';
  buttonmakeuserlist.style.borderColor = 'black';
  let doch = localStorage.getItem('_hhtowerch') === 'true';
  let dokh = localStorage.getItem('_hhtowerkh') === 'true';
  let dohk = localStorage.getItem('_hhtowerhk') === 'true';
  buttonch.style.backgroundColor = doch ? 'green' : 'red';
  buttonkh.style.backgroundColor = dokh ? 'green' : 'red';
  buttonhk.style.backgroundColor = dohk ? 'green' : 'red';
  buttonmakeuserlist.id = 'buttonmakeuserlist';
  buttonhk.id = 'buttonhk';
  buttonkh.id = 'buttonkh';
  buttonch.id = 'buttonch';
  buttoncontainer.append(buttonmakeuserlist);
  buttoncontainer.append(buttonch);
  buttoncontainer.append(buttonkh);
  buttoncontainer.append(buttonhk);
  document.body.append(buttoncontainer);
  $(buttonmakeuserlist).on('click', () =>  {
    if (buttonmakeuserlist.style.backgroundColor === 'white') {
      buttonmakeuserlist.style.backgroundColor = 'black';
      return; }
      buttonmakeuserlist.style.backgroundColor = 'gray' ;
    maketoweruserlist(); });
  $(buttonch).on('click', () =>  {
    doch = buttonch.style.backgroundColor === 'green';
    buttonch.style.backgroundColor = (doch = !doch) ? 'green' : 'red';
    localStorage.setItem('_hhtowerch', doch);
  });
  $(buttonkh).on('click', () =>  {
    dokh = buttonkh.style.backgroundColor === 'green';
    buttonkh.style.backgroundColor = (dokh = !dokh) ? 'green' : 'red';
    localStorage.setItem('_hhtowerkh', dokh);
  });
  $(buttonhk).on('click', () =>  {
    dohk = buttonhk.style.backgroundColor === 'green';
    buttonhk.style.backgroundColor = (dohk = !dohk) ? 'green' : 'red';
    localStorage.setItem('_hhtowerhk', dohk);
  });
  
  
  let userlist = JSON.parse(localStorage.getItem('_hhtowerlist'));
  buttonmakeuserlist.style.backgroundColor = (userlist && userlist.length > 0) ? 'white' : 'black';
  
  const selectedUser = $('#leagues_middle').find('.lead_table_default')[0];
  if (!selectedUser) return;
  const selectedid = selectedUser.getAttribute('sorting_id');
  if (userlist[selectedid]) {
    let singleupdate = true;
    let msecwaiting = 0;
    let timeout = 200;
    gettoweruserinfo(selectedid, userlist, timeout, msecwaiting, singleupdate);
    localStorage.setItem('_hhtowerlist', JSON.stringify(userlist));
  }
}

function towerOfFameMain(autorefill = true){
  const dokh = $('#buttonkh')[0].style.backgroundColor === 'green';
  const dohk = $('#buttonhk')[0].style.backgroundColor === 'green';
  const doch = $('#buttonch')[0].style.backgroundColor === 'green';
  console.log('toweroffamemainn() ' + (doch? 'ch' : '##') + (dohk? ' hk' : ' ##') + (dokh ? ' kh' : ' ##'));
  const userlistbutton = $('#buttonmakeuserlist')[0];
  // end setup html buttons, start logic
  if (!doch && !dokh && !dohk) return;
  const mustStopToRefill = () => {
    if (energy > 0 ) return false;
    if (!usekoban) return true;
    setTimeout(() => towerOfFameMain(false), 300);
    if (autorefill) {
      console.log('energyrefill: popup not visible');
      $challenge.find('.refill-challenge-points').trigger('click');
    } else {
      console.log('energyrefill: popup visible');
      const $popup = $('#no_energy_challenge:visible');
      if ($popup.length) $popup.find('.orange_text_button').trigger('click');
    }
    return true; };

  const $challenge = $('.challenge_points');
  const energy = +$challenge.find('[energy]')[0].innerText;
  const usekoban = localStorage.getItem("useKoban") === "true";
  // console.log('energy:', energy); return;
  let userlist = JSON.parse(localStorage.getItem('_hhtowerlist'));
  if (userlist.length === 0) userlist = null;
  const $leagues = $('.leagues_table');
  const $idarr = $leagues.find('[sorting_id]');
  let i;
  // validate user list
  
  console.log('toweroffamemain: userlist:', userlist);
  if (userlist) for (i = 0; i < $idarr.length; i++) { // user list validator
    if ($idarr[i].classList.contains('personal_highlight')) continue;
    let userid = $idarr[i].getAttribute('sorting_id');
    if (userlist[userid]) continue;
    
    console.log('toweroffamemain: userlist invalida resettata per colpa di:' + userid);
    userlist = null;
    localStorage.setItem('_hhtowerlist', null);
    break; }
  if (!userlist) {
    $('#buttonmakeuserlist')[0].style.backgroundColor = 'black';
    return; }
  // actually do fights
  for (let key in userlist) {
    if (key === 'length') continue;
    if (key === null || key === undefined || isNaN(+key)) continue;
    const user = userlist[key];
    if (+user.fought === 3) continue;
    if (!(user.isch && doch || user.iskh && dokh || user.ishk && dohk)) continue;
    if (mustStopToRefill()) return;
    setUrl('https://www.hentaiheroes.com/battle.html?league_battle=1&id_member=' + key);
    // let html = $leagues.find('[sorting_id="' + key + '"]')[0];
    // if (!html) { alert('html not found codeline 171'); return; }
    // $(html).trigger('click');
    // se vuoi fare smart fight choices analizza il riquadro destro con le stat e vedi se sono cambiate. e aggiorna lo userobject
    
  }
}
function myrand(min, max){
  return min + ((Math.random())*(max - min))
}
function sortGirlArr() {
  var sorted = {};
  var keysSorted = Object.keys(girls).sort(function(a, b) {
    var gradeDiff, idDiff;
    if ((gradeDiff = girls[a].gData.graded - girls[b].gData.graded) !== 0)
      return -gradeDiff;
    return (idDiff = girls[a].gId - girls[b].gId);
  });
  console.log("keysSorted: ", keysSorted);
  return keysSorted;
}
var lastgirlCollected = -1;
var lastIndex = 0;
function haremCollectLoop(keySorted) {
  if($('div.girls_list>div[id_girl]').length === 0) {
    console.log('timeoutHaremLoop 100'); setTimeout(haremCollectLoop, 100); return; }
  var sec = 1000,
    min = 60 * 1000,
    hour = 60 * 60 * 1000;
  var bigdelay = myrand(10,40) * min;
  var smalldelay = myrand(0.2, 0.3) * sec;
  if (!keySorted) keySorted = sortGirlArr();
  var index = 0;
  for (var key in keySorted) {
    if (++index <= lastIndex) continue;
    var gId = keySorted[key];
    var girl = girls[gId];
    var timeleft = girl.gData.pay_in; // maxwait= pay_time
    if (timeleft === undefined || timeleft === null) continue; //girl not owned.
    if (timeleft === 0 && lastgirlCollected !== gId) {
      console.log(
        "collect(",
        gId,
        " = ",
        girl.gData.Name,
        "), timeleft:",
        timeleft,
        ", wait:",
        smalldelay
      );
      haremCollectGirl(gId);
      lastgirlCollected = gId;
      lastIndex = index;
      setTimeout(function() {
        haremCollectLoop(keySorted);
      }, smalldelay);
      return;
    }
  }
  lastIndex = 0;
  //only reached when girl are all ccollected.
  setTimeout(function() {
    haremCollectLoop(keySorted);
  }, bigdelay);
}
function haremCollectGirl(id) {
  if (id === null || id === undefined || isNaN(+id)) return;
  var girlsSelector = 'div.girls_list>div[id_girl]>div[girl="' + id + '"]';
  console.log("$(", girlsSelector, ").trigger('click');");
  $(girlsSelector).trigger("click");
}
function harem0() {
  if(!girls || $('div.girls_list>div[id_girl]').length === 0) {
    console.log('timeoutharemSetup 100'); setTimeout(harem0, 100); return; }
  var raw_messagesent_Header =
    "Host: www.hentaiheroes.com" +
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0" +
    "Accept: application/json, text/javascript, */*; q=0.01" +
    "Accept-Language: it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3" +
    "Accept-Encoding: gzip, deflate, br" +
    "Referer: https://www.hentaiheroes.com/harem/1" +
    "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" +
    "X-Requested-With: XMLHttpRequest" +
    "Content-Length: 41" +
    "Cookie: lang=en; age_verification=1; _pk_id.2.6e07=f455cf5eb30d10a0.1545658348.3.1545737742.1545737710.; member_guid=4FB7B7E8-5676-43CF-976D-C6FB6C2F6B8B; stay_online=213108%3A40b0c90237715073e87f1e6923a84f84; HH_SESS_13=edruqbrmo29mkh83p9kc6l5nf3; HAPBK=web2" +
    "DNT: 1" +
    "Connection: keep-alive";
  var raw_messagesent_Content = "class=Girl&which=986125&action=get_salary";

  var girlsSelector = "div.girls_list>div[id_girl]>div[girl]";
  $("body")
    .off("click")
    .on("click", girlsSelector, function(e) {
      //if (is_cheat_click(arguments[0])) console.log('cheat!');
      //console.log("this!", this);
      var gId = $(this).attr("girl");
      var girlObj = girls[gId];
      if (girlObj.gData.own) {
        if (girlObj.readyForCollect) {
          girlObj.onSalaryBtnClicked(e);
        } else if (isMobile) {
          GirlSalaryManager.initGirlSalaryHover(gId);
        }
      }
      girlObj.showInRight();
      localStorageSetItem("last_open_girl", gId);
    });
  haremCollectLoop(null);
}
function setUrl(url) {
  document.location.href = url;
}
function arenaMain() {
  console.log("arenaMain");
  var $opponents = $(".opponents_arena > .sub_block");
  if ($opponents.length === 0) { console.log('timeoutArena 100'); setTimeout(arenaMain, 100); return; }
  pe($opponents.length !== 3, "opponent n. wrong:", $opponents);
  if (!$opponents[0].classList.contains("disabled")) {
    document.location.href = $opponents[0].getAttribute("href");
  }
  if (!$opponents[1].classList.contains("disabled")) {
    document.location.href = $opponents[1].getAttribute("href");
  }
  if (!$opponents[2].classList.contains("disabled")) {
    document.location.href = $opponents[2].getAttribute("href");
  }
}
/*
function arenaFight() {
  console.log("arenaFight");
  var $BUTTON = $("#battle_middle > .green_button_L");
  if ($BUTTON.length === 0) { console.log('timeoutArenaFight 100'); setTimeout(arenaFight, 100); return; }
  $BUTTON
    .off("click")
    .on("click", arenaFightMod)
    .trigger("click");
}*/

function arenaFightMod() {
  // original fight function withouth cheatclick check
  // if (is_cheat_click(arguments[0])) return false;
  $("#battle .battle_hero .class_change_btn").unbind("click");
  $("#battle .battle_hero .class_change_btn .hh_class_tooltip").addClass(
    "hh_class_tooltip_click_disabled"
  );
  $("#battle .battle_hero .class_change_btn").removeClass("class_change_btn");
  var $button = $(this);
  var autoFight = $button.hasClass("autofight") ? 1 : 0;
  if (hh_battle_players[1].id_troll) {
    if ($(".girls_reward").find(".animate>div").length > 1)
      if (window.troll_girls) window.troll_girls.stop();
    if ($(".items_reward").find(".animate>div>div").length > 1)
      if (window.troll_rewards) window.troll_rewards.stop();
    var energyFightPrice = $button.attr("price_fe");
    var price = $button.attr("price");
    var makeTrollFight = function makeTrollFight() {
      if (Hero.infos.energy_fight < energyFightPrice) {
        HHPopupManager.show("no_energy_fight", {
          energy: "fight"
        });
        return;
      } else make_ajax(hh_battle_players[1], autoFight);
    };
    if (autoFight) {
      if (price > 0) hc_confirm(price, makeTrollFight);
      else makeTrollFight();
    }
  }
  if (!autoFight) {
    if (
      hh_battle_players[1].id_member &&
      !hh_battle_players[1].id_arena &&
      Hero.infos.energy_challenge <= 0
    ) {
      HHPopupManager.show("no_energy_challenge", {
        energy: "challenge"
      });
      return;
    } else make_ajax(hh_battle_players[1], autoFight);
    $("body.page-battle").addClass("battleStarted");
    setTimeout(function() {
      $("#battle").addClass("preBattleAnim");
      $('[anim-step="hideDelay"]').hide();
    }, 800);
    var $oppGirl_image = $('#girlsBattleground img[girl-owner="opponent"]');
    $oppGirl_image.each(function() {
      var iname = $(this).attr("src");
      $(this).attr("src", iname.replaceAll("ico", "ava"));
    });
    $button.prop("disabled", true);
    $('#battle button[rel="skip"]').hide();
  }

  function make_ajax(player, autoFight) {
    $('[rel="launch"]').prop("disabled", true);
    var params = {
      class: "Battle",
      action: "fight",
      who: player,
      autoFight: autoFight
    };
    if (autoFight) loadingAnimation.start();
    hh_ajax(params, function(data) {
      /////
      console.log(
        "reply:",
        data,
        "rewards:",
        data.end.rewards,
        "rew.data",
        data.end.rewards.data,
        "shards:",
        data.end.rewards.data.shards
      ); //, data.drops, 'shard:', data.drops.girl_shards);
      refreshPage();
      /////
      $(".judjePos").show();
      loadingAnimation.stop();
      var battleData = void 0;
      if (!autoFight) {
        battleData = data.end.updated_infos;
        Battle.log = data.log;
        Battle.end = data.end;
        Battle.show();
      } else {
        battleData = data.updated_infos;
        var reward = data.rewards;
        reward.redirectUrl = "/world/" + hh_battle_players[1].id_world;
        Reward.handlePopup(reward);
      }
      Hero.updates(battleData, true);
    });
  }
}
function canUseKoban() {
  return localStorage.getItem("useKoban") === "true";
}
function trollFight(isarena = false, istroll = false, isleague = false, isSeason = false) {
  // console.log("trollFight setup");
  if (isSeason) {
    // const $egoOnLeagueBattle = $('.base_block.battle_user_block.battle_opponent .bar.bar_ego_blue');
    const $enemyEgo = $('#battle .season_arena_block.battle_opponent .bar-wrap.battle-bar-ego .bar.bar_ego_blue');
    console.log('$enemyEgo:', $enemyEgo);
    let onFightStart = () => {
      console.log('called callback: window.location.href = "https://www.hentaiheroes.com/season-arena.html"');
      window.location.href = "https://www.hentaiheroes.com/season-arena.html"; }
    let checkFightStart = (totalWait = 0, checkDelay = 1000, callback) => {
      if (totalWait > 10 * 1000) { refreshPage(); return; }
      const battleStarted = $enemyEgo[0].style.width && $enemyEgo[0].style.width !== '100%' // $('[battle-step]:visible').length; // totalWait > 5 * 1000
      console.log('battleStarted1 ? ', battleStarted, $enemyEgo[0].style.width, ' totalWait:', totalWait);
      if (!battleStarted) { setTimeout( () => { checkFightStart(totalWait += checkDelay, checkDelay, callback); }, checkDelay); return; }
      console.log('calling callback:', callback);
      callback();
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    checkFightStart(0, 1000, onFightStart);
    return;
  }
  
  var $button = $('#battle_middle .green_button_L[rel="launch"]:visible');
  var $girls = $('.rewards_list .girls_reward .slot_girl_shards:visible');
  var $rewardcontainer = $('.rewards_list:visible');
  var $girls = $rewardcontainer.find('.girls_reward .slot_girl_shards:visible');
  if (istroll && ($button.length == 0 || $rewardcontainer.length == 0)) {
    console.log('timeouttrollFight 100');
    setTimeout(() => trollFight(isarena, istroll, isleague, isSeason), 100);
    return; }
  
  // console.log("trollFight check troll && girl");
  if (istroll && $girls.length === 0) {
    let favBoss = +localStorage.getItem('favBoss');
    let favurl = "https://www.hentaiheroes.com/battle.html?id_troll="+favBoss;
    let forceFight = localStorage.getItem('forceFight');
    if (forceFight === 'true') { forceFight = true; }
    else if (forceFight === 'false') { farceFight = false; }
    else { forceFight = !!+forceFight; }
    console.log('forceFight? ', forceFight, document.location.href, favurl);
    if (isNaN(favBoss) || favBoss <= 0) return;
    if (document.location.href !== favurl || !forceFight) { setUrl(favurl); }
  }

  // console.log("trollFight check energy");
  var energy = istroll ? +$(
    '.energy_counter[type="fight"] [energy=""]'
  )[0].innerHTML : 20;
  const usekoban = canUseKoban();
  if (!usekoban && !isleague) { setTimeout(() => trollFight(isarena, istroll, isleague, isSeason), 30 * minutes); }
  if (energy === 0) {
    if (!usekoban) return;
    let $energybtn = $('[type="energy_fight"] .hudPlus_mix_icn');
    if ($energybtn.length !== 1) { alert("found multiple energy-fight buttons", $energybtn); return; }
    if (!$energybtn[0].disabled) {
      $energybtn.trigger('click');
      $energybtn[0].disabled = true;
    }
    setTimeout( () => {
      $('#no_energy_fight .orange_text_button').trigger('click');
      setTimeout( () => { trollFight(isarena, istroll, isleague, isSeason); }, 300);
    }, 200);
    return; }

  // console.log("trollFight event changed check");
  var listeners = undefined;
  //listeners = window.getEventListeners($button[0]);
  var event = "click";
  //console.log("original event.click: ", listeners[event]);
  //console.log(listeners[event].toSource());
  if (
    istroll &&
    listeners !== undefined &&
    listeners[event].toSource() !== originaltrollfight.toSource()
  ) {
    alert("event changed! was vs now");
    alert(originaltrollfight.toSource());
    alert(listeners[event].toSource());
    return;
  }

  // console.log("trollFight start");
  $button[0].innerHTML = "PerforM!";
  $button
    .off("click")
    .on("click", arenaFightMod)
    .trigger("click");
}
function write(key, val){
  localStorage.setItem(key, val);
}
function read(val){}
function leagueFightOld() {
  console.log("leagueFight");
  var $button = $("#battle_middle > .green_button_L");
  if ($button.length <= 0) {
    console.log('timeoutleagueFight 100');
    setTimeout(leagueFight, 100);
    return; }
  $button[0].innerHTML = "PerforM!";
  $button
    .off("click")
    .on("click", arenaFightMod)
    .trigger("click");
}
var seconds = 1000;
var minutes = seconds * 60;
var hours = minutes * 60;

function getJsonFromUrl(hashBased) {
  var query;
  if (hashBased) {
    var pos = location.href.indexOf("?");
    if (pos === -1) return [];
    query = location.href.substr(pos + 1);
  } else {
    query = location.search.substr(1);
  }
  var result = {};
  query.split("&").forEach(function(part) {
    if (!part) return;
    part = part.split("+").join(" "); // replace every + with space, regexp-free version
    var eq = part.indexOf("=");
    var key = eq > -1 ? part.substr(0, eq) : part;
    var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
    var from = key.indexOf("[");
    if (from === -1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf("]", from);
      var index = decodeURIComponent(key.substring(from + 1, to));
      key = decodeURIComponent(key.substring(0, from));
      if (!result[key]) result[key] = [];
      if (!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}

var $haremClickable;

function missionmain(missions = null, index = 0) {
  // le missioni sono ordinate per durata e le completo nell'ordine dell'array.
  // quindi controllo sempre l'elemento[0].
  // se lo sto svolgendo aspetto.
  // se è completo lo riscatto e controllo la [1].
  // se è da accettare lo accetto.
  // se è "new day" (sta finendo la mia giornata e sto per dormire) prende invece la quest più lunga (ultima nell'array)
  closeRewardPopup();
  var isNewDay = new Date().getHours();
  isNewDay = isNewDay <= 8 && isNewDay >= 5;
  if(missions === null) missions = this.getMissions();
  if (missions.length === 0) { collectDailyReward(); return; }
  if (index >= missions.length) { setTimeout( () => missionmain(null, 0), 1000); }// succede se viene riscattata l'ultima quest nell'array (ma potrebbero essercene altre)
  if (isNewDay && missions[missions.length-1].time >= 1*60*60) index = missions.length-1;
  const mission = missions[index];
  console.log('quest:', mission, ' = ', missions,'['+index+']');
  switch(mission.status) {
    default: pe(true, 'unexpected quest status:'+mission.status);
    case 'to accept': questAccept(mission.button, mission.time); break;
    case 'accepted': questDoing(mission.button, mission.time); break;
    case 'completed': questReward(mission.button); missionmain(missions, index + 1); return; break;
  }
  setTimeout(missionmain, 1000*(1.1*mission.time+5));
}
function collectDailyReward() {
  console.log('collectDailyReward() todo');
}
function questAccept(btn, time){
  $(btn).trigger('click');
}
function questDoing(btn, time){;}
function questReward(btn){
  $(btn).trigger('click');
}
  
function getMissions()/* :{time: seconds, button: html, container: html}[] */ {
  var missioncontainers = $('.mission_button');
  const errmsg = 'mission page updated, update code too. errno:';
  const retarr = [];
  for(let i = 0; i < missioncontainers.length; i++) {
    const retelem = {time: null, button: null, container: null};
    const cont = missioncontainers[i];
    retelem.container = cont;
    if (cont.children.length !== 5) { alert(errmsg); return; }
    const timehtml = cont.children[0];
    const btnaccept = cont.children[1];
    const progressbarcontainer = cont.children[2];
    const btnfinishpay = cont.children[3];
    const btnreward = cont.children[4];
    
    if (cont.children.length !== 5) { console.error(cont.children); alert(errmsg); return; }
    if(btnaccept.getAttribute('rel') !== 'mission_start') {
      console.error(errmsg+1 + 'wrong accept_rel:', btnaccept); return; }
    if(btnfinishpay.getAttribute('rel') !== 'finish') {
      console.error( errmsg+2+ 'wrong pay_rel:', btnfinishpay); return; }
    if(btnreward.getAttribute('rel') !== 'claim') {
      console.error( errmsg+3 + 'wrong reward_rel:', btnreward); return; }
    
    if (btnaccept.style.display !== 'none') {
      if(btnaccept.childNodes.length !== 1) { console.error('wrong childrens of btnaccept', btnaccept); return; }
      retelem.status = 'to accept';
      retelem.time = timeparse(timehtml.innerText);
      retelem.button = btnaccept; }
    ////
    if (btnfinishpay.style.display !== 'none') {
      retelem.status = 'accepted';
      retelem.time = 1*60;
      retelem.button = btnfinishpay; }
    if (btnreward.style.display !== 'none') {
      retelem.status = 'completed';
      retelem.time = -1;
      retelem.button = btnreward; }
    if (retelem.button && !retelem.button.disabled) retarr.push(retelem);
  }
  retarr.sort((e1, e2) => { return e1.time - e2.time; });
  return retarr;
}

function timeparse(str) {
  let sec = 0;
  let matches = str.match(/([0-9]+|[a-z]+)/gm);
  pe(matches.length % 2 !== 0, 'datetime matches should be even (time and timeunit):' + str);
  for (let i = 0; i+1 < matches.length; i+=2) {
    switch(matches[i+1]){
      default: pe(true, 'unexpected timeunit:'+matches[i+1]+' inside:'+str); break;
      case 'hr': case 'h': sec += matches[i] * 60*60; break;
      case 'min': case 'm': sec += matches[i] * 60; break;
      case 'sec': case 's': sec += +matches[i]; break;
    }
  }
    return sec;
}
//////
function exception(message) {
  console.log("Exception occurred:");
  console.trace(message);
}

function p(obj, printobjects) {
  console.log(obj);
  if (Array.isArray(printobjects)) {
    console.log("Additional data (" + printobjects.length + "):");
    for (var i = 0; i < printobjects.length; i++) {
      console.log(printobjects[i]);
    }
  } else {
    if (
      printobjects !== undefined &&
      printobjects !== null &&
      isObject(printobjects)
    ) {
      console.log("Additional data (object):");
      console.log(printobjects);
    } else console.log("Additional data (simpleVal):" + printobjects);
  }
}
function pif(b, obj, printobjects) {
  if (b) p(obj, printobjects);
}

function pe(condition, message, printobjects) {
  return assert(!condition, message, printobjects);
}

function po(str, obj) {
  if (obj === undefined) return p(str + ": undefined");
  if (obj === null) return p(str + ": null");
  if (Array.isArray(str)) return pa(str, obj);
  return p(str + ": " + JSON.stringify(obj));
}

function pa(str, arr) {
  if (arr === undefined) return p((str += ": undefined"));
  if (arr === null) return p((str += ": null"));
  if (!Array.isArray(str)) return po(str, arr);
  if (arr.length === 0) return p(str + ": Array empty []");
  str += ": [" + arr[0];
  for (var i = 1; i < arr.length; i++) {
    str += ", " + arr[i];
  }
  return p((str += "]"));
}

function assert(condition, message, printobjects) {
  if (condition) return;
  p(message, printobjects);
  exception(message);
  alert(message);
}

function error(condition, message, printobjects) {
  assert(!condition, message, printobjects);
}

function float(string) {
  return float.parse(string);
}
