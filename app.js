var express = require('express');
var exphbs  = require('express-handlebars');
const { sendEmail } = require('./mailer');
var port = process.env.PORT || 3000

var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});
app.post('/notification_url',(req,res)=>{
    const data = {
        body:req.body,
        query:req.query,
        headers:req.header
    }
    if(data){
        sendEmail(data)
    }
})

app.listen(port);