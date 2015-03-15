// server.js

// module dependencies
var express = require('express'),
	bodyParser = require('body-parser'),
	nodemailer = require('nodemailer'),
	insta = require('instagram-node').instagram(),
	request = require('request'),
	app = express();

// nodemailer transporter
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'listenthenlead@gmail.com',
		pass: process.env.EMAIL_PASS
	}
});

// initialize instagram API
insta.use({
	client_id: process.env.INSTA_CLIENT_ID,
	client_secret: process.env.INSTA_CLIENT_SECRET
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
		to: 'listenthenlead@gmail.com',
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

// var redirect_uri = 'http://localhost:8000/handleauth';

// app.get('/authorize_user', function(req, res) {
// 	res.redirect(insta.get_authorization_url(redirect_uri, {scope: ['likes']}))
// });

// app.get('/handleauth', function(req, res) {
// 	insta.authorize_user(req.query.code, redirect_uri, function(err, result) {
// 		if (err) {
// 			console.log(err);
// 			res.send('authrorization failed');
// 		} else {
// 			console.log(result.access_token);
// 			res.send(result.access_token);
// 		}
// 	});
// });

// get embedded html from instagram, PROVIDED YOU HAVE AN ACCESS TOKEN
app.get('/instagram', function(req, res) {
	var access_token = process.env.INSTA_ACCESS_TOKEN;
	request.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + access_token, function(err, response, body) {
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}
		var items = JSON.parse(body).data,
			embeddedLinks = [],
			count = 0,
			link;
		for (var i = 0; i < items.length; i++) {
			link = items[i].link;
			request.get('http://api.instagram.com/oembed?url=' + link, function(err, resp, body) {
				obj = JSON.parse(body);
				embeddedLinks.push(obj.html);
				count++;
				if (count == items.length) {
					res.send(embeddedLinks);
				}
			});
		}
	});
});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '...');
});