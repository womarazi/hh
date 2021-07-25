function collect(){
 console.log('collectLoop', $('.theChestButtons').trigger('click'));
}
setInterval(collect, 1000);

class _wGemBoard{
 // gem;// Gem[8][8]
  constructor(isClone = false){
    this.boardSelector = '.matchField > .cells-container.matchFieldCells';
    this.gemSelector = this.boardSelector + ' .m3-pic.theGem';
    this.gem = [];               
    if (!this.isClone){
      let gems = document.querySelectorAll(this.gemSelector);
      gems = [...gems].map( (g, i) => new _wGem(this, g, i));
    }
  }
  duplicate() {
    const board = new _wGemBoard(true);
    board.gem = board.gem.map(g=>g.duplicate());
  }
  addGem(gem){
    if(!this.gem[gem.x]) this.gem[gem.x] = [];
    this.gem[gem.x][gem.y] = gem;
    gem.board = this;
  }
  calculateSwapScores(){
   
   let board = document.querySelector(this.boardSelector);
   let xdirections = ['l', 'c', 'r'], ydirections = ['t', 'c', 'b'];
   let directions = [];
   for (let xdir of xdirections) for (let ydir of ydirections) directions.push('.'+ xdir + ydir);
   [...board.querySelectorAll(directions.join(', '))].forEach( (e, i) => e.classList.remove.apply(e.classList, directions));
   
    for(let x = 0; x < 7; x++){
      for(let y = 0; y < 7; y++){
        // simulo swap right e bottom di tutti
        this.gem[x][y].simulateSwap(this.gem[x][y+1]);
        this.gem[x][y].simulateSwap(this.gem[x+1][y]);
      }
    }
  }
}
const knownGems = {R:{color: 'red'}, G:{color: 'green'}, B:{color: 'blue'}, W:{color: 'orange'}, O:{color: 'yellow'}, M:{color:'sphere'}, Ice:{color:'ice'}, P:{color:'purple'}};
const Color = {red: 'red', green:'green', blue: 'blue', orange:'orange', yellow:'yellow', purple: 'purple'};
class _wGem{
  // html;
  // board;
  constructor(board, html, indexSbagliato){
    if (html){ // if not html is constructor for clone
    this.board = board;
    this.html = html;
    this.i = html.dataset.id - 1;
    if (!html.dataset.id) console.warn('wrong id index:', {html, indexSbagliato});
    this.x = this.i%8;
    this.y = Math.floor(this.i/8);
    this.isRed = html.classList.contains('gemR') ? 1 : 0;
    this.isGreen = html.classList.contains('gemG') ? 2 : 0;
    this.isBlue = html.classList.contains('gemB') ? 4 : 0;
    this.isOrange = html.classList.contains('gemW') ? 8 : 0;
    this.isYellow = html.classList.contains('gemO') ? 16 : 0;
    this.isPurple = html.classList.contains('gemP') ? 32 : 0; 
 
    // missing [32, ...512] left just in case
    this.isSphere = html.classList.contains('gemM') ? 1024 : 0;
    this.isIce = !![...this.html.parentElement.children].filter( e => e.classList.contains('mIce')).length ? 2048 : 0;
    this.colorBinary = this.isRed + this.isGreen + this.isBlue + this.isOrange + this.isYellow + this.isPurple + this.isSphere + this.isIce;
    if (this.isRed) this.color = Color.red;
    if (this.isGreen) this.color = Color.green;
    if (this.isBlue) this.color = Color.blue;
    if (this.isOrange) this.color = Color.orange;
    if (this.isYellow) this.color = Color.yellow;
    if (this.isPurple) this.color = Color.purple;
    if (!this.color) console.error('unrecognized gem color:', this, html);
    console.log('board:', board, this);
    board.addGem(this); }
  }

  doSwap(other) {
   let x = this.x;
   let y = this.y;
   this.x = other.x;
   this.y = other.y;
   other.x = x;
   other.y = y;
   this.board.gem[this.x][this.y] = this;
   this.board.gem[other.x][other.y] = other; }

 canSwap(other, mark = true){
   this.doSwap(other);
   let ret = false;
   if (this.isInMatch()) {
     ret = true;
     this.html.classList.add( this.getRelativeDirection(other) );
   }
  if (other.isInMatch()) {
     ret = true;
     other.html.classList.add( other.getRelativeDirection(this) );
  }
   this.doSwap(other);
   return ret; }

