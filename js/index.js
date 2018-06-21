window.onload = function() {
  var table = buildGridOverlay();
  cellCreator(2, 0);
  directions();
  timer();
};

//-----------------------GENERATE GRID------------------------------------------
function buildGridOverlay() {
  var game = document.getElementsByClassName('game');
  var grid = document.getElementsByClassName('field');
  var size = 4;
  var table = document.createElement('DIV');
  var instructs = document.getElementById('mainInstruct').addEventListener('click', function(e) {
    instructions();
  });
  var instructs = document.getElementById('resetButton').addEventListener('click', function(e) {
    reset();
  });
  var instructs = document.getElementById('startButton').addEventListener('click', function(e) {
    start();
  });

  table.className += 'grid';
  table.id = '';
  table.dataset.value = 0;

  for (var i = 0; i < size; i++) {
    var tr = document.createElement('DIV');
    table.appendChild(tr); //TR IS NOW A CHILD OF TABLE
    tr.id = 'row_' + (i + 1);
    tr.className += 'grid_row';

    for (var j = 0; j < size; j++) {
      var td = document.createElement('DIV');
      td.id = '' + (i + 1) + (j + 1); //THE ID GETS x & y
      td.className += 'grid_cell';
      tr.appendChild(td);
    }
    document.body.appendChild(table);
  }
  return table;
}
//------------------------------TILE CREATOR------------------------------------
function cellCreator(c, timeOut) {
  /* do 2 times for 2 new tiles */
  for (var i = 0; i < c; i++) {

    var count = 0;
    /* search for an empty cell to create a tile */

    for (var value = 1; value < 2; value++) {
      var randomX = Math.floor((Math.random() * 4) + 1);
      var randomY = Math.floor((Math.random() * 4) + 1);
      var checker = document.getElementById('' + randomX + randomY);
      if (checker.innerHTML != '') {
        value = 0;
      }
    }

    var randomValue = Math.floor((Math.random() * 4) + 1); //create value 1, 2, 3 or 4
    if (randomValue == 3) {
      randomValue = 4
    }; //3 --> 4
    if (randomValue == 1) {
      randomValue = 2
    }; //1 --> 2
    var position = document.getElementById('' + randomX + randomY);
    var tile = document.createElement('DIV'); //CREATES A DIV AT x, y
    position.appendChild(tile);
    tile.innerHTML = '' + randomValue; //TILE GETS THE VALUES 2, 4

    colors(randomValue, tile); // COLORS ON GENERATION
    tile.data = '' + randomValue;
    tile.id = 'tile_' + randomX + randomY;
    position.className += ' active';
    var tileValue = tile.dataset.value;
    tile.dataset.value = '' + randomValue;

    if (timeOut == 0) {
      tile.className = 'tile ' + randomValue;
    } else {
      setTimeout(function() {
        tile.className = 'tile ' + randomValue;
      }, 10);
    }
  }
}

//-----------------------MOVE TILES---------------------------------------------
document.onkeydown = directions;

function directions(event) {
  event = event || window.event;

  // ----- KEY UP ----- //
  if (event.which == '38') {
    var count = 2;

    for (var x = 2; x > 1; x--) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(x, y, -1, 0, 1, 0);
      }
      if (x == 2) {
        x += count;
        count++;
      }
      if (count > 4) {
        break;
      }
    }
    resetCell();
  }

  // ----- KEY DOWN ----- //
  else if (event.which == '40') { // down
    var count = -2;

    for (var x = 3; x < 4; x++) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(x, y, 1, 0, 4, 0);
      }
      if (x == 3) {
        x += count;
        count--;
      }
      if (count < -4) {
        break;
      }
    }
    resetCell();
  }

  // ----- KEY LEFT ----- //
  else if (event.which == '37') { // left

    var count = 2;
    var test = 1;
    for (var x = 2; x > 1; x--) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(y, x, 0, -1, 0, 1);
      }
      if (x == 2) {
        x += count;
        count++;
      }
      if (count > 4) {
        break;
      }
    }
    resetCell();
  }

  // ----- KEY RIGHT ----- //
  else if (event.which == '39') { // right

    var count = -2;

    for (var x = 3; x < 4; x++) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(y, x, 0, 1, 0, 4);
      }
      if (x == 3) {
        x += count;
        count--;
      }
      if (count < -4) {
        break;
      }
    }
    resetCell();
  }
}
//--------------------------------------------------------

