var request = require('request');
var id = Math.random().toString().split('.')[1];
request.post(
  'http://127.0.0.1:3000',
  { form: { id: id, action: 'gimme'} },
  function (error, response, body) {
    console.log('body: ', body);
  }
);
