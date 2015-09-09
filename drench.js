
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
  var ctx = canvas.getContext('2d');
  for (var j = 0; j < board.length; j++) {
	  for (var i = 0; i < board.length; i++) {

	    ctx.fillStyle = colors[board[j][i]];

	    ctx.fillRect (i*35, j*35, 35, 35);
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
	var color = evt.target.getAttribute('data-color');
	checkElement(0, 0, checkColor(0, 0), parseInt(color, 10));
	draw();
}

function checkColor (x, y) {
	sourceColor = board[y][x];
	return parseInt(sourceColor, 10);
}

var checkedSquares = [];

function checkElement(x, y, sourceColor, destColor) {
	if (checkedSquares.indexOf(x + '-' + 'y') > -1) {
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
	console.log('coords', x, y, 'color', color);
	board[y][x] = color;
}

setUpClickHandlers();
draw();
