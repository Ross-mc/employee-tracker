const mysql = require('mysql');
const util = require('util')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_DB',
});

// connection.connect(err => {
//     if (err) {
//         console.error("error connecting: " + err.stack);
//         return;
//     }
// });

connection.query = util.promisify(connection.query);

module.exports = connection;