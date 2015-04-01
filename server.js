// server.js

// module dependencies
var express = require('express'),
	bodyParser = require('body-parser'),
	nodemailer = require('nodemailer'),
	insta = require('instagram-node').instagram(),
	request = require('request'),
	cors = require('cors'),
	Twitter = require('twitter'),
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
			obj.caption = current.caption.text;
			pics.push(obj);
		}
		res.send(pics);
	});
});

var twitter = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.get('/twitter', function(req, res) {
	// var params = {
	// 	screen_name: 'TechCrunch',
	// 	count: 15
	// };
	twitter.get('statuses/user_timeline', function(err, tweets, response) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		var current,
			obj,
			items = [];
		for (var i = 0 ; i < tweets.length; i++) {
			current = tweets[i];
			obj = {};
			obj.text = current.text;
			obj.user = current.user.name;
			obj.profilePic = current.user.profile_image_url;
			obj.retweets = current.retweet_count;
			obj.favorites = current.favorite_count;
			items.push(obj);
		}
		res.send(items);
	});
});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port') + '...');
});