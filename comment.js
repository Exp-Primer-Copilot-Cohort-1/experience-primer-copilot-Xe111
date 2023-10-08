//Create web server
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
//Set view engine
app.set('view engine', 'ejs');
//Set static folder
app.use(express.static('public'));
//Setup mysql
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "comment"
});
//Connect to mysql
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
//Create table
app.get('/createtable', function(req, res) {
    let sql = "CREATE TABLE comment (id INT(11) AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), comment TEXT)";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table created");
        res.send("Table created");
    });
});
//Insert data to table
app.get('/insert', function(req, res) {
    let sql = "INSERT INTO comment (name, comment) VALUES ('Kiet', 'Hello')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send("1 record inserted");
    });
});
//Select data from table
app.get('/select', function(req, res) {
    let sql = "SELECT * FROM comment";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});
//Insert data to table from form
app.post('/insert', urlencodedParser, function(req, res) {
    let sql = "INSERT INTO comment (name, comment) VALUES ('" + req.body.name + "', '" + req.body.comment + "')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send("1 record inserted");
    });
});
//Show form
app.get('/', function(req, res) {
    res.render('form');
});
//Show all comment
app.get('/allcomment', function(req, res) {
    let sql = "SELECT * FROM comment";
    con.query(sql, function(err, result) {