var express  = require('express'),
	app      = express(),
	request  = require('request'),
	mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/pokemania',{useNewUrlParser: true});


var typeSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Type = mongoose.model('Type', typeSchema);



app.get('/', function(req, res){
	res.redirect('/types');
});


app.get('/types', function(req, res){
	Type.find({}, function(err, types){
		if(err){
			console.log(err);
		} else {
			res.render('index', {types: types});
		}
	});
});


app.get('/types/:name', function(req, res){
	var name = req.params.name;
	Type.find({name: name}, function(err, type){
		if (err) {
			console.log(err);
		} else {
			var url = "https://pokeapi.co/api/v2/type/" + name;
			request(url, function(error, response, body){
				if(!error && response.statusCode == 200){
					var data = JSON.parse(body);
					res.render('type',{type: data});
				}
			});
		}
	});
});



app.listen(3000, function(){
	console.log('Server has started !!');
});