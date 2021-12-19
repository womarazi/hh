console.log("hh.js v1 19/12/2020");
// window.Hero.infos, window.Hero.energies
setTimeout(main0, 500);

function refreshPage(){
  setUrl(document.location.href);
}

///////////////////////////////////////////// new season 2021
// eyes check: console.table(Object.values(getVar('girls')).map(g => {return {name:g.gData.Name, eyes:g.gData.ref.eyes}}).filter(g => g.eyes.toLowerCase().indexOf('silver')>=0))
// zodiac check: console.table(Object.values(getVar('girls')).map(g => {return {name:g.gData.Name, zodiac:g.gData.ref.zodiac}}).filter(g => g.zodiac.toLowerCase().indexOf('sagitt')>=0))
function parseBlessingCondition(str) {
  str = str.toLowerCase();
  switch(str.substr(0, str.indexOf(' '))){
    default: console.error('todo: implement this condition:', {str}); throw new Error('todo: implement this condition:'+str);
    case 'element': return {element: str.substr('element'.length).trim(), str};
    case 'eye': return {eye: str.substr('eye color'.length).trim(), str};
    case 'rarity': return {rarity: str.substr('rarity'.length).trim(), str};
    case 'hair': return {hair: str.substr('hair color'.length).trim(), str};
    case 'favorite': return {position: str.substr('Favorite position'.length).trim(), str};
    case 'zodiac': return {zodiac: str.substr('zodiac sign'.length).trim(), str};
  }
}

function onBlessingClick(delay = 200, count = 0) {
  console.log('onBlessingClick check', {delay, count});
  let success = false;
  if (count > 10*1000/delay) return;
  try { success = parseBlessings(); } catch(e) {
    console.error(e);
    return;
  }
  if (!success) setTimeout(()=>onBlessingClick(delay, count+1), delay);
}

function parseBlessingsSetup(){
  $('#blessings-button').on('click.hhjs', onBlessingClick);
}

function parseBlessings() {
  var $blessinghtml = $('#popup_blessings .blessing.active-blessing:visible');
  let blessings = [];
  if (!$blessinghtml.length) return false;
  if (!$blessinghtml.find('.blessing-timer').length) return false;
  blessings = $blessinghtml.toArray().map( (b) => parseBlessing(b));
  console.log('blessings return:', {blessings, $blessinghtml});
  setVar('blessings', blessings);
  return true; }

function parseBlessing(blessinghtml){
  var $blessinghtml = $(blessinghtml);
  var blessing = {};
  console.log({$blessinghtml, blessinghtml, blessing});
  blessing.time0 = $blessinghtml.find('.blessing-timer')[0].innerText;
  blessing.time = blessing.time0 ? 1000*timeparse(blessing.time0) : null;
  blessing.expiration = blessing.time ? new Date(new Date().getTime() + blessing.time) : null;
  blessing.condition0 = $blessinghtml.find('.blessing-condition')[0].innerText;
  blessing.condition = parseBlessingCondition(blessing.condition0);
  blessing.bonus0 = $blessinghtml.find('.blessing-bonus')[0].innerText
  if(blessing.bonus0.indexOf('%') > 0) {
    blessing.bonus = 1+blessing.bonus0.substr(1).replace('%', '')/100;
  } else throw new Error('unexpected blessing bonus, insert it:', blessing.bonus0);
  // delete blessing.time0; delete blessing.condition0M delete blessing.bonus0;
  return blessing;
}

function validBlessings(blessings = null, canTriggerUpdate = true){
  if (!blessings) blessings = getVar('blessings');
  let expirations = blessings.map( bl => bl.expiration ? new Date(bl.expiration) : null).sort((a,b)=> (!a || !b ? 0 : a.getTime()-b.getTime()));
  if (expirations[0] && expirations[0].getTime() <= new Date().getTime()) {
    if (!canTriggerUpdate) return false;
    HHPopupManager.show("popup_blessings", { prevent_events: true });
    onBlessingClick();
    return false; }
  return true; }

function seasonmain2021Pre(count = 0, delay = 200) {
  var blessings = getVar('blessings');
  console.log('seasonmain2021', {count, delay});
  if (count > 200) return;
  if (!validBlessings(blessings, true)) { setTimeout(() => seasonmain2021Pre(count+1, delay), delay); return; }
  var seasonPlayers = parseSeasonPlayers();
  var you = seasonPlayers[0];
  var opponents = seasonPlayers.slice(1);
  console.log('scoringFunction', {seasonPlayers, you, opponents});
  
  let scoringFunction = getVar('scoringFunction_seasons');
  if (!scoringFunction) {
    scoringFunction = (wr, pt, gxp, aff) => { return wr * (pt * 1 + gxp * 0 + aff * 0); };
    setVar('scoringFunction_seasons', scoringFunction);
  }
  if (scoringFunction + '' === scoringFunction) scoringFunction = eval(scoringFunction);
 
  function getRewards(opponent) {
    var rewards = {};
    opponent.rewards0 = {...opponent.rewards};
    [...opponent.rewards.data.rewards, ...opponent.rewards.data.team].forEach( r => { rewards[r.type] = +r.value.match('[0-9]+')[0]; } );
    opponent.rewards = rewards;
    opponent.rewards.aff = opponent.rewards.affection = opponent.rewards.season_affection_girl;
    opponent.rewards.gxp = opponent.rewards.xp = opponent.rewards.season_xp_girl;
    opponent.rewards.pt = opponent.rewards.pts = opponent.rewards.points = opponent.rewards.victory_points;
 }
  function exportDataToGui(o, i){
    var fightbtn =  $('#season-arena > .opponents_arena > .opponent_perform_button_container > .btn_season_perform')[i];
    var avglv =  $('#season-arena > .opponents_arena > .season_arena_opponent_container .average-lvl')[i];
    console.log('exportDataToGui', {o, i, fightbtn, avglv});
    avglv.innerHTML = 'pt: <b style="color: red">' + o.score.toFixed(2) +
      '</b>, wr: <b style="color:orange">'+ printpercent(o.fight.winrate) +
      '</b>, pts: <b style="color:orange">' + (o.fight.winrate * o.rewards.pt).toFixed(1) + 
      '</b>, gxp: <b style="color:orange">' + (o.fight.winrate * o.rewards.gxp).toFixed(1) +
      '</b>, aff: <b style="color:orange">' + (o.fight.winrate * o.rewards.aff).toFixed(1) + '</b>';
    fightbtn.dataset.hhjsscore = o.score + '';
    fightbtn.dataset.enemyid = o.stats.id_member+'';
  }
  opponents.forEach( (o, i) => {
    getRewards(o);
    o.fight = getWinRatio2021(you, o);
    console.log('scoringFunction(o.fight.winrate, o.rewards.pt, o.rewards.gxp, o.rewards.aff)', {o, scoringFunction});
    o.score = scoringFunction(o.fight.winrate, o.rewards.pt, o.rewards.gxp, o.rewards.aff);
    // exportDataToGui(o, i);
    // huhbhnjmk
    exportDataToGui(o, i);// uyiujo
  });
  return seasonPlayers;
}

function seasonmain2021Run(){
  var $kisses = $('#season_battle_user_block_kiss_energy [energy]:visible');
  if (!+$kisses[0].innerText) { setTimeout(seasonmain2021Run, 61*min); return; }
  var $runbtns = $('#season-arena .btn_season_perform');
  var maxScoreBtn = null;
  var maxScore = 0;
  for (let i = 0; i < $runbtns.length; i++) {
    let runbtn = $runbtns[i];
    console.log('check season scores:', {maxScoreBtn, runbtn, condition1: !maxScoreBtn, condition2: maxScoreBtn?.dataset.hhjsscore < +runbtn.dataset.hhjsscore, cond2str:maxScoreBtn?.dataset.hhjsscore +'<' +runbtn.dataset.hhjsscore});
    if (!maxScoreBtn || +maxScoreBtn.dataset.hhjsscore < +runbtn.dataset.hhjsscore) { maxScoreBtn = runbtn; }
  }
  //setUrl('https://www.hentaiheroes.com' + maxScoreBtn.getAttribute('href'));
  console.log('seasonmain2021run', {maxScoreBtn, maxScore, $runbtns});
  if (+maxScoreBtn.dataset.enemyid > 0) setUrl('https://www.hentaiheroes.com/season-battle.html?id_opponent=' + maxScoreBtn.dataset.enemyid + '&number_of_battles=1');
}

function printpercent(number, digits = 2) { return (number * 100).toFixed(digits) + '%'; }
function getWinRatio2021(you, enemy, tries = 100){
  let results = [];
  for (let i = 0; i < tries; i++) { results[i] = simulateFight2021(you, enemy); }
  var ret = {results};
  ret.winrate = sumArrayByProperty(results, 'win') / results.length;
  ret.leaguepoints = sumArrayByProperty(results, 'points') / results.length;
  return ret;
}

function sumArrayByProperty(arr, key = '') {
  if (!arr || !key) return 0;
  return arr.reduce( (sum/*starts with e1*/, e2, i/*starts from 1*/, fullarr) => i === 1 ? sum[key] + e2[key] : sum + e2[key]);
}

function simulateFight2021(you, enemy){
  var yourhp = you.ego;
  var enemyhp = enemy.ego;
  var yourcrit$ = 0.3 * you.harmony / (you.harmony + enemy.harmony);
  var enemycrit$ = 0.3 * enemy.harmony / (you.harmony + enemy.harmony);
  while(true) { //for (let turn = 0; true; turn++){
    enemyhp -= (you.atk - enemy.def) * (checkRandom(yourcrit$) ? 2 : 1);  
    if (enemyhp <= 0) {
      return { points: 15 + Math.floor(10 * yourhp / you.ego), win: 1 };
    }
    yourhp -= (enemy.atk - you.def) * (checkRandom(yourcrit$) ? 2 : 1);
    if (yourhp <= 0) {
      return { points: 3 + Math.floor(10 * (1 - enemyhp / enemy.ego)), win: 0 };
    }
  }
}

function parseSeasonPlayers() {
  var $playershtml = $('#season-arena .season_arena_block');
  var blessings = getVar('blessings');
  var players = $playershtml.toArray().map((p) => parseSeasonPlayer($(p), blessings));
  return players;
}

