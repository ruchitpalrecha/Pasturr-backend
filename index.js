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

app.get('/database', (req, res) => {
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
            res.send("Created fresh database: pasturr");
        });
    });
});

app.get('/tables', (req, res) => {
    const query = `
    CREATE TABLE IF NOT EXISTS User(
        handle VARCHAR(32),
        email VARCHAR(64),
        password VARCHAR(32),
        name VARCHAR(64),
        bio VARCHAR(256),
        country VARCHAR(32),
        PRIMARY KEY(handle),
        UNIQUE(email)
    );

    CREATE TABLE IF NOT EXISTS Region(
        regionName VARCHAR(32),
        PRIMARY KEY(regionName)
    );

    CREATE TABLE IF NOT EXISTS Country(
        country VARCHAR(32),
        regionName VARCHAR(32),
        PRIMARY KEY(country),
        FOREIGN KEY(regionName) REFERENCES Region(regionName)
    );

    CREATE TABLE IF NOT EXISTS CreditCard(
        ccnum BIGINT,
        cardType VARCHAR(16),
        PRIMARY KEY(ccnum)
    );

    CREATE TABLE IF NOT EXISTS PaymentInformation(
        paymentID INTEGER,
        ccnum BIGINT,
        cvnum INTEGER,
        handle VARCHAR(32),
        PRIMARY KEY(paymentID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE,
        FOREIGN KEY(ccnum) REFERENCES CreditCard(ccnum)
    );

    CREATE TABLE IF NOT EXISTS MooMod(
        handle VARCHAR(32),
        employeeID INTEGER,
        PRIMARY KEY(handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE,
        UNIQUE(employeeID)
    );

    CREATE TABLE IF NOT EXISTS Bot(
        handle VARCHAR(32),
        botType VARCHAR(16),
        PRIMARY KEY(handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Filter(
        filterName VARCHAR(16),
        language VARCHAR(16),
        filteredWords VARCHAR(512),
        handle VARCHAR(32),
        PRIMARY KEY(filterName, handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Herd(
        herdID VARCHAR(32),
        herdName VARCHAR(32),
        PRIMARY KEY(herdID)
    );

    CREATE TABLE IF NOT EXISTS MemberOf(
        herdID VARCHAR(32),
        joinTime DATE,
        handle VARCHAR(32),
        PRIMARY KEY(herdID, handle),
        FOREIGN KEY(herdID) REFERENCES Herd(herdID) ON DELETE CASCADE,
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Moo(
        mooID VARCHAR(16),
        content VARCHAR(256),
        mediaURL VARCHAR(128),
        likeCount INTEGER,
        mooTime TIMESTAMP,
        handle VARCHAR(32),
        PRIMARY KEY(mooID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS ReMoo(
        mooID VARCHAR(16),
        comment VARCHAR(128),
        ofMooID VARCHAR(16),
        PRIMARY KEY(mooID),
        FOREIGN KEY(ofMooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ReplyTo(
        replyMooID VARCHAR(16),
        originalMooID VARCHAR(16),
        PRIMARY KEY(replyMooID),
        FOREIGN KEY(replyMooID) REFERENCES Moo(mooID) ON DELETE CASCADE,
        FOREIGN KEY(originalMooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Tag(
        tagName VARCHAR(32),
        frequency INTEGER,
        handle VARCHAR(32),
        PRIMARY KEY(tagName),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS Trending(
        tagName VARCHAR(32),
        position INTEGER,
        regionName VARCHAR(32),
        PRIMARY KEY(tagName, regionName),
        FOREIGN KEY(tagName) REFERENCES Tag(tagName) ON DELETE CASCADE,
        FOREIGN KEY(regionName) REFERENCES Region(regionName) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS TaggedWith(
        tagName VARCHAR(32),
        mooID VARCHAR(16),
        PRIMARY KEY(tagName, mooID),
        FOREIGN KEY(tagName) REFERENCES Tag(tagName) ON DELETE CASCADE,
        FOREIGN KEY(mooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MooList(
        listID VARCHAR(32),
        name VARCHAR(32),
        description VARCHAR(256),
        handle VARCHAR(32),
        PRIMARY KEY(listID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS Contains(
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
        res.send("Created fresh tables");
    });
});

app.listen(port, () => {
    console.log('on port: 3000');
});