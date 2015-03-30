// server.js

// module dependencies
var express = require('express'),
	bodyParser = require('body-parser'),
	nodemailer = require('nodemailer'),
	insta = require('instagram-node').instagram(),
	request = require('request'),
	cors = require('cors'),
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
// insta.use({
// 	client_id: process.env.INSTA_CLIENT_ID,
// 	client_secret: process.env.INSTA_CLIENT_SECRET
// });

// setting up express app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set('port', (process.env.PORT || 8000));

// routes
app.get('/', function(req, res) {
	res.send('You\'ve reached a Node server.');
});

app.post('/feedback', function(req, res) {
	console.log(req.body);
	transporter.sendMail({
		from: req.body.name + ' ' + req.body.from,
		to: 'listenthenlead@gmail.com',
		subject: 'Email from \'Say Something\' form',
		replyTo: req.body.from,
		text: req.body.text
	}, function(error, info) {
		if (error) {
			console.log(error);
			res.send(false);
		} else {
			console.log(info);
			if (typeof info.accepted !== 'undefined') {
				res.send(true);
			} else {
				res.send(false);
			}
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
	// var access_token = process.env.INSTA_ACCESS_TOKEN;
	var access_token = '647926477.98fc2c5.1f9f04b42ed54f8daa6c00c0024c8971';
	request.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + access_token, function(err, response, body) {
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}
		
		var items = JSON.parse(body).data,
			pics = [],
			count = 0,
			obj,
			current;
		for (var i = 0; i < items.length; i++) {
			current = items[i];
			obj = {};
			obj.url = current.images.standard_resolution.url;
			obj.comments = current.comments.count;
			obj.likes = current.likes.count;
			pics.push(obj);
		}
		res.send(pics);
	});
});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '...');
});