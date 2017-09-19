// checkers.js

/** The state of the game */
var state = {
  action: 'idle',
  over: false,
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
  ],
  captures: {w: 0, b: 0}
}

var ctx;

/** @function getLegalMoves
  * returns a list of legal moves for the specified
  * piece to make.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings.
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
  * @returns {Array} the legal moves as an array of objects.
  */
function getLegalMoves(piece, x, y) {
  var moves = [];
  switch(piece) {
    case 'b':

      break;
    case 'w':

      break;
  }
  return moves;
}

function check(piece, x, y){
  var checked = false;

  for(var i = -1; i <= 1; i++){}
}


/** @function ApplyMove
  * A function to apply the selected move to the game
  * @param {object} move - the move to apply.
  */
function applyMove(x, y, move) {
  // TODO: Apply the move
  if(move.type === "slide") {
    state.board[move.y][move.x] = state.board[y][x];
    state.board[y][x] = null;
  } else {
    move.captures.forEach(function(square){
      var piece = state.board[square.y][square.x];
      state.captures[piece.substring(0,1)]++;
      state.board[square.y][square.x] = null;
    });
    var index = move.landings.length - 1;
    state.board[move.landings[index].y][move.landings[index].x] = state.board[y][x];
    state.board[y][x] = null;
  }
}

/** @function checkForVictory
  * Checks to see if a victory has been actived
  * (All peices of one color have been captured)
  * @return {String} one of three values:
  * "White wins", "Black wins", or null, if neither
  * has yet won.
  */
function checkForVictory() {
  for(var y = 0; y < 8; y++){
    for(var x = 0; x < 8; x++){
      if(state.board[y][x].charAt(0) === 'w') state.captures.w++;
      else state.captures.b++;
    }
  }

  if(state.captures.w === 0 || state.captures.b === 0 || state.captures.w + state.captures.b === 64){
    if(state.captures.w > state.captures.w){
      alert("White Wins!");
    }
    else alert("Black Wins!");
    //reset();
  }

  return null;
}

/** @function nextTurn()
  * Starts the next turn by changing the
  * turn property of state.
  */
function nextTurn() {
  if(state.turn === 'b') state.turn = 'w';
  else state.turn = 'b';
}

/** @function renderChecker
  * Renders a checker at the specified position
  */
function renderChecker(piece, x, y) {
  ctx.beginPath();
  if(state.board[y][x].charAt(0) === 'w') {
    ctx.fillStyle = '#fff';
  } else {
    ctx.fillStyle = '#000';
  }
  ctx.arc(x*100+50, y*100+50, 40, 0, Math.PI * 2);
  ctx.fill();
}


/** @function renderBoard()
  * Renders the entire game board.
  */
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
      ctx.closePath();
      if(state.board[y][x]) {
        renderChecker(state.board[y][x], x, y);
      }
    }
  }
}

function boardPosition(x, y) {
  var boardX = Math.floor(x / 50);
  var boardY = Math.floor(y / 50);
  return {x: boardX, y: boardY}
}

function handleMouseDown(event) {
  var position = boardPosition(event.clientX, event.clientY);
  var x = position.x;
  var y = position.y;
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  // Make sure we're over the current player
  if(state.board[y][x] && state.board[y][x].charAt(0) === state.turn) {
    // pick up piece
    state.movingPiece = {
      piece: state.board[y][x],
      startPosition: {x: x, y: y},
      currentPosition: boardPosition(event.clientX,event.clientY)
    }
    state.action = "dragging";
    state.board[y][x] = null;
    renderBoard();
  }
}

function handleMouseUp(event) {
  if(state.action !== 'dragging') return;
  var position = boardPosition(event.clientX, event.clientY);
  var x = position.x;
  var y = position.y;
  if(x < 0 || y < 0 || x > 7 || y > 7) {
    // Release off board; rubberband back to startPosition
    var sx = state.movingPiece.startPosition.x;
    var sy = state.movingPiece.startPosition.y;
    state.board[sy][sx] = state.movingPiece.piece;
    state.movingPiece = null;
    state.action = "idle";
    renderBoard();
    return;
  };
  // If the drop is part of a legal move...
  if(true) {
    var lx = state.movingPiece.currentPosition.x;
    var ly = state.movingPiece.currentPosition.y;
    state.board[ly][lx] = state.movingPiece.piece;
    state.movingPiece = null;
    state.action = "idle";
    renderBoard();
    return;
  }
}

function renderDragging() {
  renderBoard();

  // Render our ghost checker
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(
    state.movingPiece.startPosition.x*100+50,
    state.movingPiece.startPosition.y*100+50,
    40, 0, Math.PI * 2
  );
  ctx.fill();

  // Render our moving checker
  ctx.strokeStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(
    state.movingPiece.currentPosition.x*100+50,
    state.movingPiece.currentPosition.y*100+50,
    40, 0, Math.PI * 2
  );
  ctx.stroke();

}

function handleMouseMove(event) {
  renderBoard();
  switch(state.action) {
    case 'idle':
      hoverOverChecker(event);
      break;
    case 'dragging':
      state.movingPiece.currentPosition =
        boardPosition(event.clientX, event.clientY);
      renderDragging();
      break;
  }
}

/** @function hoverOverChecker
  * Event handler for when a player is deciding
  * where to move.
  */
function hoverOverChecker(event) {
  // Make sure we have a canvas context to render to
  if(!ctx) return;
  var x = Math.floor(event.clientX / 50);
  var y = Math.floor(event.clientY / 50);
  // Adjust for scrolling
  // Avoid array out-of-bounds issues.
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  // Make sure we're over the current player
  if(state.board[y][x] && state.board[y][x].charAt(0) === state.turn) {
    // Highlight the checker to move
    ctx.strokeWidth = 15;
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x*100+50, y*100+50, 40, 0, Math.PI * 2);
    ctx.stroke();
    // TODO: Highlight possible moves
  }
}

function setup() {
  var canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  canvas.onmousedown = handleMouseDown;
  canvas.onmouseup = handleMouseUp;
  canvas.onmousemove = handleMouseMove;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  renderBoard();
}

setup();
