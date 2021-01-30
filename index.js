const inquirer = require('inquirer');
const cTable = require('console.table');

const DatabaseQuery = require('./lib/query');
const Department = require('./lib/department');
const Position = require('./lib/position');
const Prompts = require('./lib/prompts');

console.log(Prompts.initialPrompt)



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
}



const userViewEmployees = async () => {
    let response = '';
    await inquirer
    .prompt(Prompts.viewEmployeePrompts)
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

    if (response === Prompts.viewEmployeePrompts.choices[1]){
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

    if (response === Prompts.viewEmployeePrompts.choices[2]){
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
    }

    if (response === Prompts.viewEmployeePrompts.choices[3]){
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
    }

    main();

}


const main = () => {
    inquirer
    .prompt(Prompts.initialPrompt)
    .then(res => {
        if (res.option === Prompts.initialPrompt.choices[0]){
            userViewEmployees();
        };
        if (res.option === Prompts.initialPrompt.choices[1]){
            userAddDepartment();
        };

        if (res.option === Prompts.initialPrompt.choices[2]){
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
