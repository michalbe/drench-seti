var request = require('request');

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

function draw () {
	return;
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


function destColor (color) {
	moves++;
	color = parseInt(color, 10);
	checkedSquares = [];
	borderBlocks = {};
	checkElement(0, 0, checkColor(0, 0), color);
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
var borderBlocks = {};

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

// setUpClickHandlers();
// draw();
var lowest = 9999;
var highest = 0;
var games = 133170507;
var currentMove = 0;
var maxMoves = 16;
var maxSequence = '0400000000000000';

var makeSeq = function(seq){
	seq = seq.toString();
	while(seq.length < maxMoves) {
		seq = '0' + seq;
	}
	return seq;
};

var nextSeq = function(seq) {
	seq = parseInt(seq, 7);
	seq++;
	return makeSeq(seq.toString(7));
};

var sequence = '0301051643025310';

var reg = /(.)\1/i;
var timeout;
var go = function(){
	var threads = 80;
	while(threads--) {
		autoPlay();
	}
};

var sendmsg = true;

//var http = new XMLHttpRequest();
var url = "https://api.hipchat.com/v2/room/1997965/notification?auth_token=DaDcqDU5mbAXkRWyGGiK6jc1jaoR4lfm4plILicx";
var sendHCMsg = function(msg){
	var a = games;
	setTimeout(function(){
		var gps = games - a;
		msg = msg ||
					'Games: ' 	 				 + games +
				'. Sequence: ' 				 + sequence +
				'. Games per second: ' + gps +
        '. [nodejs client]';

    request.post(
      url,
      { form: { color: 'green',  message_format: 'text', message: msg} },
      function (error, response, body) {}
    );
		//Send the proper header information along with the request
		if (sendmsg) {
			setTimeout(sendHCMsg, 1000 * 60 * 5);
		}
	}, 1000);
};

setTimeout(sendHCMsg, 10000);

var autoPlay = function() {
	destColor(sequence[currentMove]);

	if (!checkWinningConditions()) {
		if (currentMove !== maxMoves-1) {
			// jestem w trakcie gry
			timeout = setTimeout(autoPlay, 1);
			currentMove++;
		} else {
			// zmaksowalem gre
			games++;
			//document.querySelector('#moves div').textContent = games;
			sequence = nextSeq(sequence);
			while(
				reg.test(sequence) ||
				sequence.indexOf('0') === -1 ||
				sequence.indexOf('1') === -1 ||
				sequence.indexOf('2') === -1 ||
				sequence.indexOf('3') === -1 ||
				sequence.indexOf('4') === -1 ||
				sequence.indexOf('5') === -1 ||
				sequence.indexOf('6') === -1
			) {
				sequence = nextSeq(sequence);
				if (sequence === maxSequence) {
					console.log('koncowa sekwencja = ', sequence);
					alert('sprawdzilem wsio');
					return;
				}
			}
			currentMove = 0;
			moves = 0;
			board = JSON.parse(JSON.stringify(cachedBoard));
			//draw();
			autoPlay();
		}
	} else {
		//wygralem!!
		console.log('wygralem!');
		currentMove++;
		console.log('Wygralem w ' + currentMove +
		 ' ruchach. Sekwencja: ' + sequence);

		sendmsg = false;
		sendHCMsg('@all Got it!!! Winning sequence: ' + sequence);
	}
};
go();
