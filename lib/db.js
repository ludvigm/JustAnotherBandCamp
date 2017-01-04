module.exports = {
    connect,
    createTables,
    insertUser,
    printUserTable,
    close
};

const sql = require('mysql');

const config  = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'db'
};



let INSTRUMENTS = 'Instruments';
let USER = 'Users';
let INTERESTS = 'Interests';
let CONTACTS = 'Contacs';

var connection;

function connect() {
    console.log('Connecting...')
    connection = sql.createConnection(config);
    connection.connect(function(err) {
        if(err) throw err;
        console.log('Connected!')
        
    });
}

function createTables() {
    console.log('Creating tables');
    connection.query('CREATE TABLE ' + USER + '(username varchar(255), password varchar(255), age int, band varchar(255), PRIMARY KEY (username));'
        , function (err, res) {
            if (err) throw err;
            console.log(res);
        });
    console.log('Table created.');
}

function insertUser(user) {
  /*  connection.query('INSERT INTO ' + USER + ' SET ?', user, function (err, res) {
        if (err) throw err;

        console.log('user inserted');
        console.log(res);
    });*/

    connection.query('INSERT INTO ' + USER + ' (username, password, age, band) VALUES (benny, fitta, 22, kl0wn)');
}

function printUserTable() {
    console.log('TYRING TO PRINT?');
    connection.query('SELECT * FROM ' + USER , function(err,rows,fields) {
        console.log('ANYTHING')
    });
    console.log('PRINTED?')
}

function close() {
    connection.end();
}