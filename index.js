const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
let connection = mysql.createConnection({
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

<<<<<<< HEAD
app.post('/database', (req, res) => {
=======
app.get('/database', (req, res) => {
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
    const query = `
    DROP DATABASE IF EXISTS pasturr; 
    CREATE DATABASE pasturr;
    `;
    connection.query(query, (error, results, fields) => {

        if (error) {
            res.send(error);
            return;
        }
        // console.log("Created fresh database: pasturr");

        // Add new database to connection
        connection.changeUser({
            database: 'pasturr'
        }, (err) => {
            if (err) {
                console.log('Error in changing database', err);
                return;
            }
<<<<<<< HEAD
            res.send("Created database: pasturr");
=======
            res.send("Created fresh database: pasturr");
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        });
    });
});

<<<<<<< HEAD
app.post('/tables', (req, res) => {
    const query = `
    CREATE TABLE User(
=======
app.get('/tables', (req, res) => {
    const query = `
    CREATE TABLE IF NOT EXISTS User(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        handle VARCHAR(32),
        email VARCHAR(64),
        password VARCHAR(32),
        name VARCHAR(64),
        bio VARCHAR(256),
        country VARCHAR(32),
        PRIMARY KEY(handle),
        UNIQUE(email)
    );

<<<<<<< HEAD
    CREATE TABLE Region(
=======
    CREATE TABLE IF NOT EXISTS Region(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        regionName VARCHAR(32),
        PRIMARY KEY(regionName)
    );

<<<<<<< HEAD
    CREATE TABLE Country(
=======
    CREATE TABLE IF NOT EXISTS Country(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        country VARCHAR(32),
        regionName VARCHAR(32),
        PRIMARY KEY(country),
        FOREIGN KEY(regionName) REFERENCES Region(regionName)
    );

<<<<<<< HEAD
    CREATE TABLE CreditCard(
=======
    CREATE TABLE IF NOT EXISTS CreditCard(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        ccnum BIGINT,
        cardType VARCHAR(16),
        PRIMARY KEY(ccnum)
    );

<<<<<<< HEAD
    CREATE TABLE PaymentInformation(
=======
    CREATE TABLE IF NOT EXISTS PaymentInformation(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        paymentID INTEGER,
        ccnum BIGINT,
        cvnum INTEGER,
        handle VARCHAR(32),
        PRIMARY KEY(paymentID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE,
        FOREIGN KEY(ccnum) REFERENCES CreditCard(ccnum)
    );

<<<<<<< HEAD
    CREATE TABLE MooMod(
=======
    CREATE TABLE IF NOT EXISTS MooMod(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        handle VARCHAR(32),
        employeeID INTEGER,
        PRIMARY KEY(handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE,
        UNIQUE(employeeID)
    );

<<<<<<< HEAD
    CREATE TABLE Bot(
=======
    CREATE TABLE IF NOT EXISTS Bot(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        handle VARCHAR(32),
        botType VARCHAR(16),
        PRIMARY KEY(handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

<<<<<<< HEAD
    CREATE TABLE Filter(
=======
    CREATE TABLE IF NOT EXISTS Filter(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        filterName VARCHAR(16),
        language VARCHAR(16),
        filteredWords VARCHAR(512),
        handle VARCHAR(32),
        PRIMARY KEY(filterName, handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

<<<<<<< HEAD
    CREATE TABLE Herd(
=======
    CREATE TABLE IF NOT EXISTS Herd(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        herdID VARCHAR(32),
        herdName VARCHAR(32),
        PRIMARY KEY(herdID)
    );

<<<<<<< HEAD
    CREATE TABLE MemberOf(
=======
    CREATE TABLE IF NOT EXISTS MemberOf(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        herdID VARCHAR(32),
        joinTime DATE,
        handle VARCHAR(32),
        PRIMARY KEY(herdID, handle),
        FOREIGN KEY(herdID) REFERENCES Herd(herdID) ON DELETE CASCADE,
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

<<<<<<< HEAD
    CREATE TABLE Moo(
=======
    CREATE TABLE IF NOT EXISTS Moo(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        mooID VARCHAR(16),
        content VARCHAR(256),
        mediaURL VARCHAR(128),
        likeCount INTEGER,
        mooTime TIMESTAMP,
        handle VARCHAR(32),
        PRIMARY KEY(mooID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

<<<<<<< HEAD
    CREATE TABLE ReMoo(
=======
    CREATE TABLE IF NOT EXISTS ReMoo(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        mooID VARCHAR(16),
        comment VARCHAR(128),
        ofMooID VARCHAR(16),
        PRIMARY KEY(mooID),
        FOREIGN KEY(ofMooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

<<<<<<< HEAD
    CREATE TABLE ReplyTo(
=======
    CREATE TABLE IF NOT EXISTS ReplyTo(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        replyMooID VARCHAR(16),
        originalMooID VARCHAR(16),
        PRIMARY KEY(replyMooID),
        FOREIGN KEY(replyMooID) REFERENCES Moo(mooID) ON DELETE CASCADE,
        FOREIGN KEY(originalMooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

<<<<<<< HEAD
    CREATE TABLE Tag(
=======
    CREATE TABLE IF NOT EXISTS Tag(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        tagName VARCHAR(32),
        frequency INTEGER,
        handle VARCHAR(32),
        PRIMARY KEY(tagName),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

<<<<<<< HEAD
    CREATE TABLE Trending(
=======
    CREATE TABLE IF NOT EXISTS Trending(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        tagName VARCHAR(32),
        position INTEGER,
        regionName VARCHAR(32),
        PRIMARY KEY(tagName, regionName),
        FOREIGN KEY(tagName) REFERENCES Tag(tagName) ON DELETE CASCADE,
        FOREIGN KEY(regionName) REFERENCES Region(regionName) ON DELETE CASCADE
    );

<<<<<<< HEAD
    CREATE TABLE TaggedWith(
=======
    CREATE TABLE IF NOT EXISTS TaggedWith(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        tagName VARCHAR(32),
        mooID VARCHAR(16),
        PRIMARY KEY(tagName, mooID),
        FOREIGN KEY(tagName) REFERENCES Tag(tagName) ON DELETE CASCADE,
        FOREIGN KEY(mooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

<<<<<<< HEAD
    CREATE TABLE MooList(
=======
    CREATE TABLE IF NOT EXISTS MooList(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        listID VARCHAR(32),
        name VARCHAR(32),
        description VARCHAR(256),
        handle VARCHAR(32),
        PRIMARY KEY(listID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

<<<<<<< HEAD
    CREATE TABLE Contains(
=======
    CREATE TABLE IF NOT EXISTS Contains(
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
        listID VARCHAR(32),
        mooID VARCHAR(32),
        PRIMARY KEY(listID, mooID),
        FOREIGN KEY(listID) REFERENCES MooList(listID),
        FOREIGN KEY(mooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );
    `;
    connection.query(query, (error, results, fields) => {

        if (error) {
            res.send(error);
            return;
        }
        // console.log("Created fresh tables");
<<<<<<< HEAD
        res.send("Created tables");
=======
        res.send("Created fresh tables");
>>>>>>> 369861bc1c24f4fe5eb4cfcbd0a5f81f7a5dc4f7
    });
});

app.listen(port, () => {
    console.log('on port: 3000');
});