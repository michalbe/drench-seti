
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
		button.addEventListener('click', colorChange ,false);
	})
}


function colorChange (a) {
	console.log(a)
	var color = a.target.getAttribute('data-color');
	console.log(color);
}


setUpClickHandlers();
draw();