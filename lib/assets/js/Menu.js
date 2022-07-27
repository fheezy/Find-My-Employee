const inquirer = require('inquirer');
const db = require('../../../config/connection.js');
require('console.table');

const deptArr = [];
const roleArr = [];
const empArr = [];
const selectEmpArr = [];
const selectRoleArr = [];

const promptManagementList = {
        type: 'list',
        name: 'managementOptions',
        message: 'choose a management option',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role'
        ]
};

const promptDeptName = {
    type: 'input',
    name: 'deptName',
    message: 'You opted to create a new department. What shall the department name be?',
    validate: response => {
        if (response) {
            return true;
        }
        else {
            console.log('The response was empty. Please try again.')
            return false;
        }
    }
};

const promptRole = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the title of the new role?',
        validate: response => {
            if (response) {
                return true;
            }
            else {
                console.log('The response was empty. Please try again.')
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the new role?',
        validate: response => {
            if (response) {
                return true;
            }
            else {
                console.log('The response was empty. Please try again.')
                return false;
            }
        }
    },
    {
        type: 'list',
        name: 'department',
        choices: deptArr,
        message: 'Which department is this role in?'
    }
];

const promptEmployee = [
    {
      type: 'input',
      name: 'firstname',
      message: 'What is the employee\'s first name?'
    },
    {
      type: 'input',
      name: 'lastname',
      message: 'what is the employee\'s last name?'
    },
    {
      type: 'list',
      name: 'roleid',
      choices: roleArr,
      message: 'what is the employee\'s role?'
    },
    {
      type: 'list',
      name: 'managerid',
      choices: empArr,
      message: 'who is the employee\'s manager? (could be null)'
    }
];

const promptEmployeeRole = [
    {
        type: 'list',
        name: 'first_name',
        choices: selectEmpArr,
        message: 'Please select an employee to update their role.'
    },
    {
    type: 'list',
    name: 'role_id',
    choices: selectRoleArr,
    message: 'Please list this employee\'s new role.'
    }
];

class Menu {
    constructor() {

    }
    mainMenu() {
        // console.log(`
        // =================
        //     Main Menu
        // =================
        //     `)
        // return inquirer
        //     .prompt(promptManagementList)
        //     .then(selectionInput => {
        //         switch (selectionInput.managementOptions) {
        //             case 'View All Departments':
        //                 this.viewDepartments();
        //                 break;
        //             case 'View All Roles':
        //                 this.viewRoles();
        //                 break;
        //             case 'View All Employees':
        //                 this.viewEmployees();
        //                 break;
        //             case 'Add a Department':
        //                 inquirer.prompt(promptDeptName).then(response => {
        //                     const deptName = response.deptName;
        //                     this.addDepartment(deptName);
        //                 });
        //                 break;
        //             case 'Add a Role':
        //                 const addR = `SELECT * FROM departments`;    
        //                 db.query(addR, (err, res) => {
        //                     if (err) throw err;
        //                     res.forEach(dept => {
        //                         let qObj = {
        //                             name: dept.name,
        //                             value: dept.id
        //                         }
        //                         deptArr.push(qObj);
        //                     })
        //                 });

        //                 inquirer.prompt(promptRole).then(response => {
        //                     this.addRole(response);
        //                 });
        //                 break;
        //             case 'Add an Employee':
        //                 const addRole = `SELECT * FROM roles`;
        //                 const addEmp = `SELECT * FROM employees`;

        //                 db.query(addRole, (err, res) => {
        //                     if (err) throw err;
        //                     res.forEach(role => {
        //                         let qObj = {
        //                             name: role.roleid,
        //                             value: role.id
        //                         }
        //                         roleArr.push(qObj);
        //                     })
        //                 });

        //                 db.query(addEmp, (err, res) => {
        //                     if (err) throw err;
        //                     res.forEach(emp => {
        //                         let qObj = {
        //                             name: emp.managerid,
        //                             value: emp.id
        //                         }
        //                         empArr.push(qObj);
        //                     })
        //                 });

        //                 inquirer.prompt(promptEmployee).then(response => {
        //                     this.addEmployee(response);
        //                 });
        //                 break;
        //             case 'Update an Employee Role':
        //                 const sEmployee = `SELECT * FROM employees`;
        //                 const sRole = `SELECT * FROM roles`;

        //                 db.query(sEmployee, (err, res) => {
        //                     if (err) throw err;
        //                     res.forEach(employee => {
        //                         let qObj = {
        //                             name: employee.first_name,
        //                             value: employee.id
        //                         }
        //                         selectEmpArr.push(qObj);
        //                     })
        //                 });

        //                 db.query(sRole, (err, res) => {
        //                     if (err) throw err;
        //                     res.forEach(role => {
        //                         let qObj = {
        //                             name: role.title,
        //                             value: role.id
        //                         }
        //                         selectRoleArr.push(qObj);
        //                     })
        //                 });

        //                 inquirer.prompt(promptEmployeeRole).then(response => {
        //                     console.log('what HELL is my response???')
        //                     this.updateEmployeeRole(response);
        //                 });
        //                 break;
        //         }
        //     });
    }
    viewDepartments() {
        const sql = `SELECT * FROM departments`;
        
        return db.query(sql, (err, rows) => {
            if (err) throw err;

            console.table(rows);

            this.mainMenu();
        });
    }
    viewRoles() {
        const sql = `
        SELECT roles.*, departments.name
        AS department_name
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id
        `;
        
        return db.query(sql, (err, rows) => {
            if (err) throw err;

            console.table(rows);

            this.mainMenu();
        });
    }
    viewEmployees() {
        const sql = `
        SELECT *
        FROM employees
        LEFT JOIN roles
        ON employees.role_id = roles.id
        `;
        
        return db.query(sql, (err, rows) => {
            if (err) throw err;

            console.table(rows);

            this.mainMenu();
        });
    }
    addDepartment(dept_name) {
        const sql = `
            INSERT INTO departments (name)
            VALUES
                ('${dept_name}');
        `
        
        return db.query(sql, (err, rows) => {
            if (err) throw err;

            console.table(rows);

            this.mainMenu();
        });
    }
    addRole(dbRole) {
        const { title, salary, department } = dbRole;
        const sql = `
            INSERT INTO roles (title, salary, department_id)
            VALUES
                ('${title}', ${salary}, ${department});
        `

        return db.query(sql, (err, rows) => {
            if (err) throw err;
            console.log('Successfully added a role to the database.');
            this.mainMenu();
        });
    }
    addEmployee(dbEmployee) {
        const { firstname, lastname, roleid, managerid } = dbEmployee;
        const sql = `
            INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES
                ('${firstname}', '${lastname}', '${roleid}', '${managerid}');
        `

        return db.query(sql, (err, rows) => {
            if (err) throw err;
            console.log('Successfully added an employee to the database.');
            this.mainMenu();
        });
    }
    updateEmployeeRole(dbEmployeeRole) {
        console.log(dbEmployeeRole);
        /* const { firstname, lastname, roleid, managerid } = dbEmployeeRole; */
        const sql = `UPDATE employee SET role_id = ${result.role_id} WHERE id = ${employeeID}`

        return db.query(sql, (err, rows) => {
            if (err) throw err;
            console.log('Successfully added an employee to the database.');
            this.mainMenu();
        });
    }
};

module.exports = Menu;