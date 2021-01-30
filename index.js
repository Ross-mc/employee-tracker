const inquirer = require('inquirer');

const { displayEmployees, getManagers, getDepartments, getRoles, addDepartment, addPosition } = require('./lib/query');
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
        await addDepartment(res.department);
        main();
    });
};

const userAddPosition = async () => {
    const departments = await getDepartments();
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
        console.log(position)
        await addPosition(position);
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
            console.log(await displayEmployees('all'));
        } catch(e){
            console.log(e)
        };
    };

    if (response === viewEmployeePrompts.choices[1]){
        const managers = await getManagers();
        const managerSelectionPrompts = employeeBySelectionPrompts('manager')
        managerSelectionPrompts.choices = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
        await inquirer
        .prompt(managerSelectionPrompts)
        .then(async res => {
            const firstName = res.manager.split(' ')[0];
            const lastName = res.manager.split(' ')[1];
            const managerToFind = managers.filter(manager => manager.first_name === firstName && manager.last_name === lastName);
            const { id } = managerToFind[0];
            const result = await displayEmployees('manager', id);
            console.log(result)
        })
    };

    if (response === viewEmployeePrompts.choices[2]){
        const departments = await getDepartments();
        const departmentSelectionPrompts = employeeBySelectionPrompts('department')
        departmentSelectionPrompts.choices = departments.map(department => department.department_name);
        await inquirer
        .prompt(departmentSelectionPrompts)
        .then(async res => {
            const result = await displayEmployees('department', res.department);
            console.log(result);
        })
    }

    if (response === viewEmployeePrompts.choices[3]){
        const roles = await getRoles();
        const roleSelectionPrompts = employeeBySelectionPrompts('role');
        roleSelectionPrompts.choices = roles.map(role => role.title);
        await inquirer
        .prompt(roleSelectionPrompts)
        .then(async res => {
            const result = await displayEmployees('role', res.role);
            console.log(result)
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