var _hhjs_classes = [null, 'hk', 'ch', 'kh'];
function parseSeasonPlayer($player, blessings) {
  var player = {};
  player.girls = ['useless'];
  // for (let i = 0; i < 7; i++) { player.girls[i] = parseSeasonGirl($player, i, blessings); }
  console.log('parseseasonplayer', {player});
  var $stats = $player.find('.hero_stats');
  // player.atk = $stats.find('[hh_title="Attack power"]')[0].innerText.replace(',','')
  console.log('parseSeasonPlayer', {$player, blessings});
  player.stats0 = $stats.find('.cjs_opponent_stats')[0];
  console.log('1', {stats0:player.stats0, player, $player});
  if (player.stats0) { // opponent
    player.stats0 = player.stats0.getAttribute('ca-opponent-stats');
    player.stats = JSON.parse(player.stats0);
  } else {/*
    player.stats0 = $('#player_defence_stat')[0];
    player.stats0 = player.stats0.getAttribute('ca-player-caracs');*/
    var caracs = {};
    caracs.damage = parseNum($stats.find('[carac="damage"]')[0].nextElementSibling.innerText.replaceAll(',', ''));
    caracs.defense = parseNum($stats.find('[carac="def0"]')[0].nextElementSibling.innerText.replaceAll(',', ''));
    caracs.chance = parseNum($stats.find('[carac="chance"]')[0].nextElementSibling.innerText.replaceAll(',', ''));
    caracs.ego = parseNum($stats.find('[carac="ego"]')[0].nextElementSibling.innerText.replaceAll(',', ''));
    player.stats = {name: 'kon', class:null, club: null, level: null, caracs};
  }
  console.log('3', {stats0:player.stats0, player});
  if (!player.stats.caracs) player.stats.caracs = player.stats;
  player.id = player.stats.id_member;
  player.lv = player.stats.level;
  player.mojo = player.stats.mojo;
  player.rewards = {...player.stats.rewards};
  player.girls0 = player.stats.team
  player.hk = player.stats.caracs.carac1;
  player.ch = player.stats.caracs.carac2;
  player.kh=player.stats.caracs.carac3;
  player.atk = player.stats.caracs.damage;
  player.avglv = player.stats.average_team_level;
  player.def = player.stats.caracs.defense;
  player.ego = player.stats.caracs.ego;
  player.endurance = player.stats.caracs.endurance;
  player.type = _hhjs_classes[player.stats.class];
  player.class = player.type;
  player.club = player.stats.club;
  player.harmony = player.stats.caracs.chance || +$stats.find('[hh_title="Harmony"]')[0].innerText.replace(',', '');
  // if (player.club) player.club
  return player; }

function parseSeasonGirl($player, gindex, blessings){
  var $girl = $player.find('[data-team-member-position="'+gindex+'"] img');
  var girl = $girl[0]
  if (!girl) return null;
  var girls = getVar('girls');
  var gid = +girl.getAttribute('src').match('https\:\/\/hh2\.hh\-content\.com\/pictures\/girls\/([0-9]+)\/')[1];
  var gdata0 = girls[gid];
  var gdata = girl.getAttribute('new-girl-tooltip-data');
  if (!gdata) return null;
  gdata = JSON.parse(gdata);
  gdata.class = _hhjs_classes[gdata.class];
  gdata.stats = {hk:gdata.caracs.carac1, ch:gdata.caracs.carac2, kh: gdata.caracs.carac3};
  gdata.stars = (gdata.Graded2.match(/\<g/g) || []).length;
  delete gdata.caracs;
  delete gdata.Graded2;
  gdata.gid = gid;
  console.log('findGirlBonuses blessings', {g: girls[gdata.gid], blessings, gdata});
  gdata.bonuses = findGirlBonuses(girls[gdata.gid], blessings, gdata);
  return gdata;
}

function findGirlBonuses(g, blessings, output = null){
  if (!blessings) blessings = getVar('blessings');
  if (!output) output = g;
  output.bonuses = blessings.map((b) => { return {from: b, applied: doesBonusApply(g, b)}; });
  output.bonus = output.bonuses.reduce( (sum/* or elem1 on first iteration*/, elem2)  => {
    if (typeof sum == 'object') sum = sum.applied ? sum.from.bonus : 0; // nella prima iterazione sum è il primo elemento dell'array, poi è il ritorno della call precedente (numerico)
    return sum + (elem2.applied ? elem2.from.bonus : 0); });
  return output.bonuses; }

function doesBonusApply(g, blessing){
  var ret = doesBonusApply0(g, blessing);
  console.log('doesbonusapply() ? ' + !!ret, {name:g.gData.Name, g, gData: g.gData, blessing});
  return ret;
}
function doesBonusApply0(g, blessing){
  var gData = g.gData;
  console.log('doesbonusapply?()', {g, gData, blessing});
  if (blessing.condition.hair) {
    return gData.ref.hair?.toLowerCase().indexOf(blessing.condition.hair) >= 0;
  }
  if (blessing.condition.zodiac) {
    return gData.ref.zodiac?.toLowerCase().indexOf(blessing.condition.zodiac) >= 0;
  }
  if (blessing.condition.eye) {
    return gData.ref.eyes?.toLowerCase().indexOf(blessing.condition.eye) >= 0;
  }
  if (blessing.condition.rarity) {
    return gData.rarity?.toLowerCase().indexOf(blessing.condition.rarity) >= 0;
  }
  if (blessing.condition.position){
    return gData.position_img?.toLowerCase().indexOf(blessing.condition.position) >= 0;
  }
  if (blessing.condition.element){
    // elementData.flavor // playfyul
    // elementData.type // sun
    return gData.elementData?.flavor.toLowerCase().indexOf(blessing.condition.element) >= 0
      || gData.elementData?.type.toLowerCase().indexOf(blessing.condition.element) >= 0;
  }
}
///////////////////// new season 2021 end
var buttonContainer;
function addKobanAutoButton() {
  let kobanbtn = document.createElement("button");
  buttonContainer.append(kobanbtn);
  kobanbtn.style.borderRadius = "15px";
  kobanbtn.style.width = kobanbtn.style.height = "30px";
  kobanbtn.style.border = "3px solid yellow";
  kobanbtn.style.backgroundColor = canSpendKoban() ? "green" : "red";
  $(kobanbtn).on('click', () => {
    const b = canSpendKoban();
    console.log("useKoban ? ", b, " --> ", !b, !b ? "green" : "red", kobanbtn);
    canSpendKoban(!b);
    kobanbtn.style.backgroundColor == !b ? "green" : "red";
  });
}

var start = document.createElement("button");
var autorun = document.createElement("button");
var autorunp = document.createElement("button");

function canSpendKoban(set = undefined) {
  if (set === undefined) return getVar('koban_'+hhjs_patharray[0]) === 'true';
  setVar('koban_' + hhjs_patharray[0], !!set);
  return set;
}

function clearAllTimeouts() {
  let maxtimer = setTimeout(()=>{}, 0);
  for (let i = 0; i <= maxtimer; i++) {
    clearTimeout(i);
    clearInterval(i);
  }
}
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
  
  const pathArray = window.location.pathname.substring(1).replaceAll('\.html', '').split('/');
  var params = getJsonFromUrl();
  // window.is_cheat_click = () => false;
  $('.tabs > h4').off('click.mainhh').on('click.mainhh', () => { clearAllTimeouts(); setTimeout(hhmain, 100); });
  window.hhjs_patharray = pathArray;
  window.hhjs_params = params;
  
  parseBlessingsSetup();
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
  
  // ri-esegui main se cambia url senza vero refresh
  
  console.log("hhMain url:", pathArray, params);
  switch (pathArray[0]) {
    case "harem":
      let shards = Object.values(girls).filter( (e, i) => !!e.gData.shards ).map( (e, i)=> { return {gid: e.gId, shards: e.gData.shards}; } )
      localStorage.setItem('womarazi_shards', JSON.stringify(shards));
      const girlsArr = Object.values(girls).map(g => {return{...g, animationInstance: undefined}});
      // let girlsNotCyclic = Object.assign({}, girlsArr);
      setVar('girlsarr', girlsArr);
      let girlsMap = {};
      girlsArr.forEach( (val, i, array) => { girlsMap[val.gId] = val; });
      setVar('girls', girlsMap);
      break;
    case "league-battle": window.location.href += ''; break;
    case "change-team": 
      changeTeamSetup();
      break;
    case "troll-pre-battle": {
      const girls = getVar('girls');
      let trollStatus = getVar('trollStatus');
      const trollnum = +params["id_opponent"];
      if (!trollStatus) trollStatus = [];
      if (!trollStatus[trollnum]) trollStatus[trollnum] = {};
      trollStatus[trollnum].ticket = $('.rewards_list [cur="ticket"]')[0]?.innerText;
      trollStatus[trollnum].ymen = $('.rewards_list [cur="soft_currency"]')[0]?.innerText;
      trollStatus[trollnum].orb_m1 = $('.rewards_list [cur="orbs"] .o_m1').length
      let girlshtml = $('.rewards_list .girls_reward')[0];
      let grewards = [];
      if (girlshtml) {
       try { grewards = JSON.parse(girlshtml.dataset.rewards).map(g=>g.id_girl); } catch(e){ console.error(e); }
      }
      trollStatus[trollnum].girls = grewards;
      console.log({trollStatus, trollnum, girlshtml, grewards, girls});
      setVar('trollStatus', trollStatus);
      if (!localStorage.getItem('pageAutorun_troll-pre-battle.html')) break;
      const favBoss = +localStorage.getItem('favBoss');
      if (!getVar('trollStatus')[trollnum].girls.length && trollnum !== favBoss) { break; }
      function fight() {
        setUrl('https://www.hentaiheroes.com/troll-battle.html?number_of_battles=1&id_opponent=' + trollnum);
      }
      
      // if energy ----> Fight!
      if (getFightEnergy()) { fight(); break; }
      // if not energy but kobans  ----> Refill
      if (canSpendKoban()) {
         alert('koban refill todo');
        break;
      }
      // if not energy and not kobans  ----> wait
      setTimeout(()=> refreshPage(), 30*min);
      break; }
      
    case "season-arena": seasonmain2021Pre(); break;
    case "pantheon":
      hhjs_pantheonSetup();
      if (!localStorage.getItem('pageAutorun_pantheon.html')) break;
      hhjs_pantheon();
      break;
    case "pantheon-pre-battle":
      hhjs_pantheonPreBattleSetup();
      console.log('main switch hhjs_pantheonPreBattle', {params, autorun: localStorage.getItem('pageAutorun_pantheon-pre-battle.html')});
      if (!localStorage.getItem('pageAutorun_pantheon-pre-battle.html')) break;
      hhjs_pantheonPreBattle(params);
      break;
    case "pantheon-battle":
      hhjs_pantheonBattleSetup();
      if (!localStorage.getItem('pageAutorun_pantheon-battle.html')) break;
      hhjs_pantheonBattle();
      break;
    case "tower-of-fame":
      towerOfFameSetup();
      break;
    case "pachinko": pachinkoSetup(); break;
    case "club-champion": case "champions":
      championSetup();
    case "shop": shopSetup();
  }
  $startButton = $(start).on("click", hhmain);
  $autorunButton = $(autorun).on("click", autorunClick);
  $pageautorunButton = $(autorunp).on("click", autorunClick);
  autorunClick();
}

function shopMain() {}

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