function moveTilesMain(x, y, X, Y, xBorder, yBorder) {

  var tile = document.getElementById('tile_' + x + y);
  var checker = document.getElementById('' + x + y);
  var xAround = x + X;
  var yAround = y + Y;

  if (xAround > 0 && xAround < 5 && yAround > 0 && yAround < 5 && checker.className == 'grid_cell active') {
    var around = document.getElementById('' + xAround + yAround);

    //------------MERGING-----------------------------------------------------------

    if (around.className == 'grid_cell active') { //
      // CATCHING
      var aroundTile = document.getElementById('tile_' + xAround + yAround);
      if (aroundTile.innerHTML == tile.innerHTML) {
        // SAME
        var value = tile.dataset.value * 2; //HOW MUCH SHOULD WE TIMES THE VALUE BY
        aroundTile.dataset.value = '' + value; // THE UNKNOWN VALUE * 2
        aroundTile.className = 'tile ' + value;
        aroundTile.innerHTML = '' + value;
        colors(value, aroundTile); //COLORS FOR WHEN THE TILES MERGE
        checker.removeChild(tile); // REMOVE ONE OF THE TILES
        checker.className = 'grid_cell';
        around.className = 'grid_cell active merged'; //NEW NAME FOR AROUND WHEN MERGED
        // document.getElementsByClassName('grid').id = 'moved';
        // document.getElementsByClassName('grid').className = 'grid ' + value;
        var grid = document.getElementById('');
      }
    } else if (around.className == 'grid_cell') {
      //not catching
      around.appendChild(tile);
      around.className = 'grid_cell active';
      tile.id = 'tile_' + xAround + yAround;
      checker.className = 'grid_cell';
      document.getElementsByClassName('grid').id = 'moved';
    }
  }
}

//------------------------------------------------------------------------------
function resetCell() {
  var count = 0;
  var a = document.getElementsByClassName('grid').id;
  console.log(a);

  for (var x = 1; x < 5; x++) {
    for (var y = 1; y < 5; y++) {

      var resetting = document.getElementById('' + x + y);
      if (resetting.innerHTML != '') {
        count++;
      }

      if (resetting.innerHTML == '') {
        resetting.className = 'grid_cell';
      }

      if (resetting.className == 'grid_cell active merged') {
        resetting.className = 'grid_cell active'
      }
    }
  }
  if (count === 16) {
    alert('you lose');
  } else if (document.getElementsByClassName('grid')) {
    cellCreator(1);
  }
  document.getElementsByClassName('grid').id = '';
}

//------------------------------------------------------------------------------

//-----------STYLE
function colors(value, tile) { //TAKES IN THE VALUES AND TILE TO CONVERT COLOR
  switch (value) {
    case 2:
      tile.style.background = '#fbfced';
      tile.style.color = 'black';
      break;
    case 4:
      tile.style.background = '#ecefc6';
      tile.style.color = 'black';
      break;
    case 8:
      tile.style.background = '#ffb296';
      tile.style.color = 'black';
      break;
    case 16:
      tile.style.background = '#ff7373';
      tile.style.color = 'black';
      break;
    case 32:
      tile.style.background = '#f6546a';
      tile.style.color = 'black';
      break;
    case 64:
      tile.style.background = '#8b0000';
      tile.style.color = 'black';
      break;
    case 64:
      tile.style.background = '#8b0000';
      tile.style.color = 'black';
      break;
  }
}
//-------------BUTTONS-------------------------

function instructions() {
  var x = document.getElementById("description");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function reset() { //CHECKS GRID THEN REMOVES THE TILES
  for (var x = 1; x < 5; x++) {
    for (var y = 1; y < 5; y++) {
      var resetting = document.getElementById('' + x + y);
      if (resetting.className == 'grid_cell active') {
        var tile = document.getElementById('tile_' + x + y);
        resetting.removeChild(tile);
      }
    }
  }
  resetCell(); // RESETS THE CELLS FROM PREVIOUS GAME
  cellCreator(1, 0); // INSERTS NEW CELLS

}

function start() {

}

function timer() {
  for (var i = 0; i < 1000; i++) {
    setTimeout(function() {
      console.log(i);
    })(i), (i * 1000);
  }
}



function score() {

  var grid = document.getElementById('');
  var value = grid.dataset.value;
  document.getElementById('value').innerHTML = ''+value;
}
score();
console.log(score);
