const debug = require('debug')('app:startup');


const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');

const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const customers = require('./routes/customers');
const home = require('./routes/home');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
    .then(()=> console.log('Connected to MongoDB....'))
    .catch(err => console.error('Could not connect to MongoDB'));



app.set('view engine', 'pug');
app.set('views','./views');


app.use(express.json()); // req.body
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/', home);

//configuration
// console.log('Application Name: ' + config.get('name'));
// console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

app.use(logger);

app.use(function(req,res,next){
    console.log('Authentificating.....');
    next();
});




//PORT
const port = process.env.PORT || 3000 ;

app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
});
