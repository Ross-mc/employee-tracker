const inquirer = require('inquirer');
const { displayEmployees, getManagers, getDepartments, getRoles, addDepartment } = require('./lib/query');
const Department = require('./lib/department');

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
            main() 
        } catch(e){
            console.log(e)
        };
    };

    if (response === viewEmployeePrompts.choices[1]){
        const managers = await getManagers();
        const managerSelectionPrompts = employeeBySelectionPrompts('manager')
        managerSelectionPrompts.choices = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
        inquirer
        .prompt(managerSelectionPrompts)
        .then(async res => {
            const firstName = res.manager.split(' ')[0];
            const lastName = res.manager.split(' ')[1];
            const managerToFind = managers.filter(manager => manager.first_name === firstName && manager.last_name === lastName);
            const { id } = managerToFind[0];
            const result = await displayEmployees('manager', id);
            console.log(result)
            main();
        })
    };

    if (response === viewEmployeePrompts.choices[2]){
        const departments = await getDepartments();
        const departmentSelectionPrompts = employeeBySelectionPrompts('department')
        departmentSelectionPrompts.choices = departments.map(department => department.department_name);
        inquirer
        .prompt(departmentSelectionPrompts)
        .then(async res => {
            const result = await displayEmployees('department', res.department);
            console.log(result);
            main();
        })
    }

    if (response === viewEmployeePrompts.choices[3]){
        const roles = await getRoles();
        const roleSelectionPrompts = employeeBySelectionPrompts('role');
        roleSelectionPrompts.choices = roles.map(role => role.title);
        inquirer
        .prompt(roleSelectionPrompts)
        .then(async res => {
            const result = await displayEmployees('role', res.role);
            console.log(result)
            main();
        })
    }

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
