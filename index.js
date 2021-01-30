const inquirer = require('inquirer');
const cTable = require('console.table');

const DatabaseQuery = require('./lib/query');
const Department = require('./lib/department');
const Position = require('./lib/position')

const initialPrompt = {
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: [
        'View employees',
        'Add department',
        'Add position',
        'Add employee',
        'Update existing employee',
        'Delete information',
        'View Departmental Budget',
        'Exit'
    ] //choices can be improved -- read inquirer docs
};

const viewEmployeePrompts = {
    type: 'list',
    name: 'option',
    message: 'How would you like to view employees?',
    choices: [
        'View all employees',
        'View all employees by manager',
        'View all employees by department',
        'View all employees by role',
    ]
};

const employeeBySelectionPrompts = (selection) => {
    return {
        type: 'list',
        name: `${selection}`,
        message: `Which ${selection} would you like to search by?`,
        choices: []
    }
};

const userAddDepartment = async () => {
    await inquirer
    .prompt({
        type: 'input',
        name: 'department',
        message: 'Please enter the name of the new department'
    })
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
    .prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Please enter the name of the new position'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Please enter the salary of the new position'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Please choose which department the position belongs to: ',
            choices: departments.map(department => department.department_name)
        }
    ])
    .then(async res => {
        let { title, salary, department } = res;
        salary = Number(salary);
        const departmentToFind = departments.filter(departmentObj => departmentObj.department_name === department);
        const departmentId = departmentToFind[0].id;
        const position = new Position(title, salary, departmentId);
        const newPosition = await DatabaseQuery.addPosition(position);
        if (newPosition.affectedRows > 0){
            console.log(`${title} successfully added!`)
        } else {
            throw new Error(newPosition.message);
        };

        main();
    })
}



const userViewEmployees = async () => {
    let response = '';
    await inquirer
    .prompt(viewEmployeePrompts)
    .then(res => {
        response = res.option
    });
    //to do: add hashmap logic, further program flow through the various queries ***improve choices
    if (response === 'View all employees') {
        try {
            const allEmployees = await DatabaseQuery.displayEmployees('all');
            const table = cTable.getTable(allEmployees);
            console.log(table)
            // console.log(await displayEmployees('all'));
        } catch(e){
            console.log(e)
        };
    };

    if (response === viewEmployeePrompts.choices[1]){
        const managers = await DatabaseQuery.getManagers();
        const managerSelectionPrompts = employeeBySelectionPrompts('manager')
        managerSelectionPrompts.choices = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
        await inquirer
        .prompt(managerSelectionPrompts)
        .then(async res => {
            const firstName = res.manager.split(' ')[0];
            const lastName = res.manager.split(' ')[1];
            const managerToFind = managers.filter(manager => manager.first_name === firstName && manager.last_name === lastName);
            const { id } = managerToFind[0];
            const result = await DatabaseQuery.displayEmployees('manager', id);
            const table = cTable.getTable(result);
            console.log(table)
        })
    };

    if (response === viewEmployeePrompts.choices[2]){
        const departments = await DatabaseQuery.getDepartments();
        const departmentSelectionPrompts = employeeBySelectionPrompts('department')
        departmentSelectionPrompts.choices = departments.map(department => department.department_name);
        await inquirer
        .prompt(departmentSelectionPrompts)
        .then(async res => {
            const result = await DatabaseQuery.displayEmployees('department', res.department);
            const table = cTable.getTable(result);
            console.log(table)
        })
    }

    if (response === viewEmployeePrompts.choices[3]){
        const roles = await DatabaseQuery.getRoles();
        const roleSelectionPrompts = employeeBySelectionPrompts('role');
        roleSelectionPrompts.choices = roles.map(role => role.title);
        await inquirer
        .prompt(roleSelectionPrompts)
        .then(async res => {
            const result = await DatabaseQuery.displayEmployees('role', res.role);
            const table = cTable.getTable(result);
            console.log(table)
        })
    }

    main();

}


const main = () => {
    inquirer
    .prompt(initialPrompt)
    .then(res => {
        if (res.option === initialPrompt.choices[0]){
            userViewEmployees();
        };
        if (res.option === initialPrompt.choices[1]){
            userAddDepartment();
        };

        if (res.option === initialPrompt.choices[2]){
            userAddPosition();
        }


        if (res.option === 'Exit'){
            process.exit()
        };


    });


    //add hashmap logic
};
console.log('Welcome to the Employee Tracking Database')
main();

module.exports = main;
