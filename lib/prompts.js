class Prompts {
    initialPrompt = {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
            {
                name:'View employees',
                value: "viewEmployees"
            },
            {
                name:'Add department',
                value: "addDepartment"
            },
            {
                name:'Add position',
                value: "addPosition"
            },
            {
                name:'Add employee',
                value: "addEmployee"
            },
            {
                name:'Update existing employee',
                value: "updateEmployee"
            },
            {
                name:'Delete information',
                value: "deleteInformation"
            },
            {
                name:'View Departmental Budget',
                value: "viewBudget"
            },
            {
                name: 'Exit',
                value: "exit"
            }
        ] //choices can be improved -- read inquirer docs
    };
    
    viewEmployeePrompts = {
        type: 'list',
        name: 'option',
        message: 'How would you like to view employees?',
        choices: [
            {
                name:'View all employees',
                value: "viewAll"
            },
            {
                name:'View all employees by manager',
                value: "viewByManager"
            },
            {
                name:'View all employees by department',
                value: "viewByDepartment"
            },
            {
                name:'View all employees by role',
                value: "viewByRole"
            }
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

    newPositionPrompts = (departments) => {
        return [
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

    newEmployeePrompts = (roles, managers) => {
        return [
            {
                type: 'input',
                name: 'first_name',
                message: 'Please enter the first name of the new employee'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Please enter the last name of the new employee'
            },
            {
                type: 'list',
                name: 'roleTitle',
                message: 'Which role will this employee have?',
                choices: roles
            },
            {
                type: 'list',
                name: 'managerName',
                message: 'Who is this employees manager?',
                choices: [...managers, 'None']
            }
        ];
    };
};

module.exports = new Prompts();