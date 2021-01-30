class Prompts {
    initialPrompt = {
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
    
    viewEmployeePrompts = {
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
    
    employeeBySelectionPrompts = (selection) => {
        return {
            type: 'list',
            name: `${selection}`,
            message: `Which ${selection} would you like to search by?`,
            choices: []
        }
    };

    newDepartmentPrompt = {
        type: 'input',
        name: 'department',
        message: 'Please enter the name of the new department'
    };

    newPositionPrompts = (departments) => [
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
            choices: departments
        }
    ];
};

module.exports = new Prompts();