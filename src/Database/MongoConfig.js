

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://name:<Password>@cluster0-80zcq.mongodb.net/admin?retryWrites=true&w=majority';
// mongodb+srv://name:********@cluster0-80zcq.mongodb.net/admin?retryWrites=true&w=majority
MongoClient.connect(url, function(err, db) {
 
    // var cursor = db.collection('gitpr.pr').find();

    // cursor.each(function(err, doc) {

    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log(doc);
    //     }

    // });
    if(!err) {
        console.log("We are connected");
      }
}); 