 getRelativeDirection(other){
  let ret = '?';
  if (this.x < other.x) ret = 'l';
  else if (this.x == other.x) ret = 'c';
  else if (this.x > other.x) ret = 'r';
  if (this.y < other.y) ret += 't';
  else if (this.y == other.y) ret += 'c';
  else if (this.y > other.y) ret += 'b';
  return ret;
 }

 isInMatch(){
   // NB: una delle gemme vicine è questa stessa gemma ancora nella sua posizione originale invece che il vicino a cui si sta sostituendo, ma è corretto comunque. può far parte del tris solo se sono stesso colore e allora non cambia quale delle 2 uso nel confronto.
   if (this.isIce) return false;
   let leftFit1 = false, rightFit1 = false;
   const board = this.board.gem;
   console.log({board});
   const x = this.x;
   const y = this.y;
   this.html.removeAttribute('data-swappablewith');
    if (board[x-1] && board[x-1][y].color === this.color) {
      if (board[x-2] && board[x-2][y].color === this.color) {
       this.html.dataset.swappablewith = 'ooX';
       console.log('swappable ooX', [board[x-1][y], board[x-2][y], this]);
       return true; }
      leftFit1 = true;
    }
    if (board[x+1] && board[x+1][y].color === this.color) {
      // Xoo
      if (board[x+2] && board[x+2][y].color === this.color) {
       this.html.dataset.swappablewith = 'Xoo';
       console.log('swappable ooX', [this, board[x+1][y], board[x+2][y]]);
       return true; }
      rightFit1 = true;
    }
    // oXo
    if (leftFit1 && rightFit1) {
       this.html.dataset.swappablewith = 'oXo';
       console.log('swappable oXo', [board[x-1][y], this, board[x+1][y]]);
       return true; }

   let topFit1 = false, botFit1 = false;
    if (board[x][y-1] && board[x][y-1].color === this.color) {
      // °°X
      if (board[x][y-2] && board[x][y-2].color === this.color) {
       this.html.dataset.swappablewith = '°°x';
       console.log('swappable °°x', [board[x][y-2], board[x][y-1], this]);
       return true; }
      topFit1 = true;
    }
    if (board[x][y+1] && board[x][y+1].color === this.color) {
      if (board[x][y+2] && board[x][y+2].color === this.color) {
       this.html.dataset.swappablewith = 'X..';
       console.log('swappable X..', [this, board[x][y+1], board[x][y+2]]);
       return true; }
      botFit1 = true;
    }

    if (topFit1 && botFit1) {
       this.html.dataset.swappablewith = '°x.';
       console.log('swappable °x.', [board[x][y-1], this, board[x][y+1]]);
       return true; }
    return false;
  }
  duplicate(){
    new Gem(this.board, this.html, this.i);
  }
  simulateSwap(other){
  if (!this.canSwap(other)) return null;
    return {todo: 'swapscore'};
    const board = this.board.duplicate();
  }
}
function makeButton(container) {
  const btn = document.createElement('button');
  btn.style.width = '30px';
  btn.style.height = '30px';
  btn.style.border = '5px solid black';
  btn.style.backgroundColor = 'white';
  btn.style.borderRadius = '9999px';
  container.append(btn);
  return btn;
}
function calculateMatches(){
  console.log('calcMathces call:', arguments);
  const board = new _wGemBoard();
  const scores = board.calculateSwapScores();
  console.log('swap scores', scores);
}
function _wmain() {
  const buttoncontainer = document.createElement('div');
  buttoncontainer.style.position='absolute';
  buttoncontainer.style.display='inline-flex';
  buttoncontainer.style.zIndex='10000';
  buttoncontainer.style.right='15px';
  
  document.body.append(buttoncontainer);
  const matchbtn = makeButton(buttoncontainer);
  matchbtn.setAttribute('title', "calculate best matches and highlight");
  matchbtn.style.borderColor='green';
  matchbtn.addEventListener("click", calculateMatches);
 
 const style = document.createElement('style');
 style.innerHTML = '._wswappable{ border: 2px solid red;}' +
   '.lt, .lb, .cc, .rt, .rb { border: 4px dotted purple; }' +
   '.ct{ border-top: 2px solid #ff000077; } ' +
   '.cb{ border-bottom: 2px solid #ff000077; }' +
   '.lc{ border-left: 2px solid #ff000077; }' +
   '.rc{ border-right: 2px solid #ff000077; }' +
   '';
 document.body.append(style);
}

document.addEventListener("DOMContentLoaded", _wmain);
