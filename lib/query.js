const mysql = require('mysql');

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
        department: `WHERE department.id = ${selection}`
    };

    const queryString = 
        `SELECT ${columns}
        FROM employee
        INNER JOIN position ON employee.role_id = position.id
        INNER JOIN department on department.id = position.department_id ${queryHash[grouping]}`

    connection.query(queryString, (err, res) => {
        if (err) throw err;
        console.log(res)
    });

};


