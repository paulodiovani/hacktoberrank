var express = require('express')
var router = express.Router(); //if needed further

var path = require('path');



const app = express()

app.get('/', function (req, res) {
    res.write('GET request to the homepage');
    res.write('Hello Server');
    res.end();    
  })


app.get('/dirname', function (req, res) {
    res.write((path.dirname(__filename)));
    // res.write(directories);
    res.end();  
  });



app.on('connection',()=>{
    console.log("New Connection.....")
});

app.listen(3000);

console.log("Listening to port 3000");
