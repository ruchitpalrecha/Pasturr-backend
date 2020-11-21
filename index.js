const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;
const jsonParser = bodyParser.json()

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

app.post('/database', (req, res) => {
    const query = `
    DROP DATABASE IF EXISTS pasturr; 
    CREATE DATABASE pasturr;
    `;
    connection.query(query, (error, results, fields) => {

        if (error) {
            res.send(error);
            return;
        }
    });
    // console.log("Created fresh database: pasturr");

    // Add new database to connection
    connection.changeUser({
        database: 'pasturr'
    }, (err) => {
        if (err) {
            console.log('Error in changing database', err);
            return;
        }
        res.send("Created database: pasturr");
    });
});

app.post('/tables', (req, res) => {
    const query = `
    CREATE TABLE User(
        handle VARCHAR(32),
        email VARCHAR(64),
        password VARCHAR(32),
        name VARCHAR(64),
        bio VARCHAR(256),
        country VARCHAR(32),
        PRIMARY KEY(handle),
        UNIQUE(email)
    );

    CREATE TABLE Region(
        regionName VARCHAR(32),
        PRIMARY KEY(regionName)
    );

    CREATE TABLE Country(
        country VARCHAR(32),
        regionName VARCHAR(32),
        PRIMARY KEY(country),
        FOREIGN KEY(regionName) REFERENCES Region(regionName)
    );

    CREATE TABLE CreditCard(
        ccnum BIGINT,
        cardType VARCHAR(16),
        PRIMARY KEY(ccnum)
    );

    CREATE TABLE PaymentInformation(
        paymentID INTEGER,
        ccnum BIGINT,
        cvnum INTEGER,
        handle VARCHAR(32),
        PRIMARY KEY(paymentID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE,
        FOREIGN KEY(ccnum) REFERENCES CreditCard(ccnum)
    );

    CREATE TABLE MooMod(
        handle VARCHAR(32),
        employeeID INTEGER,
        PRIMARY KEY(handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE,
        UNIQUE(employeeID)
    );

    CREATE TABLE Bot(
        handle VARCHAR(32),
        botType VARCHAR(16),
        PRIMARY KEY(handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

    CREATE TABLE Filter(
        filterName VARCHAR(16),
        language VARCHAR(16),
        filteredWords VARCHAR(512),
        handle VARCHAR(32),
        PRIMARY KEY(filterName, handle),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

    CREATE TABLE Herd(
        herdID VARCHAR(32),
        herdName VARCHAR(32),
        PRIMARY KEY(herdID)
    );

    CREATE TABLE MemberOf(
        herdID VARCHAR(32),
        joinTime DATE,
        handle VARCHAR(32),
        PRIMARY KEY(herdID, handle),
        FOREIGN KEY(herdID) REFERENCES Herd(herdID) ON DELETE CASCADE,
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE CASCADE
    );

    CREATE TABLE Moo(
        mooID VARCHAR(16),
        content VARCHAR(256),
        mediaURL VARCHAR(128),
        likeCount INTEGER,
        mooTime TIMESTAMP,
        handle VARCHAR(32),
        PRIMARY KEY(mooID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

    CREATE TABLE ReMoo(
        mooID VARCHAR(16),
        comment VARCHAR(128),
        ofMooID VARCHAR(16),
        PRIMARY KEY(mooID),
        FOREIGN KEY(ofMooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

    CREATE TABLE ReplyTo(
        replyMooID VARCHAR(16),
        originalMooID VARCHAR(16),
        PRIMARY KEY(replyMooID),
        FOREIGN KEY(replyMooID) REFERENCES Moo(mooID) ON DELETE CASCADE,
        FOREIGN KEY(originalMooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

    CREATE TABLE Tag(
        tagName VARCHAR(32),
        frequency INTEGER,
        handle VARCHAR(32),
        PRIMARY KEY(tagName),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

    CREATE TABLE Trending(
        tagName VARCHAR(32),
        position INTEGER,
        regionName VARCHAR(32),
        PRIMARY KEY(tagName, regionName),
        FOREIGN KEY(tagName) REFERENCES Tag(tagName) ON DELETE CASCADE,
        FOREIGN KEY(regionName) REFERENCES Region(regionName) ON DELETE CASCADE
    );

    CREATE TABLE TaggedWith(
        tagName VARCHAR(32),
        mooID VARCHAR(16),
        PRIMARY KEY(tagName, mooID),
        FOREIGN KEY(tagName) REFERENCES Tag(tagName) ON DELETE CASCADE,
        FOREIGN KEY(mooID) REFERENCES Moo(mooID) ON DELETE CASCADE
    );

    CREATE TABLE MooList(
        listID VARCHAR(32),
        name VARCHAR(32),
        description VARCHAR(256),
        handle VARCHAR(32),
        PRIMARY KEY(listID),
        FOREIGN KEY(handle) REFERENCES User(handle) ON DELETE SET NULL
    );

    CREATE TABLE Contains(
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
        res.send("Created tables");
    });
});

app.post('/load', (req, res) => {
    const query = `
INSERT INTO CreditCard values(9876543210099239, "AMEX");
INSERT INTO CreditCard values(9234567899896789, "AMEX");
INSERT INTO CreditCard values(4874843210099239, "VISA");
INSERT INTO CreditCard values(1234567812345678, "MASTERCARD");
INSERT INTO CreditCard values(1234987800216782, "MASTERCARD");
INSERT INTO CreditCard values(123456789989678, "MASTERCARD");

INSERT INTO User values("jdb", "jbourak@pm.me", "lolxd123", "Jordan Bourak", "a random bio", "Canada");
INSERT INTO User values("Ronin", "ronin@gmail.com", "password", "Ronin Cunningham", "my name is ronin", "Canada");
INSERT INTO User values("Ruchit", "Ruchit@gmail.com", "lolxd123", "Ruchit Palrecha", "hey im ruchit", "United States");
INSERT INTO User values("John", "John@gmail.com", "lolxd123", "John Smith", "yes", "Canada");
INSERT INTO User values("Jack", "Jack@gmail.com", "lolxd123", "Jack Bower", "lol", "Canada");
INSERT INTO User values("JacksSon", "JackJr@gmail.com", ";lkjasdf", "Jack Bower", "sup", "Canada");

INSERT INTO User values("moomod1", "moomod1@gmail.com", "adminpassword69", "Farmer Bob", "CEO", "United States");
INSERT INTO User values("moomod2", "moomod2@gmail.com", "testpassword", "Farmer Billy", "cows", "United States");
INSERT INTO User values("moomod3", "moomod3@gmail.com", "adminpassword69", "Farmer Joe", "pigs", "United States");
INSERT INTO User values("moomod4", "moomod4@gmail.com", "adminpassword69", "Farmer Harry", "wheat", "United States");
INSERT INTO User values("moomod5", "moomod5@gmail.com", "adminpassword69", "Farmer Tammie", "chickens", "United States");

INSERT INTO User values("bot1", "bot1@gmail.com", "cvbn", "Botty", "beep boop", "Russia");
INSERT INTO User values("bot2", "bot2@gmail.com", "tyzxcv", "Botty", "beep boop", "Russia");
INSERT INTO User values("bot3", "bot3@gmail.com", "fghj", "Botty", "beep boop", "United States");
INSERT INTO User values("bot4", "bot4@gmail.com", "qwer", "Botty", "beep boop", "United States");
INSERT INTO User values("bot5", "bot5@gmail.com", "asdf", "Botty", "beep boop", "United States");

INSERT INTO PaymentInformation values(712471243, 9876543210099239, 7138, "jdb");
INSERT INTO PaymentInformation values(23532532, 9234567899896789, 2353, "Ronin");
INSERT INTO PaymentInformation values(235532532, 4874843210099239, 546, "Ruchit");
INSERT INTO PaymentInformation values(56546544, 123456789989678, 5678, "John");
INSERT INTO PaymentInformation values(364423626, 1234987800216782, 457, "Jack");
INSERT INTO PaymentInformation values(364423627, 1234987800216782, 457, "JacksSon");

INSERT INTO Region values("North America");
INSERT INTO Region values("Middle East");
INSERT INTO Region values("Asia");
INSERT INTO Region values("South America");
INSERT INTO Region values("Europe");

INSERT INTO Country values("Canada", "North America");
INSERT INTO Country values("Iran", "Middle East");
INSERT INTO Country values("China", "Asia");
INSERT INTO Country values("United States", "North America");
INSERT INTO Country values("Japan", "Asia");
INSERT INTO Country values("Russia", "Europe");

INSERT INTO MooMod values("moomod1", 53151);
INSERT INTO MooMod values("moomod2", 23523);
INSERT INTO MooMod values("moomod3", 12421);
INSERT INTO MooMod values("moomod4", 34633);
INSERT INTO MooMod values("moomod5", 34611);

INSERT INTO Bot values("bot1", "spam");
INSERT INTO Bot values("bot2", "spam");
INSERT INTO Bot values("bot3", "test");
INSERT INTO Bot values("bot4", "api");
INSERT INTO Bot values("bot5", "emergency");

INSERT INTO Filter values("filter 1", "English", "sad,politics,sports", "jdb");
INSERT INTO Filter values("filter 2", "English", "sad,politics,sports", "Ronin");
INSERT INTO Filter values("filter 3", "Hindi", "sad,politics,sports", "Ruchit");
INSERT INTO Filter values("filter 4", "Japanese", "sad,politics,sports", "John");
INSERT INTO Filter values("filter 5", "Europe", "sad,politics,sports", "Jack");

INSERT INTO Herd values(1234124, "Meme group chat");
INSERT INTO Herd values(5253253, "Friends group chat");
INSERT INTO Herd values(1241241, "Family group chat");
INSERT INTO Herd values(6543733, "Relatives group chat");
INSERT INTO Herd values(8563221, "BFF group chat");

INSERT INTO MemberOf values("1234124", '2020-08-02', "jdb");
INSERT INTO MemberOf values("5253253", '2020-08-01', "Ronin");
INSERT INTO MemberOf values("1241241", '2020-08-09', "Ruchit");
INSERT INTO MemberOf values("6543733", '2020-08-12', "John");
INSERT INTO MemberOf values("8563221", '2020-08-10', "Jack");

INSERT INTO Moo values("mooid1", "random moo", "", 100, '2020-10-15 04:00:59', "jdb");
INSERT INTO Moo values("mooid2", "random moo", "", 100, '2020-10-12 03:22:00', "Ronin");
INSERT INTO Moo values("mooid3", "random moo", "", 100, '2020-10-12 03:12:44', "Ruchit");
INSERT INTO Moo values("mooid4", "random moo", "www.whatever.com", 100, '2020-10-12 03:12:44', "John");
INSERT INTO Moo values("mooid5", "random moo", "www.whatever.com", 100, '2020-10-11 03:12:44', "Jack");
INSERT INTO Moo values("replymooid1", "a random reply moo", "www.whatever.com", 100, '2020-10-20 03:00:00', "Jack");
INSERT INTO Moo values("replymooid2", "a random reply moo", "", 100, '2020-10-20 04:00:00', "Ronin");
INSERT INTO Moo values("replymooid3", "a random reply moo", "", 100, '2020-10-20 05:00:00', "Ronin");
INSERT INTO Moo values("replymooid4", "a random reply moo", "", 100, '2020-10-20 04:30:00', "Ronin");
INSERT INTO Moo values("replymooid5", "a random reply moo", "", 100, '2020-10-20 03:45:00', "Ronin");

INSERT INTO ReMoo values("remooid1", "I agree with this moo", "mooid1");
INSERT INTO ReMoo values("remooid2", "I agree with this moo", "mooid2");
INSERT INTO ReMoo values("remooid3", "I agree with this moo", "mooid3");
INSERT INTO ReMoo values("remooid4", "I agree with this moo", "mooid4");
INSERT INTO ReMoo values("remooid5", "I agree with this moo", "mooid5");

INSERT INTO ReplyTo values("replymooid1", "mooid1");
INSERT INTO ReplyTo values("replymooid2", "mooid2");
INSERT INTO ReplyTo values("replymooid3", "mooid3");
INSERT INTO ReplyTo values("replymooid4", "mooid4");
INSERT INTO ReplyTo values("replymooid5", "mooid5");

INSERT INTO Tag values("tag 1", 50, "jdb");
INSERT INTO Tag values("tag 2", 50, "Ronin");
INSERT INTO Tag values("tag 3", 50, "Ruchit");
INSERT INTO Tag values("tag 4", 50, "John");
INSERT INTO Tag values("tag 5", 50, "Jack");

INSERT INTO Trending values("tag 1", 1, "North America");
INSERT INTO Trending values("tag 2", 1, "Middle East");
INSERT INTO Trending values("tag 3", 1, "Asia");
INSERT INTO Trending values("tag 4", 1, "North America");
INSERT INTO Trending values("tag 5", 1, "Asia");

INSERT INTO TaggedWith values("tag 1", "mooid1");
INSERT INTO TaggedWith values("tag 2", "mooid2");
INSERT INTO TaggedWith values("tag 3", "mooid3");
INSERT INTO TaggedWith values("tag 4", "mooid4");
INSERT INTO TaggedWith values("tag 5", "mooid5");

INSERT INTO MooList values("listid1", "list1", "A list of my favourite moos", "jdb");
INSERT INTO MooList values("listid2", "list2", "A list of my favourite moos", "Ronin");
INSERT INTO MooList values("listid3", "list3", "A list of my favourite moos", "Ruchit");
INSERT INTO MooList values("listid4", "list4", "A list of my favourite moos", "John");
INSERT INTO MooList values("listid5", "list5", "A list of my favourite moos", "Jack");

INSERT INTO Contains values("listid1", "mooid1");
INSERT INTO Contains values("listid2", "mooid2");
INSERT INTO Contains values("listid3", "mooid3");
INSERT INTO Contains values("listid4", "mooid4");
INSERT INTO Contains values("listid5", "mooid5");
    `;
    connection.query(query, (error, results, fields) => {

        if (error) {
            res.send(error);
            return;
        }
        res.send("Loaded tables");
    });
});

app.get('/user', (req, res) => {
    const query = 'SELECT * FROM User;';
    connection.query(query, (error, results, fields) => {

        if (error) {
            res.send(error);
            return;
        }

        res.send(results);
    });
});

app.post('/user', jsonParser, (req, res) => {
    const handle = req.body.handle;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const bio = req.body.bio;
    const country = req.body.country;

    const query = 'INSERT INTO User (handle, email, password, name, bio, country) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [handle, email, password, name, bio, country], (error, results, fields) => {
        if (error) {
            res.send(error);
            return;
        }
        res.send("Added User correctly");
    });
});

app.get('/region', (req, res) => {
    const query = 'SELECT * FROM Region;';
    connection.query(query, (error, results, fields) => {

        if (error) {
            res.send(error);
            return;
        }

        res.send(results);
    });
});

app.get('/country', (req, res) => {
    const query = 'SELECT * FROM Country;';
    connection.query(query, (error, results, fields) => {

        if (error) {
            res.send(error);
            return;
        }

        res.send(results);
    });
});

app.listen(port, () => {
    console.log('on port: 3000');
});