// server.js

var express = require('express'),
	app = express();

app.set('port', (process.env.PORT || 8000));

app.get('/', function(req, res) {
	res.send('Hi Nevil');
});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '...');
});