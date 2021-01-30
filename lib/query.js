const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DaisyDog123',
    database: 'employee_DB'
});

connection.connect(err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
})

const columns = 'employee.id, employee.first_name, employee.last_name, department.department_name, position.title, position.salary';

const globalQueryString = `SELECT ${columns}
    FROM employee
    INNER JOIN position ON employee.role_id = position.id
    INNER JOIN department on department.id = position.department_id`;

const displayEmployees = (grouping, selection) => {
    const queryHash = {
        all: "",
        manager: `WHERE employee.manager_id = ${selection}`,
        department: `WHERE department.department_name = "${selection}"`,
        role: `WHERE position.title = "${selection}"`//use of quotes for strings
    };

    const query = queryHash[grouping]

    const queryString = `${globalQueryString} ${query}`;
    console.log(queryString)
    
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

const getManagers = () => {
    const queryString = `${globalQueryString} WHERE employee.manager_id IS NULL`
    return new Promise((resolve, reject) => {
        connection.query(queryString, (err, res) => {
            if (err){
                reject(err)
            } else{
                resolve(res);
            }
        })
    })
};

const getDepartments = () => {
    const queryString = `SELECT * FROM department`
    return new Promise((resolve, reject) => {
        connection.query(queryString, (err, res) => {
            if (err){
                reject(err)
            } else{
                resolve(res);
            }
        })
    })
};

const getRoles = () => {
    const queryString = `SELECT title FROM position`
    return new Promise((resolve, reject) => {
        connection.query(queryString, (err, res) => {
            if (err){
                reject(err)
            } else{
                resolve(res);
            }
        })
    })
};

const addDepartment = (departmentToAdd) => {
    const queryString = `INSERT INTO department (department_name) VALUES ("${departmentToAdd}")`;
    return new Promise((resolve, reject) => {
        connection.query(queryString, (err, res) => {
            if (err) throw reject(err);
            console.log(`${departmentToAdd} successfully added to database!`);
            resolve();
        })
    })

};

module.exports = {
    displayEmployees,
    getManagers,
    getDepartments,
    getRoles,
    addDepartment
};
