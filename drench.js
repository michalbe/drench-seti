
var colors = 6;
var sizeX = 8;
var sizeY = 8;
var sizeCell = 35;
var board = [];
var moves = 0;

var generateBoard = function(){
	for (var j = 0; j < sizeX; j++) {
		board[j] = [];
	  for (var i = 0; i < sizeY; i++) {
			board[j][i] = ~~(Math.random()*7);
		}
	}
};


var colors = [
	'rgb(255,255,255)',
	'rgb(254,202,8)',
	'rgb(248,162,40)',
	'rgb(18,148,223)',
	'rgb(16,129,199)',
	'rgb(234,47,29)',
	'rgb(229,19,25)',
];

function draw () {
  var canvas = document.getElementById('canvas');
	canvas.width = sizeX * sizeCell;
	canvas.height = sizeY * sizeCell;
  var ctx = canvas.getContext('2d');
  for (var j = 0; j < board.length; j++) {
	  for (var i = 0; i < board.length; i++) {

	    ctx.fillStyle = colors[board[j][i]];

	    ctx.fillRect (i*sizeCell, j*sizeCell, sizeCell, sizeCell);
	  }
  }
}

function setUpClickHandlers () {
	var forEach = Array.prototype.forEach;
	var buttons = document.querySelectorAll("button");

	forEach.call(buttons, function(button) {
		button.addEventListener('click', destColor ,false);
	});
}


function destColor (evt) {
	moves++;
	document.querySelector('#moves span').textContent = moves;
	checkedSquares = [];
	var color = evt.target.getAttribute('data-color');
	checkElement(0, 0, checkColor(0, 0), parseInt(color, 10));
	draw();
}

function checkWinningConditions(){
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
	//console.log('coords', x, y, 'color', color);
	board[y][x] = color;
}

generateBoard();
setUpClickHandlers();
draw();
var lowest = 9999;
var highest = 0;
var games = 0;

var timeout;
var autoPlay = function(){
	var buttons = document.querySelectorAll('button');
	var button = buttons[~~(Math.random()*buttons.length)];
	button.click();
	if (!checkWinningConditions()) {
		timeout = setTimeout(autoPlay, 1);
	} else {
		games++;
		if (moves < lowest) {
			lowest = moves;
			moves = '<span style="color: #f00">' + moves + '</span>';
			console.log('Lowest:', lowest);
		} else if (moves > highest) {
			highest = moves;
			moves = '<span style="color: #00f">' + moves + '</span>';
			console.log('Highest:', highest);
		}
		document.querySelector('#moves div').textContent = games;

		document.getElementById('history').innerHTML += moves + ', ';
		document.getElementById('history').scrollTop = 100000;
		moves = 0;
		generateBoard();
		draw();
		autoPlay();
	}
};
