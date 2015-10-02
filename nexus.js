var maxMoves = 16;
var sequence = '0301051643025310';
var reg = /(.)\1/i;
var batchesToKeep = 10;
var batches = [];

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

var t = new Date();

var generateBatch = function() {
  var output = [];
  var numbersToGenerate = 1000000;

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

while (batchesToKeep--) {
  console.log(batchesToKeep, 'to go');
  console.log(sequence);
  batches.push(generateBatch());
}

var newT = new Date();
console.log(sequence);
console.log('time', (newT-t)/1000, 's');
