var mysql = require('mysql');
// require('./views/Registration');
// require('./views/login');
var con = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "@Shruti2808",
  database : 'dairy',
  port: 3306
});
 
con.connect(function(err){
    if(err){
        console.log(err);
    }
    console.log("Connected to DB");
});

module.exports.con = con;


// connection.query(`select * from registration`,(err,result,fields)=>{
//     if(err){
//         return console.log(err);
//     }
//     return console.log(result);
// });





