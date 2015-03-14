// server.js

var express = require('express'),
	app = express();

app.set('port', (process.env.PORT || 8000));

app.get('/', function(req, res) {
	res.send('You\'ve reached a Node server.');
});

app.get('feedback', function(req, res) {
	res.send('feedback');
});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '...');
});