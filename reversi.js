// reversi.js

/** The state of the game */
var state = {
  turn: 'b',
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'w', 'b', null, null, null],
    [null, null, null, 'b', 'w', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]
}

var ctx;

// Returns a bool depending on if it is on the board or not
function onBoard(x, y){
  if(x >= 0 || x <= 7 || y >= 0 || y <= 7){
    return true;
  }
  else return false;
}

// Gets the possible moves for player
function getLegalMoves() {
  var curr = state.turn;
  var enemy = 'w';
  if(curr === 'w') enemy = 'b'
  for(var y = 0; y < state.board.length; y++){
    for(var x = 0; x < state.board.length; x++){
      if(state.board[y][x] === curr){
        if(state.board[y-1] && state.board[y-1][x-1] === enemy){
          checkMove(x-1, y-1);
        }
        if(state.board[y-1] && state.board[y-1][x] === enemy){
          checkMove(x, y-1);
        }
        if(state.board[y-1] && state.board[y-1][x+1] === enemy){
          checkMove(x+1, y-1);
        }
        if(state.board[y] && state.board[y][x-1]  === enemy){
          checkMove(x-1, y);
        }
        if(state.board[y] && state.board[y][x+1] === enemy){
          checkMove(x+1, y);
        }
        if(state.board[y+1] && state.board[y+1][x-1] === enemy){
          checkMove(x-1, y+1);
        }
        if(state.board[y+1] && state.board[y+1][x] === enemy){
          checkMove(x, y+1);
        }
        if(state.board[y+1] && state.board[y+1][x+1] === enemy){
          checkMove(x+1, y+1);
        }
      }
    }
  }
  checkForVictory();
}

// Checks for valid spot to place possible moves
function checkMove(x, y){
  var curr = state.turn;
  for(var y1 = -1; y1 <= 1; y1++){
    for(var x1 =-1; x1 <=1; x1++){
      if(y1 === 0 && x1 === 0) continue;
        var moveY1 = y + y1;
        var moveX1 = x + x1;
        if(moveX1 < 0 || moveX1 >= 8 || moveY1 < 0 || moveY1 >= 8) break;
        var cell = state.board[moveY1][moveX1];
        if(cell === null || cell === 'move'){
          if(cell !== curr){
            state.board[moveY1][moveX1] = 'move';
          }
        }
    }
  }
}

// Checks to see if the game is over and who won
function checkForVictory() {
  var wCount = 0;
  var bCount = 0;
  for(var y = 0; y < state.board.length; y++){
    for(var x = 0; x < state.board.length; x++){
      if(state.board[y][x] === 'move') return;
      if(state.board[y][x] === 'b') bCount++;
      else if(state.board[y][x] === 'w') wCount++;
    }
  }
  var message = document.getElementById('currPlayer');
  if(wCount > bCount){
    message.innerHTML = "White player won with " + wCount + " pieces";
  }
  else if(bCount > wCount){
    message.innerHTML = "Black player won with " + bCount + " pieces";
  }
  else message.innerHTML = "Tie both players have 32 pieces";
}


// Changes the turn of player and prints to screen
function nextTurn() {
  if(state.turn === 'b') state.turn = 'w';
  else state.turn = 'b';

  var currPlayer = document.getElementById('currPlayer');
  if(state.turn === 'b'){
    currPlayer.innerHTML = 'Move: Black'
  }
  else currPlayer.innerHTML = 'Move: White';
  getLegalMoves();
}

//Creates pieces and colors them based on player or move
function renderPiece(piece, x, y) {
  ctx.beginPath();
  if(state.board[y][x].charAt(0) === 'w') {
    ctx.fillStyle = '#fff';
  }
  else if(state.board[y][x].charAt(0) === 'b'){
    ctx.fillStyle = '#000';
  }
  else ctx.fillStyle = 'rgba(211,211,211, 0.2)';
  ctx.arc(x*100+50, y*100+50, 40, 0, Math.PI * 2);
  ctx.fill();
}


// Renders the entire game board
function renderBoard() {
  if(!ctx) return;
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      ctx.beginPath();
      ctx.rect(x * 100, y * 100, 100, 100);
      ctx.fillStyle = 'green';
      ctx.strokeStyle = 'brown';
      ctx.fill();
      ctx.stroke();
      if(state.board[y][x]) {
      renderPiece(state.board[y][x], x, y);
      }
      ctx.closePath();
    }
  }
}

// Handles a mouse click event
function handleMouseDown(event){
  if(!ctx) return;
  var x = Math.floor(event.clientX / 50);
  var y =  Math.floor(event.clientY / 50);
  if(!onBoard(x, y)) return;
  if(state.board[y][x] && state.board[y][x] === 'move'){
    capturePiece(x, y, -1, -1);
    capturePiece(x, y, -1, 0);
    capturePiece(x, y, -1, 1);
    capturePiece(x, y, 0, -1);
    capturePiece(x, y, 0, 1);
    capturePiece(x, y, 1, -1);
    capturePiece(x, y, 1, 0);
    capturePiece(x, y, 1, 1);
    clearMove();
    nextTurn();
    renderBoard();
  }
}

// Clears the possible moves from the board
function clearMove(){
  for(var y; y < 8; y++){
    for(var x; x < 8; x++){
      if(state.board[y][x] === 'move'){
        state.board[y][x] = null;
      }
    }
  }
}

// Changes pieces captured to apporiate color
function capturePiece(x, y, nextX, nextY){
  var curr = state.turn;
  var enemy = 'b';
  if(curr === 'b') enemy = 'w';

  if(!state.board[y + nextY] || !state.board[y + nextY][x + nextX]) return false;
  if(state.board[y + nextY][x + nextX] === null) return false;
  if(state.board[y + nextY][x + nextX] === curr){
    state.board[y][x] = curr;
    return true;
  }
  else if(capturePiece(x + nextX, y + nextY, nextX, nextY)){
    state.board[y][x] = curr;
    return true;
  }
}

// Starts the game
function setup() {
  var canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  canvas.onmousedown = handleMouseDown;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  var info = document.createElement('div');
  info.id = 'currPlayer';
  info.innerHTML = 'Move: Black';
  document.body.appendChild(info);
  getLegalMoves();
  renderBoard();
}

setup();
