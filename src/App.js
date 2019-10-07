const http = require('http');
var path = require('path');
var dirlister = require('./GetDirectory');

// var directories = path.dirname('/Users/Refsnes/demo_path.js');
// console.log(directories);


// console.log(dirlister)
// json = dirlister.JSON
const server = http.createServer((req,res)=>{
    if(req.url==='/'){
        res.write('Hello Server');
        res.end();    
    }
//it'll return all the file name in the directory
    if(req.url==='/dirname'){
        res.write((path.dirname(__filename)));
        res.write(directories);
        console.log(dirlister);
        res.end();
    }

});

server.on('connection',()=>{
    console.log("New Connection.....")
});

server.listen(3000);

console.log("Listening to port 3000");
