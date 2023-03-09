const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'root',
      database: 'employee_management_db'
    },
    console.log(`Connected to the employee_management_db database.`)
  );
// sudo
// list of all possible actions
const allActionsPrompt = {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Update employee manager', 'View employees by department', 'Delete department', 'Delete role', 'Delete employee', 'View allocated budget for department']
}

function begin(){
    inquirer.prompt(allActionsPrompt).then((answer) => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments()
            break;
            case 'View all roles':
                viewAllRoles()
            break;
            case 'View all employees':
                viewAllEmployees()
            break;
            case 'Add a department':
                addDepartment()
            break;
            case 'Add a role':
                addRole()
            break;
            case 'Add an employee':
                addEmployee()
            break;
            case 'Update employee role':
                updateEmployeeRole()
            break;
            case 'Update employee manager':
                updateEmployeeManager()
            break;
            case 'View employees by department':
                viewEmployeesByDepartment()
            break;
            case 'View employees by manager':
                viewEmployeesByManager()
            break;
            case 'Delete department':
                deleteDepartment()
            break;
            case 'Delete role':
                deleteRole()
            break;
            case 'Delete employee':
                deleteEmployee()
            break;
            case 'View allocated budget for department':
                viewDepartmentBudget()
            break;
        }
    })
}
// view all departments,
    // show departments and department ids
function viewAllDepartments(){
    db.query('SELECT * FROM departments', (err, result) => {
        console.table(result)
    });

    setTimeout(() => {
        begin()
    }, 10);

}
// view all roles,
    // show roles, job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles(){
    db.query('SELECT * FROM roles', (err, result) => {
        console.table(result)
    });

    setTimeout(() => {
        begin()
    }, 10);

}

// view all employees,
    // employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees(){
    db.query(`SELECT e.employee_id as ID, e.first_name, e.last_name, r.role_name AS Position, r.salary, d.department_name as Department, concat(m.first_name,' ', m.last_name) AS manager
    FROM employees e
    LEFT JOIN roles r
    ON e.role = r.role_id
    LEFT JOIN departments d
    ON r.department_id = d.department_id
    LEFT JOIN employees m
    ON e.manager = m.employee_id`, (err, result) => {
        console.table(result)
    });

    setTimeout(() => {
        begin()
    }, 10);

}

// add a department,
    // enter the name of the department
function addDepartment(){
    inquirer.prompt()
}
        // department is added to the database
// add a role,
    // enter the name, salary, and department for the role
function addRole(){

}
        // that role is added to the database
// add an employee,
    // employee’s first name, last name, role, and manager,
function addEmployee(){

}
        // employee is added to the database
// update an employee role
function updateEmployeeRole(){

}
// Update employee managers.
function updateEmployeeManager(){

}
// View employees by manager.
function viewEmployeesByManager(){

}
// View employees by department.
function viewEmployeesByDepartment(){

}
// Delete departments, roles, and employees.
function deleteDepartment(){

}

function deleteRole(){

}

function deleteEmployee(){

}
// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
function viewDepartmentBudget(){
    
}
begin()