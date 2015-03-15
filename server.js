// server.js

// module dependencies
var express = require('express'),
	bodyParser = require('body-parser'),
	nodemailer = require('nodemailer'),
	Twit = require('twit'),
	app = express();

// nodemailer transporter
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'liven93@gmail.com',
		pass: process.env.EMAIL_PASS
	}
});

// twitter client instance
var T = new Twit({

});

// setting up express app
app.use(bodyParser.urlencoded({ extended: false }));

app.set('port', (process.env.PORT || 8000));

// routes
app.get('/', function(req, res) {
	res.send('You\'ve reached a Node server.');
});

app.get('/feedback', function(req, res) {
	console.log(req.query);
	transporter.sendMail({
		from: 'Noah + Christina ' + req.query.from,
		to: 'nevil@u.northwestern.edu',
		subject: 'Email from We\'re Listening form',
		replyTo: req.query.from,
		text: req.query.text
	}, function(error, info) {
		if (error) {
			console.log(error);
			res.send(error);
		} else {
			console.log(info);
			res.send(info.response);
		}
	});
});

app.get('/tweets', function(req, res) {

});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '...');
});