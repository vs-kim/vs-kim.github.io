var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
    user     : 'root',
    port     :  3306,
	password : 'kim9394760',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    if(request.session.loggedin){
        response.send(`Hello, ${request.session.username}`)  
    }else{
        response.sendFile(path.join(__dirname + '/index.html'));
    }
});
app.get('/login', function(req, res){
	res.sendFile(__dirname + '/login.html');
	
})



app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
        
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});



app.listen(3000);