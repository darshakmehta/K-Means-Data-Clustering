var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var session      = require('express-session');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
//database
mongoose.connect('mongodb://localhost/Clusterdemo');
// set the static files location /public/img will be /img for users

require('./config/passport')(passport); // pass passport for configuration


app.use(morgan('dev')); 
app.use(cookieParser()); // read cookies (needed for auth)                                        // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
/*app.use(bodyParser.json({ type: 'application/vnd.api+json' }));*/ // parse application/vnd.api+json as json
app.use(methodOverride());
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



var Schema = mongoose.Schema;
var clusterSchema = new Schema({
    product_id : Number,
    name : String,
    price : Number,
    img_url : String,
    count : Number,
    total_rating : Number,
    rating : Number,
    average_rating : Number
});
var myModel = mongoose.model('kmeans', clusterSchema);//Kmean-->kmeans
app.get('/api/cluster', function(req, res) {
    
     // use mongoose to get all todos in the database
    myModel.find(function(err, kmeans) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(kmeans); // return all todos in JSON format
    });
});

 app.post('/api/cluster/:kmeans_id', function(req, res){
        //conditions
        var id = req.params.kmeans_id;
        var query = {_id:id};
        //console.log(req.query.q);
        var current_rating = Number(req.query.q);
        
        myModel.findById(id, function (err, doc){
              // doc is a Document
                var count1 = doc.count;
                count1++;
                var total_rating1 = doc.total_rating;
                total_rating1  = total_rating1 + current_rating;
                var average_rating1 = (total_rating1 / count1);
                average_rating1 = average_rating1.toFixed(2);
                var rating1 = Math.round(average_rating1);
                
                myModel.findByIdAndUpdate(id, { $set: { rating: rating1, count : count1, total_rating : total_rating1 ,average_rating : average_rating1}}, {new: true}, function (err, kmeans) {
                    if (err) return handleError(err);
                    console.log(kmeans);
                    res.send(kmeans);
           
            });

        });
  
});


// application -------------------------------------------------------------
app.get('/', function(req, res) {
    res.render('index.ejs', {root : "./public"}); // load the single view file (angular will handle the page changes on the front-end)
});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.use(express.static("./"));
//launch
app.listen(port, function(){
    console.log("Listening on port " + port);
});
