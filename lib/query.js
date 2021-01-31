const connection = require('./connect');


class DatabaseQuery {
    constructor(connection){
        this.connection = connection;
    }

     columns = 'employee.id, employee.first_name, employee.last_name, department.department_name, position.title, position.salary';

     globalQueryString = `SELECT ${this.columns}
        FROM employee
        INNER JOIN position ON employee.role_id = position.id
        INNER JOIN department on department.id = position.department_id`;

    displayEmployees = (grouping, selection) => {
        const queryHash = {
            all: "",
            manager: `WHERE employee.manager_id = ${selection}`,
            department: `WHERE department.department_name = "${selection}"`,
            role: `WHERE position.title = "${selection}"`//use of quotes for strings
        };
        const query = queryHash[grouping];
        const queryString = `${this.globalQueryString} ${query}`;
        return this.connection.query(queryString);
    };

    getManagers = () => {
        const queryString = `${this.globalQueryString} WHERE employee.manager_id IS NULL`
        return this.connection.query(queryString);
    };

    getDepartments = () => {
        const queryString = `SELECT * FROM department`
        return this.connection.query(queryString)
    };

    getRoles = () => {
        const queryString = `SELECT title, id FROM position`
        return this.connection.query(queryString)
    };

    addDepartment = (departmentToAdd) => {
        const queryString = `INSERT INTO department (department_name) VALUES ("${departmentToAdd}")`;
        this.connection.query(queryString, (err, res) => {
            if (err) throw err;
            else console.log(`${departmentToAdd} successfully added to database`);
        })
    };

    addPosition = position => {    
        return this.connection.query("INSERT INTO position SET ?", position)
    };

    addEmployee = employee => {
        return this.connection.query("INSERT INTO employee SET ?", employee)
    };

    updateEmployee = (columnToUpdate, newValue, employeeId) => {

        return this.connection.query("UPDATE employee SET ?? = ? WHERE employee.id = ?", [columnToUpdate, newValue, employeeId])
    };

    deleteRow = (table, value) => {
        return this.connection.query(`DELETE FROM ${table} WHERE id = ?`, [value])
    }
}

module.exports = new DatabaseQuery(connection); 
