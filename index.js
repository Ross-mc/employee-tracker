const inquirer = require('inquirer');
const { displayEmployees, getManagers } = require('./lib/query');

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

const managerSelectionPrompts = {
    type: 'list',
    name: 'manager',
    message: 'Which manager would you like to search by?',
    choices: []
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
            main();
        } catch(e){
            console.log(e)
        };
    };

    if (response === viewEmployeePrompts.choices[1]){
        const managers = await getManagers();
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
    }

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