function makeRunButton(size = 30) {
  var btn = document.createElement("button");
  btn.style.borderRadius = (size/2) + "px";
  btn.style.border = (size/10) + "px solid black";
  btn.style.width = size + "px";
  btn.style.height = size + "px";
  btn.padding = '0px';
  buttonContainer.append(btn);
  return btn;
}
/*
function getvar(name) { return localStorage.getItem(name); }
function setvar(name) { return localStorage.setItem(name); }*/



function hhjs_pantheonSetup(){}
function hhjs_pantheon(){
  const nextFloor = +$('.floor-bgr.floor-current')[0]?.innerText || -1;
  let energy = +$('.energy_counter[type="worship"] [energy]')[0]?.innerText || 0;
  if (energy > 0 && nextFloor > 0) setUrl("https://www.hentaiheroes.com/pantheon-pre-battle.html?id_opponent=" + (nextFloor));
  // if (nextFloor > 0) setUrl("https://www.hentaiheroes.com/pantheon-battle.html?number_of_battles=1&id_opponent=" + ( nextFloor ));
}

function hhjs_pantheonBattleSetup(){ }
function hhjs_pantheonBattle(){
  whenBattleStart(()=>refreshPage());
  setTimeout(()=> refreshPage(), 2.5 * hours); }
function hhjs_pantheonPreBattleSetup(){
}
function hhjs_pantheonPreBattle(params){
  const floor = +params['id_opponent'];
  console.log('hhjs_pantheonPreBattle', {params, floor});
  if (floor > 0) setUrl('https://www.hentaiheroes.com/pantheon-battle.html?number_of_battles=1&id_opponent=' + floor);
}

function shopitemsetup(container) {
  container = container || document.createElement('div');
  buttonContainer.append(container);
  container.style.display = 'flex';
  container.style.maxWidth = '200px';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'space-evenly';
  container.style.marginTop = '15px';
  container.style.marginBottom = '15px';
  let rarities = ["common", "rare", "epic", "legendary", "mythic"];
  let colors = ['#8d8e9f', '#23b56b', '#ffb244', '#9150bf', '#ec0039']; // mythic bg: transparent radial-gradient(closest-side at 50% 50%,#f5a866 0,#ec0039 51%,#9e0e27 100%) 0 0 no-repeat padding-box
  for (let i = 0; i < rarities.length; i++) {
    const rarity = rarities[i];
    const colorOn = colors[i];
    const colorOff = 'black';
    const btn = makeVarButton(container, '_hhjs_equip-' + rarity, 40, false, colorOn, colorOff);
    btn.innerText = rarity[0].toUpperCase(); // as das fdgdf gfd gdf gdf
    btn.style.borderColor = colorOn; // asfasfas gffd
    btn.style.color = btn.style.borderColor;
    btn.style.color = btn.style.backgroundColor === colorOn ? colorOn : colorOff;
    if (i === rarities.length -1) { btn.style.marginBottom = '15px'; }
  }
  container.append(document.createElement('br'));
  for (let i = 1; i <= 16; i++) {
    const btn = makeVarButton(container, '_hhjs_equip-' + i, 40, false);
    btn.style.backgroundImage = 'url(https://hh2.hh-content.com/pictures/misc/items_icons/' + i + ( i === 16 ? '.svg' : '.png') + ')';
    // btn.style.backgroundRepeat = 'round';
    btn.style.backgroundRepeat = 'no-repeat';
    btn.style.backgroundPosition = 'center';
    btn.style.border = 'none'; 
    btn.style.backgroundSize = (i === 16) ? '25px' : '32px';
  }


}

function makeVarButton(container, name, size = 40, colorBorder = false, colorOn = 'green', colorOff='red') {
  const btn = makeRunButton(size);
  let val = eval(localStorage.getItem(name));
  function updateColor(){
    if (colorBorder) btn.style.borderColor = val ? colorOn : colorOff;
    else btn.style.backgroundColor = val ? colorOn : colorOff;
    btn.style.color = btn.style.backgroundColor === colorOn ? colorOn : colorOff;
  }
  $(btn).on('click', () => {
    localStorage.setItem(name, val = !val);
    updateColor();
  });
  if (container) container.append(btn);
  updateColor();
  return btn;
}

function pachinkoSetup() {
  let separator = document.createElement('br');
  buttonContainer.append(separator);
  const size = 40;
  const btnGreat1 = makeRunButton(size);
  const btnGreat10 = makeRunButton(size);
  const btnMythic1 = makeRunButton(size);
  const btnEpic1 = makeRunButton(size);
  const btnEpic10 = makeRunButton(size);
  
  btnGreat1.style.opacity = btnGreat10.style.opacity = btnMythic1.style.opacity = btnEpic1.style.opacity = btnEpic10.style.opacity = '0.5';
  btnGreat1.style.padding = btnGreat10.style.padding = btnMythic1.style.padding = btnEpic1.style.padding = btnEpic10.style.padding = '0px';
  btnGreat1.style.backgroundColor = "lime";
  btnGreat10.style.backgroundColor = "lime";
  btnMythic1.style.backgroundColor = "wheat";
  btnEpic1.style.backgroundColor = "orange";
  btnEpic10.style.backgroundColor = "orange";
  btnGreat1.innerHTML = "G1";
  btnGreat10.innerHTML = "G10"; // uygyugyugigiig  ino
  btnMythic1.innerHTML = "My1";
  btnEpic1.innerHTML = "E1";
  btnEpic10.innerHTML = "E10";
  let separator2 = document.createElement('br');
  const playCounter = document.createElement('input');
  playCounter.style.width = '85%';
  buttonContainer.append(separator2);
  buttonContainer.append(playCounter);
  playCounter.type="number";
  playCounter.value = 10;
  
  function pachinkoPlayStartCommon(btn){
    btn.style.opacity = '1';
    btn.width = btn.height = '60px';
  }
  function pachinkoPlayEndCommon(btn){
    btn.style.opacity = '0.5';
    btn.width = btn.height = '30px';
  }
  function getPlayCount(){ return playCounter.value; }
  function play(selector, button){
    selector += ', ' + selector.replace('orange', 'blue').replace('green', 'blue');
    const count = getPlayCount();
    if (count < 0) return;
    pachinkoPlayStartCommon(button);
    pachinkoPlayloop(count, selector, () => pachinkoPlayEndCommon(button));
  }

  $(btnMythic1).on('click', () => { play('.orange_button_L[play="pachinko5|150|hard_currency"][orbs="1"]', btnMythic1); });
  // $(btnMythic3).on('click', () => { play('.orange_button_L[play="pachinko5|840|hard_currency"][orbs="1"]', btnMythic3); });
  // $(btnMythic6).on('click', () => { play('.orange_button_L[play="pachinko5|1980|hard_currency"][orbs="1"]', btnMythic6); });
  $(btnGreat1).on('click', () => { play('.green_button_L[play*="pachinko1"][nb_games="1"]', btnGreat1); });
  $(btnGreat10).on('click', () => { play('.green_button_L[play*="pachinko1"][nb_games="10"]', btnGreat10); });
  $(btnEpic1).on('click', () => { play('.orange_button_L[play*="pachinko2"][nb_games="1"][orbs="1"]', btnEpic1); });
  $(btnEpic10).on('click', () => { play('.orange_button_L[play*="pachinko2"][nb_games="10"]', btnEpic10); });
  
}

