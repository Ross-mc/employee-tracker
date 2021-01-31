const inquirer = require('inquirer');
const cTable = require('console.table');

const DatabaseQuery = require('./lib/query');
const Department = require('./lib/department');
const Position = require('./lib/position');
const Employee = require('./lib/employee')
const Prompts = require('./lib/prompts');



const userAddDepartment = async () => {
    await inquirer
    .prompt(Prompts.newDepartmentPrompt)
    .then(async res => {
        const newDepartment = await DatabaseQuery.addDepartment(res.department);
        if (newDepartment.affectedRows > 0){
            console.log(`${title} successfully added!`)
        } else {
            throw new Error(newDepartment.message);
        };
        main();
    });
};

const userAddPosition = async () => {
    const departments = await DatabaseQuery.getDepartments();
    await inquirer
    .prompt(Prompts.newPositionPrompts(departments))
    .then(async res => {
        let { title, salary, department } = res;
        salary = Number(salary);
        const departmentToFind = departments.find(departmentObj => departmentObj.department_name === department);
        const departmentId = departmentToFind.id;
        const position = new Position(title, salary, departmentId);
        const newPosition = await DatabaseQuery.addPosition(position);
        if (newPosition.affectedRows > 0){
            console.log(`${title} successfully added!`)
        } else {
            throw new Error(newPosition.message);
        };

        main();
    })
};

const userAddEmployee = async () => {
    const roles = await DatabaseQuery.getRoles();
    const roleTitles = roles.map(role => role.title);
    const managers = await DatabaseQuery.getManagers();
    const managerNames = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
    await inquirer
    .prompt(Prompts.newEmployeePrompts(roleTitles, managerNames))
    .then(async res => {
        const { first_name, last_name, roleTitle, managerName } = res;

        const roleToFind = roles.find(role => role.title === roleTitle);
        const role_id = roleToFind.id;

        const managerToFind = managers.find(manager => `${manager.first_name} ${manager.last_name}` === managerName);

        const newEmployee = new Employee(first_name, last_name, role_id);

        if (managerToFind !== undefined){
            newEmployee.manager_id = managerToFind.id
        };

        const employee = await DatabaseQuery.addEmployee(newEmployee);

        if (employee.affectedRows > 0){
            console.log(`${first_name} ${last_name} successfully added!`)
        } else {
            throw new Error(employee.message);
        };

        main();
    })
}

const viewAllEmployees = async () => {
    try {
        const allEmployees = await DatabaseQuery.displayEmployees('all');
        const table = cTable.getTable(allEmployees);
        console.log(table)
    } catch(e){
        console.log(e)
    };
};

const viewEmployeesByManager = async () => {
    const managers = await DatabaseQuery.getManagers();
    const managerSelectionPrompts = Prompts.employeeBySelectionPrompts('manager')
    managerSelectionPrompts.choices = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
    await inquirer
    .prompt(managerSelectionPrompts)
    .then(async res => {
        const firstName = res.manager.split(' ')[0];
        const lastName = res.manager.split(' ')[1];
        const managerToFind = managers.find(manager => manager.first_name === firstName && manager.last_name === lastName);
        const { id } = managerToFind;
        const result = await DatabaseQuery.displayEmployees('manager', id);
        const table = cTable.getTable(result);
        console.log(table)
    })
};

const viewEmployeesByDepartment = async () => {
    const departments = await DatabaseQuery.getDepartments();
    const departmentSelectionPrompts = Prompts.employeeBySelectionPrompts('department')
    departmentSelectionPrompts.choices = departments.map(department => department.department_name);
    await inquirer
    .prompt(departmentSelectionPrompts)
    .then(async res => {
        const result = await DatabaseQuery.displayEmployees('department', res.department);
        const table = cTable.getTable(result);
        console.log(table)
    })
};

const viewEmployeesByRole = async () => {
    const roles = await DatabaseQuery.getRoles();
    const roleSelectionPrompts = Prompts.employeeBySelectionPrompts('role');
    roleSelectionPrompts.choices = roles.map(role => role.title);
    await inquirer
    .prompt(roleSelectionPrompts)
    .then(async res => {
        const result = await DatabaseQuery.displayEmployees('role', res.role);
        const table = cTable.getTable(result);
        console.log(table)
    })
};

const viewEmployeeHash = {
    viewAll: viewAllEmployees,
    viewByManager: viewEmployeesByManager,
    viewByDepartment: viewEmployeesByDepartment,
    viewByRole: viewEmployeesByRole
};

const userViewEmployees = async () => {
    let response = '';
    await inquirer
    .prompt(Prompts.viewEmployeePrompts)
    .then(res => {
        response = res.option
    });

    const nextProcess = viewEmployeeHash[response]
    await nextProcess();
    main();

}

const initialPromptHash = {
    viewEmployees: userViewEmployees,
    viewDepartment: userAddDepartment,
    addPosition: userAddPosition,
    addEmployee: userAddEmployee,
    // updateEmployee: userUpdateEmployee,
    // deleteInformation: deleteInformation,
    // viewBudget: viewBudget,
    exit: process.exit
}


const main = () => {
    inquirer
    .prompt(Prompts.initialPrompt)
    .then(res => {
        const nextProcess = initialPromptHash[res.option];
        nextProcess();
    });


    //add hashmap logic
};
console.log('Welcome to the Employee Tracking Database')
main();

module.exports = main;
