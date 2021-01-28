const inquirer = require('inquirer');
const displayEmployees = require('./lib/query');

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
        'Exit'
    ]
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

const managerSelectionPrompts = {
    type: 'input',
    name: 'manager',
    message: 'Please enter the name of the manager you wish to search for'
}

const userViewEmployees = async () => {
    let response;
    await inquirer
    .prompt(viewEmployeePrompts)
    .then(res => {
        response = res.option
    });
    //to do: add hashmap logic, further program flow through the various queries

    try {
        if (response === 'View all employees'){
            console.log(await displayEmployees('all'));
            
        }
        main();
    } catch(e){
        console.log(e)
    };



}


const main = () => {
    inquirer
    .prompt(initialPrompt)
    .then(res => {
        if (res.option === initialPrompt.choices[0]){
            userViewEmployees();
        }
    });

    //add hashmap logic
};

main();

module.exports = main;