function pachinkoPlayloop(playCounter = 10, buttonselector, onEnd){
    const retry = (place, timeout = 100) => {
        setTimeout(() => { console.log("retry |" + place +"|"); pachinkoPlayloop(playCounter, buttonselector, onEnd); }, timeout);
    }
    var $pachinkoMithyc1 = $(buttonselector);
    var blackScreen = $('#black_screen:visible');
    var $rewardButton = $('#popups #rewards_popup .blue_button_L [confirm_blue_button]:visible');
    var $confirmNoGirlBackground = $('#confirm_pachinko_background:visible');
    if (playCounter == 0 || $confirmNoGirlBackground.length) { console.log('no girls or count off'); onEnd(); return; }
    if (!blackScreen.length && $rewardButton.length) { $rewardButton.trigger('click'); retry("reward accept"); return; }
    $pachinkoMithyc1.trigger('click');
    playCounter--; // astgsdtaar sets rsf sdfgsdf sdgsdgsd
    console.log('btn', $pachinkoMithyc1, 'selector', buttonselector);
    retry("1 game done", 300);
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


function shopSetup(){
  let separator = document.createElement('br');
  buttonContainer.append(separator);
  const size = 40;
  const btnUse = makeRunButton(size);
  const btnBuy = makeRunButton(size);
  const btnSell = makeRunButton(size);
  btnSell.style.backgroundColor = btnBuy.style.opacity = btnUse.style.opacity = '0.99';
  btnSell.style.backgroundColor = btnBuy.style.padding = btnUse.style.padding = '0px';
  btnSell.style.backgroundColor = btnBuy.style.backgroundColor = btnUse.style.backgroundColor = "red";
  
  btnUse.innerHTML = "Use";
  btnBuy.innerHTML = "Buy";
  btnSell.innerHTML = "Sell";
  
  ////////// done creating buttons
  
  const $nativeBtnUse = $('#inventory .blue_text_button[rel="use"]');
  const $nativeBtnBuy = $('#inventory .blue_text_button[rel="buy"]');
  const $nativeBtnSell = $('#inventory .green_text_button[rel="sell"]');
  let usingON = false, buyingOn = false, sellingOn = false;
  let usingTimer = 500, buyTimer = 500, sellTimer = 500;
  // for any category, but only in your inventory if true, or only on shop to buy if false
  function getSelectedItem(myInventory = true) { return $( (myInventory ? '#inventory .inventory_slots' : '#shop') + ' .slot.selected')[0]; } // for item, gift, book, boost... any

  function useItem() {
   console.log('useItem()', usingON, $nativeBtnUse);
    if (!usingON || btnUse.disabled) { btnUse.style.backgroundColor = 'red'; return; }
    btnUse.style.backgroundColor = 'green';
    $nativeBtnUse.trigger('click');
    setTimeout(useItem, usingTimer);
  }
  function buyItem() {
   console.log('buyItem()', buyingOn, $nativeBtnBuy);
    if (!buyingOn || btnBuy.disabled) { btnBuy.style.backgroundColor = 'red'; return; }
    btnBuy.style.backgroundColor = 'green';
    $nativeBtnBuy.trigger('click');
    setTimeout(buyItem, buyTimer);
  }
  let oldSelectedItemInventory = null;
  let failureCounter = 0, failureMax = 20;
  function parseSelectedItem (item){
    const $item = $(item);
    const ret = {type: null};
    const typeurl = $item.find('.stats_icon')[0].src; // hasasfa as sfsfa sa
    let start = typeurl.lastIndexOf('/') + 1;
    let end = typeurl.lastIndexOf('.');
    ret.type = typeurl.substring(start, end);
    ret.rarity = item.getAttribute('rarity');
    return ret; }

  function canBeSelled(parsedItem) {
    console.log('canBeSelled() ? ', parsedItem);
    const byType = eval(localStorage.getItem('_hhjs_equip-' + parsedItem.type));
    const byRarity = eval(localStorage.getItem('_hhjs_equip-' + parsedItem.rarity));
    if (!byType) return false;
    if (!byRarity) return false;
    // todo: by stats
    return true;
  }
  function sellItem() {
   console.log('sellItem()', sellingOn, $nativeBtnSell);
    if (!sellingOn || btnSell.disabled) { btnSell.style.backgroundColor = 'red'; return; }
    btnSell.style.backgroundColor = 'green';
    const selected = getSelectedItem(true);
    if (selected === oldSelectedItemInventory) { if (failureCounter++ > failureMax) refreshPage(); return; }
    oldSelectedItemInventory = selected;
    
    let parseditem = parseSelectedItem(selected);
    if ( canBeSelled(parseditem) ) $nativeBtnSell.trigger('click');
    else {
      let next = selected.nextElementSibling;
      // console.log('sellitem: ', selected, '-->', next);
      if (!next) { btnSell.style.backgroundColor = 'red'; return; }
      $(next).trigger('click'); }
    setTimeout(sellItem, sellTimer);
  }
  function useToggle(){
    usingON = !usingON;
    useItem();
  }
  function buyToggle() {
    buyingOn = !buyingOn;
    buyItem();
  }
  function sellToggle() {
    sellingOn = !sellingOn;
    sellItem();
  }
  $(btnUse).on('click', useToggle);
  $(btnBuy).on('click', buyToggle);
  $(btnSell).on('click', sellToggle);
  window.hhjs_useItem = useItem;
  buttonContainer.append(separator);
  const itemContainer = document.createElement('div');
  buttonContainer.append(itemContainer);
  shopitemsetup(itemContainer);
  const $inventory = $('#inventory .ui-droppable');
  function expandInventory() {
    for (let i = 0; i < $inventory.length; i++) {
      inventory.style.position = 'absolute';
      inventory.style.left = '-45vw';
      inventory.style.top = '-25vh';
      inventory.style.width = '90vw';
      inventory.style.height = '50vh';
      inventory.style.zIndex = '100';
      inventory.style.background = 'gray';
    }
  }
  function collapseInventory() {
    for (let i = 0; i < $inventory.length; i++) {
      inventory.style.removeProperty('position');
      inventory.style.removeProperty('left');
      inventory.style.removeProperty('top');
      inventory.style.removeProperty('width');
      inventory.style.removeProperty('height');
      inventory.style.removeProperty('zIndex');
      inventory.style.removeProperty('background');
      }
  }
  invIsExpand = false;
  function toggleInventory() {
    invIsExpand = !invIsExpand;
    if (invIsExpand) expandInventory(); else collapseInventory();
  }
  $inventory.on('contextmenu', toggleInventory);
}
function championSetup(){
  let separator = document.createElement('br');
  buttonContainer.append(separator);
  const size = 40;
  const btnPicker = makeRunButton(size);
  btnPicker.style.opacity = '0.99';
  btnPicker.style.padding = '0px';
  btnPicker.style.backgroundColor = "wheat";
  btnPicker.innerHTML = "Pick";
  let separator2 = document.createElement('br');
  buttonContainer.append(separator2);
  const scoreFuncString = document.createElement('input');
  const pickScore = document.createElement('input');
  const scorefunckey = '_hhjs_champpick_scorefunction';
  const scorereqkey = 'hhjs_champpick_scorereq';
  let tmp = localStorage.getItem(scorefunckey);
  if (!tmp){
    tmp = '()=> { return g.atk * (1 + 0.5*posebonus) * (1 + 0.5*(g.type == "kh" ? 1 : 0)); }'; // kghiuguyg yuguy guut uyguy uy
    localStorage.setItem(scorefunckey, tmp);
  }
  scoreFuncString.value = tmp;
  let separator3 = document.createElement('br');
  buttonContainer.append(separator3);
  tmp = localStorage.getItem(scorereqkey);
  if (!tmp){
    tmp = '100000000';
    localStorage.setItem(scorereqkey, tmp);
  }
  pickScore.value = tmp;
  buttonContainer.append(btnPicker);
  buttonContainer.append(separator2);
  buttonContainer.append(scoreFuncString);
  buttonContainer.append(pickScore);
  scoreFuncString.type="text";
  pickScore.type="text";
  $(scoreFuncString).on('input', () => { localStorage.setItem(scorefunckey, scoreFuncString.value); });
  $(pickScore).on('input', () => { localStorage.setItem(scorereqkey, pickScore.value); }); // buigiuui kjbo ijb  kj
  $(btnPicker).on('click', ()=> { pickGirls(scoreFuncString, pickScore); });
}

function pickGirls(scoreFuncString, pickScore){
  const $html = $('#contains_all');
  let girlsPicked = $html.find('.girl-box__index.green-tick-icon').length;
  const $startDraft = $html.find('.champions-bottom__draft-box .champions-bottom__draft-team');
  if ($startDraft.length) {
     $startDraft.trigger('click');
     console.log('choose girl interface was not open');
     setTimeout(() => pickGirls(scoreFuncString, pickScore), 1000);
    return;
  }

  let champion = parseChampion($html);
  console.log('parsechamp(', $html, ') = ', champion);
  let c = champion; // viene letto dentro l'eval
  const scoreGirl = (g) => {
    let ret = false;
    let poseBonus = champion.positions.indexOf(g.pose) >= 0 ? 1 : 0;//var da usare nella condizione
    let posebonus = poseBonus;
    console.log('pre eval check girl', c, g, scoreFuncString.value);
    g.score = eval(scoreFuncString.value);
    console.log('mid eval check girl', g.score);
    g.score = g.score();
    console.log('post eval check girl', g.score);
  }
  const isPicked = (g) => {
    return g.$html.find('.girl-box__index.green-tick-icon').length;
  }
  const pickGirl = (g) => {
    if (isPicked(g)) return;
    g.$html.trigger('click');
    g.$html.find('.girl-box__draggable')[0].classList.add('selected');
    g.$html.find('.girl-box__index')[0].classList.add('green-tick-icon');
  }
  const unPickGirl = (g) => {
    if (!isPicked(g)) return;
    g.$html.trigger('click');
    g.$html.find('.girl-box__draggable')[0].classList.remove('selected');
    g.$html.find('.girl-box__index')[0].classList.remove('green-tick-icon');
  }
  function loopDelayed() {
    console.log('loop outer', $html, champion, scoreGirl, pickGirl, unPickGirl, pickScore);
    if (pickGirlloopInner($html, champion, scoreGirl, pickGirl, unPickGirl, pickScore)) { // siufuasi fsfahfas as fas hfsafhosaoafs 
      console.log('pick end!');
      // champion.$confirmbtn.trigger('click'); // ygyu uyggu ygyg ug yugyu gyugyuuygb
      return; }
      champion.$changebtn.trigger('click');
      // setTimeout(loopDelayed, 2000); // uyu guygu fu uyg uygyu
  }
  loopDelayed();
}

function pickGirlloopInner($html, champion, scoreGirl, pickGirl, unPickGirl, pickScore){
  let girls = getChampGirls($html); /// uyguyg uyg yug uyguyg uyg yug u
  for (let girl of girls) { unPickGirl(girl); scoreGirl(girl); }
  girls.sort((g1, g2) => { return g2.score - g1.score;} );
  let pickedarr = [], unpickedarr = [];
  let pickedAvg = 0, unpickedAvg = 0;
  for (let girl of girls) {
    console.log('pickgirlloop', girl.score, '>',  pickScore.value, 'girl:', girl, girls);
    if (pickedarr.length >= 5 || girl.score <= pickScore.value) {
      unpickedarr.push(girl);
      unpickedAvg += girl.score;
      continue; }
    pickGirl(girl);
    pickedarr.push(girl);
    pickedAvg += girl.score;
  }
  pickedAvg /= pickedarr.length;
  unpickedAvg /= unpickedarr.length;
  let minpick = 0.47 * pickedAvg;
  let instapick = 0.67 * pickedAvg - minpick; // da sperimentazione salta fuori che è quasi sempre 48-53% (quindi 45% è malissimo) e 65% è instapick che accetto senza algoritmo.
  let maxTry = 60; // todo, quanti ne hai massimi prima di iniziare. iuhiuh huhuhiih gguygg i
  let tryfactor = (champion.tryleft / maxTry); // gig gigyu fhvj gutcvjyvk
  let pickreq = minpick + instapick * tryfactor;
  let pickAll = unpickedAvg >= pickreq;
  console.log('pick all? ', pickAll, ', pickedAvg:', pickedAvg, ', unpickedAvg:', unpickedAvg, 'pickreq:', pickreq,
              'tryfactor:', tryfactor, 'tryleft:', champion.tryleft, 'minpick', minpick, 'instapick', instapick);
  return pickAll;
}

// return {kind: "kh"|"hk"|"ch", positions: string[], $changebtn: $Button, $confirmbtn: $Button, tryleft: number}
function parseChampion($html) {
  if (!$html) $html = $;
  let champ = {};
  let $htmltop = $html.find('.champions-over__champion-wrapper');
  switch ($htmltop.find('.champion-class[carac]')[0].getAttribute('carac')){
    default: champ.kind = null; break;
    case 1: champ.kind = 'hk'; break;
    case 2: champ.kind = 'ch'; break;
    case 3: champ.kind = 'kh'; break;
  }
  champ.positions = $htmltop.find('.champion-pose').toArray().map( (e) => e.src.substring( "https://hh2.hh-content.com/pictures/design/battle_positions/".length).replace("\.png", ""));
  let $btns = $html.find('.champions-bottom__draft-box');
  champ.$confirmbtn = $btns.find('.champions-bottom__confirm-team');
  champ.$changebtn = $btns.find('.champions-bottom__make-draft');
  champ.tryleft = Number.parseInt(champ.$changebtn[0].getAttribute('hh_title')); // atsdhfstarsdnfgoi se so fs
  return champ; // h fu guygyugnyg uyg uygutfytfhgfygkuhoiu
}

function getChampGirls($html) {
    const $root = $html.find('.champions-middle__girl-selection');
    const $girls = $root.find('.girl-selection__girl-box');
    console.log($root, $girls);
    const arr = $girls.toArray().map( (e) => parseChampionGirl($(e)));
    return arr;
};

function parseChampionGirl($html){
    if (!$html) $html = $;
    const ret = {};
    let tmp = $html.find('[id_girl]')[0];
    ret.id = tmp.getAttribute('id_girl');
    console.log('tmp:', tmp);
    ret.rarity = tmp.firstElementChild.getAttribute('rarity');
    tmp = $html.find('span[carac]')[0].getAttribute('carac');
    switch(+tmp) {
        default: ret.type = '??' + tmp; break;
        case 3: ret.type = 'kh'; break;
        case 2: ret.type = 'ch'; break;
        case 1: ret.type = 'hk'; break;
    }
  tmp = $html.find('[carac="damage"][hh_title]')[0];
  ret.atk = +tmp.getAttribute("hh_title").replaceAll(',', ''); // jyvgyg gyyu guygyj gj
  tmp = $html.find('img.girl-box__pose')[0];
  const start = 'https://hh2.hh-content.com/pictures/design/battle_positions/'.length;
  ret.pose = tmp.src.substring(start).replaceAll('\.png', '');
  ret.$html = $html;
  ret.html = $html[0]; // asofigjsaipogdja ois jriosa
  return ret;
}



class ccGirl {
  type = null; // | 'hk' | 'kh' | 'ch'
  lv = 0;
  attack = 0;
  ego = 0;
  excitement = 0;
  kh = 0; // at current star & lv for league
  hk = 0;
  ch = 0;

  name = '';
  rarity = null; // null | "legendary"
  type = null; // null | 'kh' | 'ch' | 'kh'
  position = 'null'; // indian | suspendedcongress | splittingbamboo | ...
  salary_per_hour = 0;
} // class ccGirl end

class cstage {
  atk = 0;
  hkdef = 0;
  khdef = 0;
  chdef = 0;
  ch = 0;
  hk = 0;
  kh = 0;

deduceMissingData() {
  this.hk = this.hk || 0;
  this.kh = this.kh || 0;
  this.ch = this.ch || 0;
  this.hkdef = this.hkdef || 0;
  this.khdef = this.khdef || 0;
  this.chdef = this.chdef || 0;
  const foundCounterDef = (this.hkdef ? 1 : 0) + (this.khdef ? 1 : 0) + (this.chdef ? 1 : 0);
  const avgDef = (this.hkdef + this.chdef + this.khdef) / foundCounterDef;
  
  const foundCounterStat = (this.hk ? 1 : 0) + (this.kh ? 1 : 0) + (this.ch ? 1 : 0);
  const avgStat = (this.hk + this.ch + this.kh) / foundCounterStat;
  
  
  this.hk = this.hk || avgStat;
  this.kh = this.kh || avgStat;
  this.ch = this.ch || avgStat;
  this.hkdef = this.hkdef || avgDef;
  this.khdef = this.khdef || avgDef;
  this.chdef = this.chdef || avgDef;
}
} // class cstage end

class cCharacter {
  id = 0; // unique hh user id
  name = '';
  club = '';
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
  girlReward = 0;
  guiindex = 0;
  girl1 = new ccGirl();
  girl2 = new ccGirl();
  girl3 = new ccGirl();
  leaguePoints = 0;
  isWeak = 0;
  isBoosted = 0;

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
  //console.log('pg.this:', this, 'status:', mystatus, '     enemy:', enemy, ' status:', enstatus);
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
  // console.log(playerstr, 'deals dmg = judgeBonus * orgasmBonus * hkCrit * mystage.atk - enstage[' + enemy.type + 'def' + '] * enstatus.chshield');
  // console.log(playerstr, 'deals dmg =', dmg, ' = ',  judgeBonus, ' * ', orgasmBonus, ' * ', hkCrit, ' * ', mystage.atk, ' - ', enstage[enemy.type + 'def'], ' * ', enstatus.chshield);
  enstatus.ego -= dmg;
  mystatus.ego += dmg * khHeal;
  let outcomestr = '';
  if (playerstr === 'YOU') outcomestr = 'YOU WON'; else
  if (oppstr === 'YOU') outcomestr = 'YOU LOST !!!'; else outcomestr = ' player lv' + this.lv + ' won';
  if (enstatus.ego <= 0) {
    outcomestr = outcomestr + ' remaining ego:' + mystatus.ego + ' / ' + this.ego +  ' ( ' + (mystatus.ego / this.ego * 100) + '% )'; }
  else { outcomestr = ''; }
  // console.info(oppstr + ' ego: ', (enstatus.ego + dmg) / 1000, 'k - ', dmg / 1000, 'k = ', enstatus.ego / 1000,  'k;      ' + outcomestr);
  
  if (!out || this.you === enemy.you) return; // do not collect statistics
  let outt = this.you ? out.you : out.enemy;
  let dmgkey = ((hkCrit !== 1 ? ' & HK_Crit' : '') + (judgeBonus !== 1 ? ' & Pose' : '') + (gotOrgasm ? ' & Orgasm' : '') + (enstatus.chshield !== 1 ? ' CH_Shield' : '')).substr(2).trim() || 'Base';
  // console.info('outt:', outt, '.stage' + mystatus.stage, outt['stage' + mystatus.stage], '.damages.', dmgkey);
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

function roundFloat(number, decimals = 2) {
  const a = Math.pow(10, decimals);
  return Math.round(number * a) / a;
}
function getScoreFunction(isLeague = true) {
  const key = "myhh_scorefunction_" + (isLeague ? "league" : "season"); // asfasgsdfhgkfsnadsfas
  let expression = localStorage.getItem(key);
  if (!expression) {
    const defaultExpression = isLeague ? "weakness*1000 + points*wr*0 - boosted*1000" : " wr * (mojo + xp * 0)";
    localStorage.setItem(key, defaultExpression);
    expression = defaultExpression; }
  let parameters = isLeague ? "wr=1, points=0, weakness=0, boosted=0" : "mojo=0, xp=0, wr=1"; // asfgdhfdsgadfhjkhgfdgfc
  return eval("(" + parameters + ") => { return " + expression + "; }"); }

function seasonArenaMain() {
  const $allpg = $('#season-arena .season_arena_block');
  if ($allpg.length !== 4) { console.error('arena season character length error', $allpg); return; }
  $allpg.find('.myaddition').remove();
  const $you = $($allpg[0]);
  const $op1 = $($allpg[1]);
  const $op2 = $($allpg[2]);
  const $op3 = $($allpg[3]);
  const $opp = $($op1, $op2, $op3);
  
  const you = new cCharacter();
  const opponents = [new cCharacter(), new cCharacter(), new cCharacter()];
  const all = [you, ...opponents];
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
    const $rewardpt = $pg.find('.slot_victory_points');
    pg.mojoReward = $rewardpt.length && +$rewardpt[0].innerText;
    const rewardptg = $pg.find('.slot_season_xp_girl').last()[0];
    pg.girlExpReward = rewardptg && +rewardptg.lastChild.innerText;
    const pglvhtml = $pg.find('.text_hero_level')[0];
    let str = pglvhtml.innerText.toLowerCase().replace('level', '').replace('lv', '');
    pg.lv = +parseFloat(str);
    pg.ego = +$pg.find('[carac="ego"]')[0].parentElement.innerText.replaceAll(',', '');
    const harmonyhtml = $pg.find('[hh_title="Harmony"] .pull_right')[0];
    pg.harmony = +parseFloat(harmonyhtml.innerText.replaceAll(',', ''));
    let classHtml = $pg.find('[carac^="class"]')[0];
    if (classHtml.getAttribute('carac') === 'class1') { pg.type = 'hk'; }
    if (classHtml.getAttribute('carac') === 'class2') { pg.type = 'ch'; }
    if (classHtml.getAttribute('carac') === 'class3') { pg.type = 'kh'; }
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
    const scorefunction = getScoreFunction();
    pg.prizescore = scorefunction(pg.mojoReward, pg.girlExpReward, winratio);
    pglvhtml.innerHTML ='Lv ' + pg.lv + ' - ' + roundFloat(winratio * 100, 2) + '%<br>'; // WR:
    if (i == 0) continue;
    const newblock = document.createElement('span');
    newblock.style.scale = '0.8';
    newblock.style.border = '2px solid';
    newblock.classList.add('myaddition');
    const cifreDecimali = 1;
    newblock.innerHTML =
      '<div class="slot slot_victory_points" cur="victory_points"><p>' + roundFloat(pg.mojoReward * winratio * 100, cifreDecimali) + '</p></div>' +
      '<div class="slot slot_season_xp_girl"><p>Girl</p><p>' + roundFloat(pg.girlExpReward * winratio * 100, cifreDecimali) + '</p></div>' +
      '<div class="slot slot_season_xp_girl" style="background: goldenrod;"><p>Score</p><p>' +  roundFloat(pg.prizescore * 100, cifreDecimali) + '</p></div>';
    pglvhtml.parentElement.append(newblock) // insertBefore(newblock, pglvhtml.parentElement.lastElementChild);
    harmonyhtml.innerText = pg.harmony + ' | ' + roundFloat(pg.harmonyRatio(you) * 100, cifreDecimali) + '% ';
    let textheader = pglvhtml.parentElement;
    while (textheader && !textheader.classList.contains('center_y')) textheader = textheader.parentElement;
    textheader.style.flexWrap = 'wrap';
  }
  $('.opponents_arena')[0].style.marginTop = '-30px';
  window['allpg'] = all;
  const bestOpponent = opponents.sort((a, b) => b.prizescore - a.prizescore)[0];
  const bestOpponentHtml = $allpg[bestOpponent.guiindex];
  bestOpponentHtml.style.background = '#30601070';
  console.log('season arena script end:', all, $allpg);
  // now autorun mode:
  const battlebutton = $(document).find('.btn_season_perform')[bestOpponent.guiindex - 1];
  const $battlebutton = $(battlebutton);
  console.log('battlebutton: ', battlebutton,  $(document).find('.btn_season_perform'), bestOpponent.guiindex, bestOpponent);
  $battlebutton.text('perforM').trigger('click'); // uydsgoizdsngoxdngosdghodnsgoi adoigd gdfg 
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
  //sdf
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

function popmain() {
  let $popinfo = $('#pop_info');
  // let $completi = $popinfo.find('[pop_id]:has(.pop_thumb_progress_bar:visible)').map( (i, e) => e.getAttribute("pop_id"));
  let times = $('[pop_id].pop_thumb_expanded .pop_thumb_remaining span')
      .map( (i, e) => timeparse(e.innerText));
  let $incompleti = $popinfo.find('[pop_id].pop_thumb_active')
      .map( (i, e) => e.getAttribute("pop_id"));
  console.log('pop main times:', times, '$incom:', $incompleti);
  if ($incompleti.length) {
    console.log('popmain goto: https://www.hentaiheroes.com/activities.html?tab=pop&index=' + $incompleti[0]);
    setUrl('https://www.hentaiheroes.com/activities.html?tab=pop&index=' + $incompleti[0]);
    return;
  }
  console.log('times:', times, ' todo: setta timeout per andare sulla prima pagina popSingle navigando by url');
}

function popSingle(collected = false, retrycount = 0){
  console.log('popSingle() collected:', collected, ' count:', retrycount);
  const $collect = $('#pop .pop_central_part .purple_button_L:visible');
  const retry = () => setTimeout(()=>popSingle(true), 1000, retrycount+1);
  if (retrycount > 5) { pageRefresh(); return; }
  let indexCount = $('[pop_id]').map( (i, e) => e.getAttribute("pop_id"));
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
  // const percent = +$trackbar[0].style.width.replaceAll('\%', '') /100; // tra 0 e 1
  // retrycount = 0;
  // setTimeout(()=>popSingle(true), (timeleft_num * 1 + 1) *1000, retrycount);
  
  let $popinfo = $('#pop_info');
  let $incompleti = $popinfo.find('[pop_id].pop_thumb_active')
      .map( (i, e) => e.getAttribute("pop_id"));
  console.log('pop single next $incom:', $incompleti);
  if ($incompleti.length > 1) {
    console.log('popmain goto: https://www.hentaiheroes.com/activities.html?tab=pop&index=', $incompleti[1], $incompleti);
    setUrl('https://www.hentaiheroes.com/activities.html?tab=pop&index=' + $incompleti[1]);
    return;
  }
  else {
    setUrl("https://www.hentaiheroes.com/activities.html?tab=pop");
  }

}
var sec = 1000;
var min = 60*sec;
var hour = 60*min;

function hhmain() {
  const pathArray = window.location.pathname.substring(1).replaceAll('\.html', '').split('/');
  // window.is_cheat_click = () => false;
  $('.tabs > h4').off('click.mainhh').on('click.mainhh', () => setTimeout(hhmain, 100));
  // ri-esegui main se cambia url senza vero refresh
  
  var params = getJsonFromUrl();
  console.log("hhMain url:", pathArray, params);
  switch (pathArray[0]) {
    case "tower-of-fame":
      towerOfFameMain2021();
      break;
      
    case "quest":
      let $girlupgradepay = $('.grade-complete-button.green_text_button[act="SC"]:visible');
      const isGirlGrade = !!$('#controls[type="grade"]:visible').length;
      const isQuest = !!$('#controls[type="quest"]:visible').length;
      if (isGirlGrade) {
        if ($girlupgradepay.length){
          // upgrade harem girl stars
          $girlupgradepay.trigger('click');
          // setUrl('https://closepagesfsadgfd.com');
          setTimeout( refreshPage, 50);
          return; }
        // re-visit girl page
        // do nothing or // window.close()
      }
      if (isQuest) {
          let energyNextButton = $('#pay:visible'); // it says pay but it's just the "next" with energy button
          // normal quests: todo, remember to avoid picking up sidequest reward
      }
      
      break;
    case "home":
    case "":
    case "hero":
    case "world":
    case "champions-map": break;
      
    case "shop":
      shopMain();
      break;
    case "tower-of-fame":
      // leagues_list: all 101 players, playerLeaguesData: current selected player
      // todo: run hhpp as new hhpp, so i can access local context.
      // todo2: add button to run hhpp
      // here just do fight according to parsed user object
      break;
    case "season-arena":
      // seasonmain2021Pre();
      // if (localStorage.getItem('pageAutorun_season-arena.html') !== 'true') return;
      seasonmain2021Run();
      break;
    case "harem":
      harem0(); break;
    case "activities":
      switch(params["tab"]) {
         default:
            missionmain();
            contestmain();
            console.clear();
            console.log('pop index:', params["index"]);
            if (params["index"] !== undefined) { // window.location.pathname.indexOf('&index=') > 0
               popSingle();
            } else {
               popmain();
            }
            break;
         // case "pop": break;
         // case "missions": break;
         // case "contests": break;
      }
      break;
      
    case "season-battle":
       whenBattleStart(()=>refreshPage());
      setTimeout(refreshPage, 1 * hours);
      break;
    case "troll-battle":{

      const trollnum = params["id_opponent"];
      const trollStatus = getVar('trollStatus');
      const girls = getVar('girls');
      let shardssum = 0;
      let shards = trollStatus[trollnum]?.girls.map( gid => {
        let s = girls[gid] ? girls[gid].gData.shards : 0; // if new girl not yet included in my collection (updated when i open harem)
        s = (s === undefined ? 100 : s); // if a girl have 100 shards it resets the shard counter to undefined.
        shardssum += s;
        return s;
      });
      console.log('troll-battle', {shards, girls, trollnum, trollStatus, energy: getFightEnergy()});
      if (shards.length === shardssum/100){
         throw new MyError('todo: change troll', {shards, shardssum, girls, trollStatus, trollnum});
      }
      if (true || getFightEnergy()) whenBattleStart(()=>refreshPage());
      else {
        // todo: check if use kobans to refill
        setTimeout(()=> refreshPage(), 30*min); }
      
      /*if (params["id_arena"] !== undefined) {
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
      }*/
      break;}
      
    case "arena":
      arenaMain();
      break;
      
    case "champions":
    case "club-champion":
      championmain();
      break;
      
    case "pachinko":
      pachinkoMain();
    default:
      switch(pathArray[1]){
        default: break;
      }

  }
}

var getVarCache = {};
function getVar(name){ 
  if (getVarCache[name]) return getVarCache[name];
  let val = localStorage.getItem('_hhjs_'+name);
  try { val = JSON.parse(val); } catch(e){}
  getVarCache[name] = val;
  return val; }

function setVar(name, val){
  getVarCache[name] = val;
  if (val && typeof val == 'object') val = JSON.stringify(val);
  return localStorage.setItem('_hhjs_'+name, val); }

function getFightEnergy(){
  return +$('.energy_counter[type="fight"] [energy]')[0].innerText;
}
function getQuestEnergy(){
  return +$('.energy_counter[type="quest"] [energy]')[0].innerText;
}

function whenBattleStart(callback, enemyhp = null, count = 0, delay = 200){
  if(!enemyhp) enemyhp = $('.new-battle-hero-ego-initial-bar')[1];
  let myhp = $('.new-battle-hero-ego-initial-bar')[1];
  if(enemyhp?.style.width || myhp?.style.width) return callback();
  if(count > 100) return;
  delay *= 1.05;
  console.log('whenbattlestart check delay', delay, 'count:', count);
  setTimeout(()=>whenBattleStart(callback, enemyhp, count+1, delay), delay);
}

function pachinkoMain() {
  let rewards;
  pachinkoMainOnClick();
  $(window.document).off('wjs.click').on('wjs.click', () => pachinkoMainOnClick);
}

function pachinkoMainOnClick() {
  $(".girls_reward.girl_shards")
           .on('mouseenter',
               () => setTimeout(
                     () => { rewards = $('.rewards_tooltip')[0]; pachinkoshards(); }
             , 100)//timeout
           );//on
  // $(".girls_reward.girl_shards").on('mouseleave', () => setTimeout(()=>{ document.body.append(rewards); }, 100));
}

function MyError(msg, ...args){
  console.error('MyError:', ...(arguments));
  return new Error(msg);
}

function pachinkoshards(){
  console.log('pachinkoshards:'); 
  let shardsstr = localStorage.getItem('womarazi_shards');
  let shardarr = shardsstr && JSON.parse(shardsstr);
  let girlShardMap = {};
  for (let val of shardarr) { girlShardMap[val.gid] = val.shards; }
  const findStr = "pictures/girls/";
  const style = "margin:auto; top:25px; width:100%; color:white; background:#77777777;";
  let totalPendingShards = 0;
  var $pacgirlsimg = $('.rewards_tooltip .girl_ico [src]');
  for (let i = 0; i < $pacgirlsimg.length; i++) {
        const isrc = $pacgirlsimg[i].src;
        let pos = isrc.indexOf(findStr);
        pe(pos == -1, "pachinko main to fix1, girl image path changed");
        var istr = isrc.substring(pos+findStr.length);
        let gid = Number.parseInt(istr);
        pe(!gid, "pachinko main to fix2, girl image path changed");
        const shards = girlShardMap[gid]; // iygiuguihunou
        console.log('gid:', gid, 'istr:', istr); 
        console.log('shards:', shards, 'shardmap:', girlShardMap, 'sarr:', shardarr); 
        if (shards) {
           totalPendingShards += shards;
           $($pacgirlsimg[i].parentElement).append('<div style="position:absolute; ' + style + '">' + shards + '</div>'); // asfdgasgsdfsfasfasf asf wef as fasaaa
        }
  }

  $('.rewards_tooltip').append('<div style="' + style + '">' + totalPendingShards + '</div>');
}

const youruserid = 213108;
function maketoweruserlist(userlist = null) {
  if (!userlist) {
    userlist = {};
    window.userlist = userlist;
    $('#buttonmakeuserlist')[0].style.backgroundColor = 'white';
    userlist[youruserid] = {};
    userlist.length = 1; // manually updated;
    parseTowerUserInfo(userlist[youruserid], $('.player_block'));
    userlist[youruserid].you = true;
    userlist[youruserid].id = youruserid;
  }
  window.userlist = userlist;
  const $leagues = $('#leagues_middle .leagues_table');
  const $idarr = $leagues.find('[sorting_id]:visible');
  let i;
  for (i = 0; i < $idarr.length; i++) { // user list validator
    let userrowhtml = $idarr[i];
    let userid = userrowhtml.getAttribute('sorting_id');
    if (userlist[userid]) continue;
    let challengesLeftStr = userrowhtml.cells[3]?.innerText;
    if (challengesLeftStr === '-' || challengesLeftStr === '3/3') continue;
    $ ($idarr[i]).trigger('click');
    gettoweruserinfo(userid, userlist);
    // temp end, ma restituisco l'oggetto che verrà riempito.
    return userlist; }
  // real end
  localStorage.setItem('_hhtowerlist', JSON.stringify(userlist) );
  return userlist; }

function parseNum(str){
    str = str.toLowerCase();
    let num = parseFloat(str);
    if (str.indexOf('k') > 0) return num*1000;
    if (str.indexOf('m') > 0) return num*1000*1000;
    return num; }

function parseTowerUserInfo(pg, $userinfo) {
  pg.name = $userinfo.find('.title')[0].innerText;
  pg.club = $userinfo.find('.clubs_title')[0].innerText;
  pg.lv = +$userinfo.find('.level')[0].innerText;
  let ishk = $userinfo.find('[carac="class1"]').length ? true : false;
  let isch = $userinfo.find('[carac="class2"]').length ? true : false;
  let iskh = $userinfo.find('[carac="class3"]').length ? true : false;
  pg.type = ishk ? 'hk' : isch ? 'ch' : 'kh'
  let $stat = $userinfo.find('.stats_wrap > .fighter-stats-container');
  pg.ego = parseNum($stat.find('.carac-icon[carac="ego"] + .carac-value')[0].innerText);
  pg.atk = parseNum($stat.find('.carac-icon[carac="damage"] + .carac-value')[0].innerText);
  pg.def = parseNum($stat.find('.carac-icon[carac="def0"] + .carac-value')[0].innerText);
  pg.harmony = parseNum($stat.find('.carac-icon[carac="chance"] + .carac-value')[0].innerText);
}

function gettoweruserinfo(userid, userList, timeout = 200, msecwaiting = 0, singleupdate = false, you = null) {
  let $userinfo = $('#leagues_right');
  let tmp;
  
  tmp = $userinfo.find('.avatar_border > img')[0].getAttribute('onclick');
  if (msecwaiting > 3000) {
    userList.complete = false;
    localStorage.setItem('_hhtowerlist', userList);
    refreshPage(); return; }
  if (tmp !== 'hero_page_popup({ id: ' + userid + ' })') {
    msecwaiting += timeout;
    setTimeout(() => { gettoweruserinfo(userid, userList, timeout, msecwaiting)}, timeout);
    return; };
  const pg = new cCharacter();
  const oldpg = JSON.parse(JSON.stringify(userList[userid] || {}));
  userList[userid] = pg;
  if (!+userList.length) userList.length = 0; // dizionario ma con length arraylike tenuta manualmente.
  userList.length+=1;
  pg.id = userid;
  parseTowerUserInfo(pg, $userinfo);
  pg.you = false;
  // console.log('debuggg', userList[userid], $userinfo, $userinfo.find('.lead_ego'));
  // userList['error']['error']['error'] = 'error';

  // pg.pureEgo = ...
  /*
  pg.stage1.hk = parseNum($stat.find('[carac="1"]')[0].nextSibling.innerText);
  pg.stage1.ch = parseNum($stat.find('[carac="2"]')[0].nextSibling.innerText);
  pg.stage1.kh = parseNum($stat.find('[carac="3"]')[0].nextSibling.innerText);
  pg.stage1.hkdef = parseNum($stat.find('[carac="def1"]')[0].nextSibling.innerText);
  pg.stage1.chdef = parseNum($stat.find('[carac="def2"]')[0].nextSibling.innerText);
  pg.stage1.khdef = parseNum($stat.find('[carac="def3"]')[0].nextSibling.innerText);
  pg.stage1.atk = parseNum($stat.find('[carac="damage"]')[0].nextSibling.innerText);*/
  
  // pg.excitement = parseNum($stat.find('[carac="excit"]')[0].nextSibling.innerText);
  pg.win = $userinfo.find('.challenge .result.won').length;
  pg.loses = $userinfo.find('.challenge .result.lost').length;
  pg.fought = userList[userid].win + userList[userid].loses;
    
  oldpg.winratio = pg.winratio = null;
  oldpg.prizescore = pg.prizescore = null;
  const isChanged = JSON.stringify(oldpg) !== JSON.stringify(pg);
  
  const winratio = you ? you.winratio(pg) : 1;
  const scorefunction = getScoreFunction();
  console.log("scorefunction", scorefunction);
  // parameters: "mojo=0, xp=0, wr=1" : "wr=1, points=0, weakness=0, boosted=0";
  pg.prizescore = scorefunction(winratio || 0, pg.leaguePoints || 0, pg.isWeak || 0, pg.isBoosted || 0);//fghujidfghghjk
  pg.winratio = winratio;
  
  const updateAll = !singleupdate; // || (isChanged && pg.fought !== 3);
  if (!updateAll) return isChanged;
  maketoweruserlist(userList);
  return isChanged;
}

function replaceCharAt(string, index, replacestr) {
  if (index < 1 || index === null || index === undefined || isNaN(+index)) return string;
  return string.substr(0, +index) + replacestr + string.substr(index + 1); }

function calcGirlStatMaxGradeLv1(g, blessings) {
  if (!g.gData.caracs) return; // girl not owned
  var out = {};
  g.maxGradeLv1 = out;
  var gData = g.gData;
  var maxGrade = +gData.nb_grades;
  var grade = +gData.graded;
  
  var stat0 = {}, statmax = {}, statmaxbless = {};
  var statcurrent = {hk:gData.caracs.carac1, ch: gData.caracs.carac2, kh: gData.caracs.carac3};
  out.debug = {grade, maxGrade, statcurrent, stat0};
  out.debug['at'+maxGrade+'stars'] = statmax;
  out.debug.statmaxbless = statmaxbless;
  out.debug.g = g;
  
  stat0.multiplier = (1 + 0.3 * grade);
  statmax.multiplier = (1 + 0.3 * maxGrade);
  
  statcurrent.sum = statcurrent.hk + statcurrent.ch + statcurrent.kh;
  // statcurrent already include blessing bonus
  var bonusmultiplier = g.bonus || 1;
  stat0.hk = statcurrent.hk / gData.level / stat0.multiplier / bonusmultiplier;
  stat0.ch = statcurrent.ch / gData.level / stat0.multiplier / bonusmultiplier;
  stat0.kh = statcurrent.kh / gData.level / stat0.multiplier / bonusmultiplier;
  stat0.sum = stat0.hk + stat0.ch + stat0.kh;
  statmax.hk = stat0.hk * statmax.multiplier;
  statmax.ch = stat0.ch * statmax.multiplier;
  statmax.kh = stat0.kh * statmax.multiplier;
  statmax.sum = statmax.hk + statmax.ch + statmax.kh;
  
  if (isNaN(statmax.sum)) { console.warn('calg girl stat error1:', {out, gData, g, maxGrade, grade}); return; }
  findGirlBonuses(g, blessings);
  statmaxbless.hk = statmax.hk * bonusmultiplier;
  statmaxbless.ch = statmax.ch * bonusmultiplier;
  statmaxbless.kh = statmax.kh * bonusmultiplier;
  statmaxbless.sum = statmaxbless.hk + statmaxbless.ch + statmaxbless.kh;
  
  out.hk = statmaxbless.hk;
  out.ch = statmaxbless.ch;
  out.kh = statmaxbless.kh;
  out.sum = statmaxbless.sum;
  if (isNaN(out.sum)) console.warn('calg girl stat error2:', {out, gData, g, maxGrade, grade});
  // console.log('calcGirlStatMaxGradeLv1 ', {gData, blessings, g});
}

function setHexagonNavigationClick() {
  $('.hero-team .team-member-container').on('dblclick', (e) => {
    var gid = e.currentTarget.dataset.girlId;
    window.location = 'https://www.hentaiheroes.com/shop.html?type=potion&girl=' + gid;
  });
}

function changeTeamSetup(){
  const buttonOthers = document.createElement('button');
  const buttonBest = document.createElement('button');
  const buttonBlessed = document.createElement('button');
  const buttonCustom = document.createElement('button');
  const customInput = document.createElement('input');
  const customteamfilter = eval(getVar('customteamfilter'));
  setHexagonNavigationClick();
  function setButtonStyle(btn, varName, onAction, offAction, colorOn = 'green', colorOff = 'red', text = '') {
    buttonContainer.append(btn);
    const isInput = btn.tagName === 'INPUT';
    console.log('setbuttonstyle', {btn, isInput, varName});
    let isOn = getVar(varName);
    if (!isInput) {
      btn.style.border = '2px solid black';
      btn.style.borderRadius = '999px';
      btn.style.width = '30px';
      btn.style.height = '30px';
      btn.innerText = text || varName[0];
    }
    varName = 'teampicker_' + varName;
    function updateStyle() {
      console.log('updateStyle', {btn, isInput, varName});
      if (isInput) return;
      btn.style.backgroundColor = isOn ? colorOn : colorOff;
    }
    updateStyle();
    if(!isInput) $(btn).off('click').on('click', () => {
      if (colorOn === colorOff) isOn = false; else isOn = !isOn; // pulsante azione pura invece di pulsante booleano, only "do" on demand
      setVar(varName, isOn);
      updateStyle();
      if (isOn) onAction && onAction(); else offAction && offAction();
    });
    if (isInput) $(btn).on('input', () => {
      console.log('setbuttonstyle triggered oninput', {isInput, varName});
      setVar(varName, btn.value);
      onAction && onAction();
    });
  }
  buttonContainer.append(document.createElement('br'));
  function sortgui(girls) {
    var $container = $('.harem-panel-girls');
    var $girls =  $container.find('.harem-girl-container');
    var $levels = $girls.find('.text_girl_level');
    var container = $container[0], girlsnode;
    var nodeidmap = {}, levelmap = {};
    for (var i = 0; i < $girls.length; i++) {
      var girlh = $girls[i];
      var lvh = $levels[i];
      var gid = girlh.getAttribute('id_girl');
      nodeidmap[gid] = girlh;
      levelmap[gid] = lvh;
      
    }
    var yourlv = +$('[hero="level"]')[0].innerText;
    for (var g of girls) {
      var node = nodeidmap[g.gId];
      var lvnode = levelmap[g.gId];
      if (lvnode.parentElement != node) { console.error('mismatch girl and lv nodes', {node, lvnode, nodeidmap, levelmap, g, $girls}); throw new Error('lv mismatch'); }
      container.append(node);
      lvnode.innerText = g.maxGradeLv1.sum.toFixed(1) + '/' + (g.maxGradeLv1.sum * yourlv).toFixed(0);
    }
  }
  function othersOn() {}
  function othersOff() {}
  function bestOn() { // sort
    var blessings = getVar('blessings');
    var girls = Object.values(getVar('girls'));
    
    if (!validBlessings(blessings, true)) { setTimeout(() => seasonmain2021Pre(count+1, delay), delay); return; }
    girls.forEach((g)=>calcGirlStatMaxGradeLv1(g, blessings));
    girls = girls.filter(g => !!g.maxGradeLv1).sort( (g1, g2) => g2.maxGradeLv1.sum - g1.maxGradeLv1.sum);
    window.girlsarr = girls;
    window.girls = girls.map(g => { return {name: g.gData.Name, bonus: g.bonus, bonuses: g.bonuses, maxStat: g.maxGradeLv1, currStat: g.gData.caracs}; });
    console.log('sorted girls:', girls);
    sortgui(girls);
  }
  function bestOff() {}
  function customOn() {
    throw new Error('todo custom filter');
  }
  function customOff() {}
  function customInputOn() {/*nothing is fine*/}
  function customInputOff() {/*nothing is fine*/}
  customInput.value = customteamfilter ? customteamfilter.toString() : '';
  setButtonStyle(buttonOthers, 'other', othersOn, othersOff, 'green', 'red');
  setButtonStyle(buttonBest, 'best', bestOn, bestOff);
  setButtonStyle(buttonCustom, 'custom', customOn, customOff, 'green', 'green');
  setButtonStyle(customInput, 'teampick_bestsort', customInputOn, customInputOff);
  let doBest = getVar('teampick_bestsort')
  customInput.value = doBest;
  
  
}

function towerOfFameSetup() {
  const buttonhide = document.createElement('button');
  const buttonch = document.createElement('button');
  const buttonkh = document.createElement('button');
  const buttonhk = document.createElement('button');
  const buttonmakeuserlist = document.createElement('button');
  buttonhide.innerText = '👁';
  buttonch.innerText = 'CH';
  buttonkh.innerText = 'KH';
  buttonhk.innerText = 'HK';
  const buttoncontainer = document.createElement('div');
  buttoncontainer.style.position = 'absolute';
  buttoncontainer.style.top = (40 + 30*2) +'px';
  buttoncontainer.style.right = '0px';
  buttoncontainer.style.zIndex = 1001;
  buttoncontainer.style.backgroundColor = 'gray';
  
  buttonhide.style.margin = buttonmakeuserlist.style.margin = buttonch.style.margin = buttonkh.style.margin = buttonhk.style.margin = '10px';
  buttonhide.style.border = buttonmakeuserlist.style.border = buttonch.style.border = buttonkh.style.border = buttonhk.style.border = '5px solid black';
  buttonhide.style.height = buttonmakeuserlist.style.height = buttonch.style.height = buttonkh.style.height = buttonhk.style.height =
  buttonhide.style.width = buttonmakeuserlist.style.width = buttonch.style.width = buttonkh.style.width = buttonhk.style.width = '30px';
  
  buttonhide.style.padding = buttonmakeuserlist.style.padding = buttonch.style.padding = buttonkh.style.padding = buttonhk.style.padding = '0';
  buttonhide.style.borderRadius = buttonmakeuserlist.style.borderRadius = buttonch.style.borderRadius = buttonkh.style.borderRadius = buttonhk.style.borderRadius = '15px';
  
  
  buttonch.style.borderColor = 'red';
  buttonkh.style.borderColor = 'white';
  buttonhide.style.margin.borderColor = buttonmakeuserlist.style.borderColor = buttonhk.style.borderColor = 'black';
  let dohide = localStorage.getItem('_hhtowerhide') === 'true';
  let doch = localStorage.getItem('_hhtowerch') === 'true';
  let dokh = localStorage.getItem('_hhtowerkh') === 'true';
  let dohk = localStorage.getItem('_hhtowerhk') === 'true';
  buttonhide.style.backgroundColor = dohide ? 'green' : 'white';
  buttonch.style.backgroundColor = doch ? 'green' : 'red';
  buttonkh.style.backgroundColor = dokh ? 'green' : 'red';
  buttonhk.style.backgroundColor = dohk ? 'green' : 'red';
  buttonmakeuserlist.id = 'buttonmakeuserlist';
  buttonhk.id = 'hhjs_buttonhide';
  buttonhk.id = 'buttonhk';
  buttonkh.id = 'buttonkh';
  buttonch.id = 'buttonch';
  buttoncontainer.append(buttonhide);
  buttoncontainer.append(buttonmakeuserlist);
  buttoncontainer.append(buttonch);
  buttoncontainer.append(buttonkh);
  buttoncontainer.append(buttonhk);
  document.body.append(buttoncontainer);
  
  $(buttonhide).on('click', () =>  {
    let $tr = $('#leagues_middle tr[sorting_id]');
    if (buttonmakeuserlist.style.backgroundColor === 'white') {
      buttonmakeuserlist.style.backgroundColor = 'white';
      $('tr[sorting_id]').show();
      return; }
    for (let i = 0; i < $tr.length; i++) {
      if ($tr[0].cells[3].innerText === '3/3');
      $tr[0].style.display = 'none'; }
    buttonmakeuserlist.style.backgroundColor = 'green' ; });

  $(buttonmakeuserlist).on('click', () =>  {
    if (buttonmakeuserlist.style.backgroundColor === 'white') {
      buttonmakeuserlist.style.backgroundColor = 'black';
      localStorage.setItem('_hhtowerlist', null);
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
  if (userlist && (!userlist.complete || userlist.length === $('.leadTable>[sorting_id]:visible').length)) buttonmakeuserlist.style.backgroundColor = 'lightgray';
  
  const selectedUser = $('#leagues_middle').find('.lead_table_default')[0];
  if (!selectedUser) return;
  const selectedid = selectedUser.getAttribute('sorting_id');
  // updates info of the last fought player
  if (userlist[selectedid]) {
    let singleupdate = true;
    let msecwaiting = 0;
    let timeout = 200;
    gettoweruserinfo(selectedid, userlist, timeout, msecwaiting, singleupdate);
    localStorage.setItem('_hhtowerlist', JSON.stringify(userlist));
  }
}

function towerOfFameMain2021(autorefill = true){
  const dokh = $('#buttonkh')[0].style.backgroundColor === 'green';
  const dohk = $('#buttonhk')[0].style.backgroundColor === 'green';
  const doch = $('#buttonch')[0].style.backgroundColor === 'green';
  console.log('toweroffamemainn() ' + (doch? 'ch' : '##') + (dohk? ' hk' : ' ##') + (dokh ? ' kh' : ' ##'));
  const userlistbutton = $('#buttonmakeuserlist')[0];
  // end setup html buttons, start logic
  if (!doch && !dokh && !dohk) return;
  const usekoban = canSpendKoban();
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
    
    console.error('toweroffamemain: userlist invalida resettata per colpa di:' + userid);
    userlist = null;
    localStorage.setItem('_hhtowerlist', null);
    break; }

  if (!userlist) {
    $('#buttonmakeuserlist')[0].style.backgroundColor = 'black';
    return; }

  // actually do fights
  delete userlist.length;
  let sortedUserList = Object.values(userlist);
  const scorefunction = getScoreFunction(true);
  console.log("scorefunction", scorefunction);
  window.scorefunction = scorefunction;
  let you = null;
  
  for (let pg of sortedUserList) if (pg.you) { you = pg; break; }
 
  for (let pg of sortedUserList) {
    // parameters: "mojo=0, xp=0, wr=1" : "wr=1, points=0, weakness=0, boosted=0";
    let simulation = getWinRatio2021(you, pg);
    pg.winratio = simulation.winrate;
    pg.leaguePoints = simulation.leaguepoints;
    pg.prizescore = pg.leaguePoints; //scorefunction(pg.winratio || 0, pg.leaguePoints || 0, pg.isWeak || 0, pg.isBoosted || 0);
  }
  sortedUserList = sortedUserList.filter( (user) => { return !user.you && (user.type == 'ch' && doch || user.type == 'kh' && dokh || user.type == 'hk' && dohk); } );
  sortedUserList = sortedUserList.sort((e1, e2) => { return e1.prizescore - e2.prizescore; });

  console.log('toweroffamemain: sorted userlist:', sortedUserList);
  const rowcontainer = $('.leagues_table')[0];
  function modifyRow(user) {
    const $row = $('[sorting_id="'+user.id+'"]');
    const row = $row[0];
    rowcontainer.append(row);
    console.log('sorting tower of fame rows:', {$row, user});
    $row.find('.nickname')[0].innerText+="| wr:" + user.winratio.toFixed(2), ', score: ' + user.prizescore.toFixed(1);
  }
  for (let user of sortedUserList) {
    modifyRow(user);
    if (+user.fought === 3) {
      // console.log("fought 3 times:", user.fought, user);
      continue; }
    if (!(user.type == 'ch' && doch || user.type == 'kh' && dokh || user.type == 'hk' && dohk)) {
      console.log("wrong type:", user, user.type);
      continue; }
    if (mustStopToRefill()) { console.log("must stop to refill"); return; }
    //setUrl('https://www.hentaiheroes.com/battle.html?league_battle=1&id_member=' + user.id);
    setUrl('https://www.hentaiheroes.com/league-battle.html?number_of_battles=1&id_opponent='+user.id);
    break;
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

function haremCollectLoop(keySorted, i = 1) {
  if($('div.girls_list>div[id_girl]').length === 0) {
    console.log('timeoutHaremLoop 100'); setTimeout(haremCollectLoop, 100); return; }
  var sec = 1000,
    min = 60 * 1000,
    hour = 60 * 60 * 1000;
  var enddelay = 14400 * (1 + Math.pow(myrand(0, 1), 3)) * min; // to restart the collecting after they have regenerated. 14400 cover 57% girls, 28800 cover 97%, both are exact frequent breakpoints
  var bigdelay = myrand(5, 10) * min; // to avoid temporary ban (answer with genric 500) due to too much request rate
  var middelay = myrand(2, 3) * sec; // between "screens" (simulate time to scroll)
  var smalldelay = myrand(0.2, 0.3) * sec; // between 2 consecutive girls
  if (!keySorted) keySorted = sortGirlArr();
  var index = 0;
  for (var key in keySorted) {
    if (++index <= lastIndex) continue;
    var gId = keySorted[key];
    var girl = girls[gId];
    var timeleft = girl.gData.pay_in; // maxwait= pay_time
    if (timeleft === undefined || timeleft === null) continue; //girl not owned.
    if (timeleft === 0 && lastgirlCollected !== gId) {
      const delay = i % 200 === 0 ? bigdelay : (i % (4*5) === 0 ? middelay : smalldelay);
      const delayname = i % 200 === 0 ? "bigdelay" : (i % (4*5) === 0 ? "middelay" : "smalldelay");
      console.log(
        "collect(",
        gId,
        " = ",
        girl.gData.Name,
        "), timeleft:",
        timeleft, 'i:', i,
        " waiting:",
       delay, delayname
      );
      haremCollectGirl(gId);
      lastgirlCollected = gId;
      lastIndex = index;
      setTimeout(function() {
        haremCollectLoop(keySorted, i+1); // astastnsria sararwqasd as
      }, delay);
      return;
    }
  }
  lastIndex = 0;
  //only reached when girl are all ccollected.
  setTimeout(function() {
    haremCollectLoop(keySorted);
  }, enddelay);
}
function haremCollectGirl(id) {
  if (id === null || id === undefined || isNaN(+id)) return;
  var girlsSelector = 'div.girls_list>div[id_girl]>div[girl="' + id + '"]';
  // console.log("$(", girlsSelector, ").trigger('click');");
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
  // console.log("trollFight check troll && girl");
  if (istroll && $girls.length === 0) {
    let favBoss = +localStorage.getItem('favBoss');
    let favurl = "https://www.hentaiheroes.com/battle.html?id_troll="+favBoss;
    let forceFight = localStorage.getItem('forceFight');
    if (forceFight === 'true') { forceFight = true; }
    else if (forceFight === 'false') { farceFight = false; }
    else { forceFight = !!+forceFight; localStorage.setItem('forceFight', false); }
    console.log('forceFight? ', forceFight, document.location.href, favurl);
    if (isNaN(favBoss) || favBoss <= 0) { favBoss = 12; localStorage.setItem('favBoss', favBoss); }
    if (document.location.href !== favurl || !forceFight) { setUrl(favurl); return; }
  }
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

  console.log("trollFight start");
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
  pe (matches.length % 2 !== 0, 'datetime matches should be even (time and timeunit):' + str);
  for (let i = 0; i+1 < matches.length; i+=2) {
    switch(matches[i+1]){
      default: pe(true, 'unexpected timeunit:'+matches[i+1]+' inside:'+str); break;
      case 'w': sec += matches[i] * 60*60*24; break;
      case 'd': sec += matches[i] * 60*60*24; break;
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
  console.trace(message, arguments);
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
