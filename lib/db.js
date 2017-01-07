/*
 * db.js
 * Sets up the database and handles all querys called from different parts of the app.
 */

// Export all functions
module.exports = {
    initDB, initDB,
    registerUser, registerUser,
    getAllProfiles, getAllProfiles,
    getProfile, getProfile,
    deleteUser, deleteUser,
    updateUser, updateUser,
    matchUser, matchUser
};

// Required libs
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

// Placeholders for table names
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
    connection.query('CREATE TABLE IF NOT EXISTS ' + INSTRUMENTS + '(type varchar(255), skill int, username varchar(255), FOREIGN KEY (username) REFERENCES ' + USER + '(username) ON DELETE CASCADE ON UPDATE CASCADE);', function (err) {
        if (err) throw err;
        console.log(INSTRUMENTS + ' table created.');
    });

    connection.query('CREATE TABLE IF NOT EXISTS ' + INTERESTS + '(genre varchar(255), username varchar(255), FOREIGN KEY (username) REFERENCES ' + USER + '(username) ON DELETE CASCADE ON UPDATE CASCADE);', function (err) {
        if (err) throw err;
        console.log(INTERESTS + ' table created.');
    });
    connection.query('CREATE TABLE IF NOT EXISTS ' + CONTACTS + '(phone int, email varchar(255), username varchar(255), FOREIGN KEY (username) REFERENCES ' + USER + '(username) ON DELETE CASCADE ON UPDATE CASCADE);', function (err) {
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
    });
}

/*
 * getProfile()
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

/*
 * deleteUser()
 * Delete user from database querying on its username.
 */

function deleteUser(username) {
  connection.query('DELETE FROM ' + USER + ' WHERE ' + USER + '.username= \'' + username + '\'', function(err, result) {
    if (err) throw err;
  });
}

/*
 * updateUser()
 * Update all attributes in user record querying on its username attr.
 */

function updateUser(username, user) {
  // Updating every attribute might not be the most efficient thing to do, but it is a lot easier
  // than checking for every single attribute if it has been changed.
  connection.query('UPDATE ' + USER + ', ' + INSTRUMENTS + ', ' + INTERESTS + ', ' + CONTACTS + ' SET ' + USER + '.username=\'' + user.username + '\', ' +
                   USER + '.age=\'' + user.age + '\', ' + USER + '.band=\'' + user.band + '\', ' +
                   INSTRUMENTS + '.type=\'' + user.type + '\', ' + INSTRUMENTS + '.skill=\'' + user.skill + '\', '+
                   INTERESTS + '.genre=\'' + user.type + '\', ' + CONTACTS + '.phone=\'' + user.phone + '\', ' +
                   CONTACTS + '.email=\'' + user.email + '\'' + ' WHERE ' + USER + '.username= \'' + username + '\' AND ' +
                   INSTRUMENTS + '.username=\'' + username + '\' AND ' + INTERESTS +
                   '.username=\'' + username + ' \' AND ' + CONTACTS + '.username=\'' + username + '\'', function(err, result) {
                     if (err) throw err;
                   });
}

/*
 * matchUser()
 * Matches users by a string of queries dependant on what attribute the user has chosen to match with.
 * Not very pretty... 
 */

function matchUser(username, attribute){
  var listOfProfiles = [];
  return new Promise(function (resolve, reject) {
    // Get the profile of the current user
    connection.query('SELECT * FROM ' + USER + ' INNER JOIN ' + INSTRUMENTS +
      ' ON ' + USER + '.username=' + INSTRUMENTS + '.username INNER JOIN ' + INTERESTS +
      ' ON ' + USER + '.username=' + INTERESTS + '.username INNER JOIN ' + CONTACTS +
      ' ON ' + USER + '.username=' + CONTACTS + '.username WHERE ' + USER + '.username = \'' + username + '\' ', function (err, result) {
            if (err) reject(err);

            if(attribute === 'genre'){
              var selectedAttr = result[0].genre;
              // Do interest
              connection.query('SELECT username FROM ' + INTERESTS + ' WHERE ' +
                                INTERESTS + '.genre=\'' + selectedAttr + '\' AND NOT '
                                + INTERESTS + '.username=\'' + username + '\'', function(err, result) {
                                 if (err) throw err;
                                 var emptyFitt = [];
                                 for (var i in result) {
                                   var res = result[i].username;
                                   getProfile(res).then(function(data){
                                     console.log('in getprofile')
                                     listOfProfiles.push(data[0]);
                                   });
                                 }
                                 return resolve(listOfProfiles);
                               });
            }
            else if(attribute === 'instrument' || attribute === 'skill'){
              if(attribute === 'instrument') var selectedAttr = result[0].type;
              if(attribute === 'skill')      var selectedAttr = result[0].skill;
              console.log('skill värde ' + selectedAttr);

              // do instrument
              connection.query('SELECT username FROM ' + INSTRUMENTS + ' WHERE NOT ' + INSTRUMENTS + '.username=\'' + username + '\' AND ('+
                               INSTRUMENTS + '.type=\''+selectedAttr+'\' OR '+ INSTRUMENTS+'.skill=\'' + selectedAttr + '\')', function(err, result) {
                                 if (err) throw err;
                                 console.log(result);

                                 for (var i in result){
                                   var res = result[i].username;
                                   console.log('res: '+res);
                                   getProfile(res).then(function(data){
                                     listOfProfiles.push(data[0])
                                   });
                                 }
                                 return resolve(listOfProfiles);
                               });
            }
            else if(attribute === 'age' || attribute === 'band'){
              if(attribute === 'age')  var selectedAttr = result[0].age;
              if(attribute === 'band') var selectedAttr = result[0].band;

              connection.query('SELECT username FROM ' + USER + ' WHERE NOT '+ USER + '.username=\'' + username + '\' AND (' +
                               USER + '.age=\''+selectedAttr+'\' OR '+ USER + '.band=\'' + selectedAttr + '\')', function(err, result) {
                                 if (err) throw err;

                                 for (var i in result){
                                   var res = result[i].username;
                                   getProfile(res).then(function(data){
                                     listOfProfiles.push(data[0]);
                                   });
                                 }
                                 return resolve(listOfProfiles);
                               });
            }
        });
  });
}
