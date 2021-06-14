class _wGemBoard{
 // gem;// Gem[8][8]
  constructor(isClone = false){
    this.gem = [];               
    if (!this.isClone){
      let preselect = '.matchField > .cells-container.matchFieldCells ';
      let gems = document.querySelectorAll(preselect+'.theGem');
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
    for(let x = 0; x < 7; x++){
      for(let y = 0; y < 7; y++){
        // simulo swap right e bottom di tutti
        this.gem[x][y].simulateSwap(this.gem[x][y+1]);
        this.gem[x][y].simulateSwap(this.gem[x+1][y]);
      }
    }
  }
}
const knownGems = {R:{color: 'red'}, G:{color: 'green'}, B:{color: 'blue'}, W:{color: 'orange'}, O:{color: 'yellow'}, M:{color:'sphere'}, Ice:{color:'ice'}};
const Color = {red: 'red', green:'green', blue: 'blue', orange:'orange', yellow:'yellow'};
class _wGem{
  // html;
  // board;
  constructor(board, html, i){
    if (html){ // if not html is constructor for clone
    this.board = board;
    this.html = html;
    this.i = i;
    this.x = i%8;
    this.y = i/8;
    this.isRed = html.classList.contains('gemR') ? 1 : 0;
    this.isGreen = html.classList.contains('gemG') ? 2 : 0;
    this.isBlue = html.classList.contains('gemB') ? 4 : 0;
    this.isOrange = html.classList.contains('gemW') ? 8 : 0;
    this.isYellow = html.classList.contains('gemO') ? 16 : 0;
    // missing [32, ...512] left just in case
    this.isSphere = html.classList.contains('gemM') ? 1024 : 0;
    this.isIce = html.classList.contains('gemIce') ? 2048 : 0;
    this.colorBinary = this.isRed + this.isGreen + this.isBlue + this.isOrange + this.isYellow + this.isSphere + this.isIce;
    if (this.isRed) this.color = Color.Red;
    if (this.isGreen) this.color = Color.green;
    if (this.isBlue) this.color = Color.blue;
    if (this.isOrange) this.color = Color.green;
    if (this.isYellow) this.color = Color.yellow;
    console.log('board:', board, this);
    board.addGem(this); }
  }
  canSwap(other, mark = true){
    const ret = this.couldMoveInto(other.x, other.y) || other.couldMoveInto(this.x, this.y);
    if (mark) { this.html.classList.add('_wswappable'); other.html.classList.add('_wswappable'); }
  }
couldMoveInto(x, y){
  // NB: una delle gemme vicine è questa stessa gemma ancora nella sua posizione originale invece che il vicino a cui si sta sostituendo, ma è corretto comunque. può far parte del tris solo se sono stesso colore e allora non cambia quale delle 2 uso nel confronto.
  if (this.isIce) return false;
  let leftFit1 = false, rightFit1 = false;
  const board = this.board.gem;
  if (board[x-1] && board[x-1][y].color === this.color) {
    // ooX
    if (board[x-2] && board[x-2][y].color === this.color) return true;
    leftFit1 = true;
  }
  if (board[x+1] && board[x+1][y].color === this.color) {
    // Xoo
    if (board[x+2] && board[x+2][y].color === this.color) return true;
    rightFit1 = true;
  }
  // oXo
  if (leftFit1 && rightFit1) return true;
  
  let topFit1 = false, botFit1 = false;
  if (board[x][y-1].color === this.color) {
    // °°X
    if (board[x][y-1].color === this.color) return true;
    topFit1 = true;
  }
  if (board[x][y+1].color === this.color) {
    // X..
    if (board[x][y+2].color === this.color) return true;
    botFit1 = true;
  }
  // °X_
  if (leftFit1 && rightFit1) return true;
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
}
_wmain();
