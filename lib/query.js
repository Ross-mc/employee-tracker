const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DaisyDog123',
    database: 'employee_DB'
});

const columns = 'employee.id, employee.first_name, employee.last_name, department.department_name, position.title, position.salary'

const displayEmployees = (grouping, selection) => {
    const queryHash = {
        all: "",
        manager: `WHERE employee.manager_id = ${selection}`,
        department: `WHERE department.id = ${selection}`,
        role: `WHERE position.title = "${selection}"`//use of quotes because role may include spaces which will break sql query syntax
    };

    const queryString = 
        `SELECT ${columns}
        FROM employee
        INNER JOIN position ON employee.role_id = position.id
        INNER JOIN department on department.id = position.department_id 
        ${queryHash[grouping]}`;
    
    return new Promise((resolve, reject) => {
        connection.query(queryString, (err, res) => {
            if (err) {
                reject(err);
            } else {
                const table = cTable.getTable(res);
                resolve(table)
            }
        })
    })

};

module.exports = displayEmployees;
