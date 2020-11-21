const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'pasturr',
    password: 'password',
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/database', (req, res) => {
    connection.query("DROP DATABASE IF EXISTS pasturr; CREATE DATABASE pasturr;", (error, results, fields) => {

        if (error) {
            res.send(error);
        }
        res.send("Created fresh database: pasturr");
    });

    // connection.query("CREATE DATABASE pasturr;", (error, results, fields) => {

    //     if (error) {
    //         res.send(error);
    //     }
    //     res.send(results);
    // });
});

app.listen(port, () => {
    console.log('on port: 3000');
});