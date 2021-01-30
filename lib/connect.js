const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DaisyDog123',
    database: 'employee_DB',
});

// connection.connect(err => {
//     if (err) {
//         console.error("error connecting: " + err.stack);
//         return;
//     }
// });

module.exports = connection;