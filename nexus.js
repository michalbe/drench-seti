var maxMoves = 16;
var sequence = '0301051643025310';
var games = 1000;
var reg = /(.)\1/i;
var batchesToKeep = 2;
var numbersToGegenerate = 1000;
var batches = [];

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
  var numbersToGenerate = numbersToGegenerate;

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

console.log('Generating numbers.');
while (batchesToKeep--) {
  console.log(batchesToKeep+1 + ' to go');
  batches.push(generateBatch());
}


var server = http.createServer( function(req, res) {
  if (req.method === 'POST') {
    console.log('new slave');
    var body = '';
    res.writeHead(200, {'Content-Type': 'text/html'});
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var resp = querystring.parse(body);
        if (resp.action === 'gimme') {
          console.log('Sending new batch to client nr', resp.id);
          res.end(JSON.stringify(batches[0]));
        } else if (resp.action === 'done') {
          console.log('done');
        }
    });
    // TU LOGIGA GENEROWANIA NOWEGO BATCHA
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Up & running. </br>Games: ' + games + '. Sequence ' + sequence);
  }
});

port = 3000;
host = '127.0.0.1';
server.listen(port, host);
console.log('server running on ' + host + ':' + port);
