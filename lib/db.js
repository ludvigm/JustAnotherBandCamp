module.exports = {
    initDB, initDB,
    registerUser, registerUser,
    printAllTables, printAllTables,
    getAllProfiles, getAllProfiles,
    getProfile, getProfile,
    deleteUser, deleteUser
};

const sql = require('mysql');
var promise = require('promise');
var connection;

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'db'
};

let INSTRUMENTS = 'Instruments';
let USER = 'Users';
let INTERESTS = 'Interests';
let CONTACTS = 'Contacts';

/*
 * initDB()
 * Connects the database and creates all necessary tables if they don't already exist.
 */

function initDB() {
    console.log('Connecting...');
    connection = sql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        console.log('Connected!')

    });

    connection.query('CREATE TABLE IF NOT EXISTS ' + USER + '(username varchar(255), password varchar(255), age int, band varchar(255), PRIMARY KEY (username));'
        , function (err, res) {
            if (err) throw err;
            console.log('Creating tables');
            console.log(USER + ' table created.');
        });
    connection.query('CREATE TABLE IF NOT EXISTS ' + INSTRUMENTS + '(type varchar(255), skill int, username varchar(255), FOREIGN KEY (username) REFERENCES ' + USER + '(username) ON DELETE CASCADE);', function (err) {
        if (err) throw err;
        console.log(INSTRUMENTS + ' table created.');
    });

    connection.query('CREATE TABLE IF NOT EXISTS ' + INTERESTS + '(genre varchar(255), username varchar(255), FOREIGN KEY (username) REFERENCES ' + USER + '(username) ON DELETE CASCADE);', function (err) {
        if (err) throw err;
        console.log(INTERESTS + ' table created.');
    });
    connection.query('CREATE TABLE IF NOT EXISTS ' + CONTACTS + '(phone int, email varchar(255), username varchar(255), FOREIGN KEY (username) REFERENCES ' + USER + '(username) ON DELETE CASCADE);', function (err) {
        if (err) throw err;
        console.log(CONTACTS + ' table created.');
    });
}

/*
 * registerUser()
 * Ugly function, but due to asynch bullshit i'd rather we start here and make sure INSERT is done on all
 * tables rather than perhaps getting into trouble while trying to INSERT to several tables at the same
 * time. Hopefully we can try having things seperate and it will work just fine. But just for now!
 *
 * runs INSERT queries to all four tables with information inputed from user registration.
 */

function registerUser(user, instrument, interest, contact) {
    // user INSERT
    var user = {username: user.username, password: user.password, age: user.age, band: user.band};
    connection.query('INSERT INTO ' + USER + ' SET ?', user, function (err) {
        if (err) throw err;
    });

    // instrument INSERT
    var instrument = {type: instrument.type, skill: instrument.skill, username: user.username};
    connection.query('INSERT INTO ' + INSTRUMENTS + ' SET ?', instrument, function (err) {
        if (err) throw err;
    });

    // interest INSERT
    var interest = {genre: interest.genre, username: user.username};
    connection.query('INSERT INTO ' + INTERESTS + ' SET ?', interest, function (err) {
        if (err) throw err;
    });

    // contact INSERT
    var contact = {phone: contact.phone, email: contact.email, username: user.username};
    connection.query('INSERT INTO ' + CONTACTS + ' SET ?', contact, function (err) {
        if (err) throw err;
    });
}

/*
 * getAllProfiles()
 * A little messy. For each user found in USER table, query instrument, interest and contact
 * table for that username and add all parameters to the Profile object. Push every new profile into
 * listOfProfiles and return it.
 */

function getAllProfiles() {
    var listOfProfiles = [];
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM ' + USER + ' INNER JOIN ' + INSTRUMENTS +
            ' ON ' + USER + '.username=' + INSTRUMENTS + '.username INNER JOIN ' + INTERESTS +
            ' ON ' + USER + '.username=' + INTERESTS + '.username INNER JOIN ' + CONTACTS +
            ' ON ' + USER + '.username=' + CONTACTS + '.username', function (err, result) {
            if (err) reject(err);
            for (var i in result) {
                var res = result[i];
                listOfProfiles.push(res);
            }
            return resolve(listOfProfiles);
        });
    })


}

/*
 * Query database for a specific profile.
 * User in /profiles/:user
 */

function getProfile(username) {
    return new promise(function (resolve, reject) {
        connection.query(
            'SELECT * FROM ' + USER + ' INNER JOIN ' + INSTRUMENTS +
            ' ON ' + USER + '.username=' + INSTRUMENTS + '.username INNER JOIN ' + INTERESTS +
            ' ON ' + USER + '.username=' + INTERESTS + '.username INNER JOIN ' + CONTACTS +
            ' ON ' + USER + '.username=' + CONTACTS + '.username WHERE ' + USER + '.username = \'' + username + '\' ', function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
    });
}

function deleteUser(username) {
  connection.query('DELETE FROM ' + USER + ' WHERE ' + USER + '.username= \'' + username + '\'', function(err, result) {
    if (err) throw err;
  });
}




function printAllTables() {
    // all users
    console.log('Print all tables');
    connection.query('SELECT * FROM ' + USER, function (err, result) {
        console.log('inside');
        if (err) throw err;
        for (var i in result) {
            var res = result[i];
            console.log('All users in USERS table:');
            console.log('Username: ' + res.username + ' Age: ' + res.age + ' Band: ' + res.band);
        }
    });

    // all instruments
    connection.query('SELECT * FROM ' + INSTRUMENTS, function (err, result) {
        if (err) throw err;
        for (var i in result) {
            var res = result[i];
            console.log('All instruments in INSTRUMENTS table:');
            console.log('Type: ' + res.type + ' Skill level: ' + res.skill + ' Username: ' + res.username);
        }
    });

    // all interests
    connection.query('SELECT * FROM ' + INTERESTS, function (err, result) {
        if (err) throw err;
        for (var i in result) {
            var res = result[i];
            console.log('All interests in INTERESTS table:');
            console.log('Type: ' + res.genre + ' Username: ' + res.username);
        }
    });

    // all contacts
    connection.query('SELECT * FROM ' + CONTACTS, function (err, result) {
        if (err) throw err;
        for (var i in result) {
            var res = result[i];
            console.log('All contacts in CONTACTS table:');
            console.log('Phone: ' + res.phone + ' Email level: ' + res.email + ' Username: ' + res.username);
        }
    });
}
