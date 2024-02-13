const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const { mongoose } = require('./database');
//require('./cron');


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

const PORT = process.env.PORT || 3004;

app.set('port', PORT);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


app.get('/api/prueba', (req, res) => {
    res.render('test', { titulo: 'mi titulo dinamico' });
});




app.use('/api', require('./routes/User.route'));
app.use('/api', require('./routes/Score.route'));


app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to agency application.' });
});


app.listen(app.get('port'), () => {
    console.log('Server is listening on port ' + app.get('port'));
});
