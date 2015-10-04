var request = require('request');
var game = require('./game-logic');

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

var currentMove = 0;
var maxMoves = 16;
var sequence;

var autoPlay = function() {
	game.useColor(sequence[currentMove]);

	if (!game.checkWinningConditions()) {
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
        game.resetBoard();
        sequence = batches.pop();
        game.setSequence(sequence);
        setImmediate(autoPlay);
      }
		}
	} else {
		//wygralem!!
		currentMove++;
    console.log('DONE!');
    console.log('Won in ' + currentMove + ' moves. Winning sequence: ' + sequence);
    request.post(
      url,
      { form: { id: id, action: 'win', sequence: sequence} },
      function (error, response, body) {
        run(JSON.parse(body));
      }
    );
	}
};

var run = function(data){
  batches = data;
  sequence = batches.pop();
  game.setSequence(sequence);
  time = new Date();
  autoPlay();
};

getNewBatches();
