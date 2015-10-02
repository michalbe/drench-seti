var request = require('request');
var url = 'http://127.0.0.1:3000';
var id = Math.random().toString().split('.')[1];
var sequence;
var batches;
var time = new Date();

var getNewBatches = function(){
  request.post(
    url,
    { form: { id: id, action: 'gimme'} },
    function (error, response, body) {
      run(JSON.parse(body));
    }
  );
};

var colors = 6;
var sizeX = 8;
var sizeY = 8;
var sizeCell = 35;
var board = [];
var moves = 0;
var cachedBoard = {};

var board = [
	[1,3,0,2,1,0,0,0],
	[0,3,1,1,2,2,1,0],
	[3,1,3,4,3,1,1,2],
	[0,3,4,3,3,3,2,1],
	[0,6,5,3,1,4,5,1],
	[5,0,6,5,4,1,4,0],
	[0,6,5,6,5,1,3,1],
	[0,0,0,1,0,3,6,0],
];

// var board = [
// 	[0, 0, 0],
// 	[0, 3, 3],
// 	[3, 3, 3]
// ];

cachedBoard = JSON.parse(JSON.stringify(board));

var colors = [
	'rgb(255,255,255)',
	'rgb(254,202,8)',
	'rgb(248,162,40)',
	'rgb(18,148,223)',
	'rgb(16,129,199)',
	'rgb(234,47,29)',
	'rgb(229,19,25)',
];

function destColor (color) {
	moves++;
	color = parseInt(color, 10);
	checkedSquares = [];
	checkElement(0, 0, checkColor(0, 0), color);
}

function checkWinningConditions() {
	var win = true;
	var winningColor = board[0][0];
	for (var j = 0; j < board.length; j++) {
	  for (var i = 0; i < board.length; i++) {
	    if (parseInt([board[j][i]], 10) !== winningColor) {
				win = false;
			}
	  }
  }

	return win;
}

function checkColor (x, y) {
	sourceColor = board[y][x];
	return parseInt(sourceColor, 10);
}

var checkedSquares = [];

function checkElement(x, y, sourceColor, destColor) {
	if (checkedSquares.indexOf(x + '-' + y) > -1) {
		return;
	}

	checkedSquares.push(x + '-' + y);

	if ((x === 0 && y === 0) || checkColor(x, y) === sourceColor) {
		updateElement(x, y, destColor);

		// W neighbour
		if (x > 0) {
			// console.log('W');
			checkElement(x-1, y, sourceColor, destColor);
		}

		// N neighbour
		if (y > 0) {
			// console.log('N');
			checkElement(x, y-1, sourceColor, destColor);
		}

		// E neighbour
		if (x < board.length-1) {
			// console.log('E');
			checkElement(x+1, y, sourceColor, destColor);
		}

		// S neighbour
		if (y < board[0].length-1) {
			// console.log('S');
			checkElement(x, y+1, sourceColor, destColor);
		}
	}
}


function updateElement(x, y, color) {
	board[y][x] = color;
}

var currentMove = 0;
var maxMoves = 16;
var sequence;

var autoPlay = function() {
	destColor(sequence[currentMove]);

	if (!checkWinningConditions()) {
		if (currentMove !== maxMoves-1) {
			// jestem w trakcie gry
			currentMove++;
      setImmediate(autoPlay);
		} else {
      //postMessage({"win":0,"sequence":sequence,"moves":currentMove});
      if (batches.length === 0) {
        var newTime = new Date();
        request.post(
          url,
          { form: { id: id, action: 'done', sequence: sequence, time: newTime - time} },
          function (error, response, body) {
            run(JSON.parse(body));
          }
        );
      } else {
        // koniec gry ale jeszcze mam bacze
        currentMove = 0;
        moves = 0;
        board = JSON.parse(JSON.stringify(cachedBoard));
        sequence = batches.pop();
        setImmediate(autoPlay);
      }
		}
	} else {
		//wygralem!!
		console.log('wygralem!');
		currentMove++;
    // tu wygrałem
    request.post(
      url,
      { form: { id: id, action: 'win', sequence: sequence} },
      function (error, response, body) {
        run(JSON.parse(body));
      }
    );
	}
};
//
// onmessage = function(e){
//   sequence = e.data[0];
//   autoPlay();
// };

var run = function(data){
  batches = data;
  sequence = batches.pop();
  time = new Date();
  autoPlay();
};

getNewBatches();
