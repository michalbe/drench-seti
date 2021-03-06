var maxMoves = 16;
var sequence = '0301051643025310';
var games = 10000;
var reg = /(.)\1/i;
var batchesToKeep = 10;
var numbersToRegenerate = 100000;
var batches = [];
var unfinishedBatches = {};
var unfinishedBatchesTimers = {};
var unfinishedBatchesTimeout = 1000 * 60 * 10; // 10 min

var http = require('http');
var querystring = require('querystring');

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

var generateBatch = function() {
  var output = [];
  var numbersToGenerate = numbersToRegenerate;

  while(numbersToGenerate--) {
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
    }
    output.push(sequence);
  }

  return output;
};

var addBatchToUnfinished = function(batch, id){
	unfinishedBatches[id] = batch;
	clearTimeout(unfinishedBatchesTimers[id]);
	unfinishedBatchesTimers[id] = setTimeout(function(){
		var t = (unfinishedBatchesTimeout/1000).toPrecision(2);
		console.log('Client nr ' + id + ' doesn\'t respond for last ' + t + 's. Pushing it\'s batch back');
		batches.unshift(JSON.parse(unfinishedBatches[id]));
		delete unfinishedBatches[id];
	}, unfinishedBatchesTimeout);
};
console.log('Generating numbers.');
while (batchesToKeep--) {
  console.log(batchesToKeep+1 + ' to go');
  batches.push(generateBatch());
}


var server = http.createServer( function(req, res) {
	var b;
  if (req.method === 'POST') {
    var body = '';
    res.writeHead(200, {'Content-Type': 'text/html'});
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var resp = querystring.parse(body);
        if (resp.action === 'gimme') {
          console.log('new slave');
          // generate new batch
          console.log('Sending new batch to client nr', resp.id);
					b = JSON.stringify(batches.shift());
          res.end(b);
					addBatchToUnfinished(b, resp.id);
          batches.push(generateBatch());
        } else if (resp.action === 'done') {
          games += numbersToRegenerate;
          var time = resp.time/1000;
          console.log(
            'Client ' + resp.id + ' finished. Sequence: ' +
            resp.sequence + '. Games: ' + games + '. Time: ' + time + 's.');
          console.log('Sending new batch to client nr', resp.id);
					b = JSON.stringify(batches.shift());
          res.end(b);
					addBatchToUnfinished(b, resp.id);
          batches.push(generateBatch());
        } else if (resp.action === 'win') {
          console.log('WIN! Sequence: ' + resp.sequence);
          process.exit();
        }
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Up & running. </br>Games: ' + games + '. Sequence ' + sequence);
  }
});

port = 3000;
host = '127.0.0.1';
server.listen(port, host);
console.log('server running on ' + host + ':' + port);
