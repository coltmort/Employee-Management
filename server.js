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
// list of all possible actions
const allActionsPrompt = {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by department', 'View employees by manager', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Update employee manager', 'Update managerial status', 'Delete department', 'Delete role', 'Delete employee', 'View allocated budget for department']
}
// function to display employees on init
// async function init(){const employeesINIT = await db.promise().query('SELECT * from employees')

// console.table(employeesINIT[0])}
// init()

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
            case 'View employees by department':
                viewEmployeesByDepartment()
            break;
            case 'View employees by manager':
                viewEmployeesByManager()
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
            case 'Update managerial status':
                updateManagerialStatus()
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
async function addDepartment(){
    await inquirer.prompt({
        type: 'input',
        name: 'newDepartment',
        message: 'Please input new department name'
    }).then((answer) => {
        db.query(`INSERT INTO departments (department_name) VALUES ('${answer.newDepartment}')`, (err, result) => {
            db.query('SELECT * FROM departments', (err, result) => {
                console.table(result)
            });
        })
    })
    setTimeout(() => {
        begin()
    }, 10);
}
        // department is added to the database
// add a role,
    // enter the name, salary, and department for the role
async function addRole(){
    const departments = await db.promise().query('SELECT department_name FROM departments')
    const mappedDepartments = departments[0].map(x => x.department_name)

    await inquirer.prompt([{
        type: 'input',
        name: 'newRole',
        message: 'Please input new role'
    },{
        type: 'number',
        name: 'newRoleSalary',
        message: 'Please input the salary for the new role.'
    },{
        type: 'list',
        name: 'newRoleDepartment',
        message: 'Please select the department for the new role.',
        choices: mappedDepartments}]
    ).then(async (answers) => {
        let dept_id = await db.promise().query(`SELECT d.department_id FROM departments d where d.department_name = '${answers.newRoleDepartment}'`)

        await db.promise().query(`INSERT INTO roles (role_name, department_id, salary) VALUES ('${answers.newRole}', '${dept_id[0][0].department_id}', '${answers.newRoleSalary}')`)
    })
    setTimeout(() => {
        begin()
    }, 10);
}
        // that role is added to the database
// add an employee,
    // employee’s first name, last name, role, and manager,
async function addEmployee(){
    const roles = await db.promise().query('SELECT role_name FROM roles')
    const mappedRoles = roles[0].map(x => x.role_name)

    await inquirer.prompt([{
        type: 'input',
        name: 'newEmployeeFirstName',
        message: `Please input new employee's first name`
    },{
        type: 'input',
        name: 'newEmployeeLastName',
        message: `Please input new employee's last name`
    },{
        type: 'list',
        name: 'newRole',
        message: 'Please select the department for the new role.',
        choices: mappedRoles}]
    ).then(async (answers) => {

        let role_id = await db.promise().query(`SELECT r.role_id FROM roles r where r.role_name = '${answers.newRole}'`)

        await db.promise().query(`INSERT INTO employees (first_name, last_name, role, manager, is_manager) VALUES ('${answers.newEmployeeFirstName}','${answers.newEmployeeLastName}', '${role_id[0][0].role_id}', null, false)`)
    })
    setTimeout(() => {
        begin()
    }, 10);
}

        // employee is added to the database
// update an employee role

async function updateEmployeeRole(){
    let employees = await db.promise().query(`SELECT e.employee_id as ID, concat(e.first_name, ' ', e.last_name) as name, r.role_name AS Position
    FROM employees e
    LEFT JOIN roles r
    ON e.role = r.role_id`)

    let roles = await db.promise().query('SELECT role_name FROM roles')
    let mappedRoles = roles[0].map(x => x.role_name)

    let mappedEmployees = employees[0].map(x => 'ID: ' + x.ID + ' ' + x.name + ' ' + x.Position)

    let answer = await inquirer.prompt([{
        type: 'list',
        name: 'employeeToUpdateRole',
        message: `Who's role would you like to update?`,
        choices: mappedEmployees
    }])

    let splitName = await answer.employeeToUpdateRole.split(' ')
    let newRole = await inquirer.prompt([{
        type: 'list',
        name: 'updatedRole',
        message: `What is ${splitName[2]} ${splitName[3]}'s new role?`,
        choices: mappedRoles
    }])

    // let employeeIDToUpdate = await db.promise().query(`SELECT employee_id FROM employees WHERE first_name = '${splitName[0]}' and last_name = '${splitName[1]}'`)
    let newRoleID = await db.promise().query(`SELECT role_id FROM roles WHERE role_name = '${newRole.updatedRole}'`)
    db.query(`UPDATE employees SET role = ${newRoleID[0][0].role_id} WHERE employee_id = '${splitName[1]}'`)

    setTimeout(() => {
        begin()
    }, 10);
}
// Update employee managers.
async function updateEmployeeManager(){
    let employees = await db.promise().query(`SELECT e.employee_id as ID, concat(e.first_name, ' ', e.last_name) as name, concat(m.first_name, ' ', m.last_name) AS current_manager
    FROM employees e
    LEFT JOIN employees m
    ON e.manager = m.employee_id`)

    let managers = await db.promise().query(`SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) as name FROM employees e WHERE e.is_manager = 1`)

    let mappedManagers = managers[0].map(x =>'ID: ' + x.employee_id + ' ' + x.name)


    let mappedEmployees = employees[0].map(x => 'ID: ' + x.ID + ' ' + x.name + ' ' + 'Manager: ' + x.current_manager)

    let answer = await inquirer.prompt([{
        type: 'list',
        name: 'employeeToUpdateManager',
        message: `Who's manager would you like to update?`,
        choices: mappedEmployees
    }])

    let splitName = await answer.employeeToUpdateManager.split(' ')
    let newRole = await inquirer.prompt([{
        type: 'list',
        name: 'updatedManager',
        message: `Who is ${splitName[2]} ${splitName[3]}'s new manager?`,
        choices: mappedManagers
    }])

    // let employeeIDToUpdate = await db.promise().query(`SELECT employee_id FROM employees WHERE first_name = '${splitName[0]}' and last_name = '${splitName[1]}'`)
    let newManagerID = newRole.updatedManager.split(' ')[1]
    if (newManagerID === splitName[1]){
        console.error('An employee cannot manage themselves')
        return updateEmployeeManager()
    }
    db.query(`UPDATE employees SET manager = ${newManagerID} WHERE employee_id = '${splitName[1]}'`)

    setTimeout(() => {
        begin()
    }, 10);
}

// Updates if an employee can be assigned as manager
async function updateManagerialStatus(){
    let currentStatus = await db.promise().query(`SELECT employee_id, concat(first_name, ' ', last_name) AS name, is_manager AS status FROM employees`)

    let mappedStatus = currentStatus[0].map(x => 'ID: ' + x.employee_id + ' ' + x.name + ' Status: ' + x.status)

    let toUpdateStatus = await inquirer.prompt([{
        type: 'list',
        name: 'toUpdate',
        massage: `Which employee's managerial status would you like to toggle?`,
        choices: mappedStatus
    }])

    let toUpdateStatusSplit = toUpdateStatus.toUpdate.split(' ')
    let toUpdateID = toUpdateStatusSplit[1]
    let splitStatus = toUpdateStatusSplit[5]
    let newStatus
    if (splitStatus === 1){
        newStatus = 0
    } else {
        newStatus = 1
    }

    console.log(toUpdateID, splitStatus, newStatus)

    await db.promise().query(`UPDATE employees SET is_manager = '${newStatus}' WHERE employee_id = '${toUpdateID}'`)
    await db.promise().query(`UPDATE employees SET manager = null WHERE manager = '${toUpdateID}'`)

    setTimeout(() => {
        begin()
    }, 10);
}

// View employees by manager.
async function viewEmployeesByManager(){
    let managers = await db.promise().query(`SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) as name FROM employees e WHERE e.is_manager = 1`)

    let mappedManagers = managers[0].map(x =>'ID: ' + x.employee_id + ' ' + x.name)

    let manager = await inquirer.prompt([{
        type: 'list',
        name: 'manager',
        message: `Which manager's direct reports would you like to see?`,
        choices: mappedManagers
    }])
    let managerID = manager.manager.split(' ')
    let directReports = await db.promise().query(`SELECT employee_id, concat(first_name, ' ', last_name) as direct_reports FROM employees WHERE manager = ?`, managerID[1] )

    console.table(directReports[0])

    setTimeout(() => {
        begin()
    }, 10);
}
// View employees by department.
async function viewEmployeesByDepartment(){
    const departments = await db.promise().query('SELECT department_name FROM departments')
    const mappedDepartments = departments[0].map(x => x.department_name)

    let department = await inquirer.prompt([{
        type: 'list',
        name: 'department',
        message: `Which department's employees would you like to see?`,
        choices: mappedDepartments
    }])

    let deptID = await db.promise().query(`SELECT department_id FROM departments WHERE department_name = ?`, department.department)
    deptID = (deptID[0][0].department_id)

    let deptEmployees = await db.promise().query(`SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) as Dept_Employees FROM employees e LEFT JOIN roles r ON e.role = r.role_id WHERE r.department_id = ?`, deptID)

    console.table(deptEmployees[0])

    setTimeout(() => {
        begin()
    }, 10);
}
// Delete departments, roles, and employees.
async function deleteDepartment(){
    const departments = await db.promise().query('SELECT department_name FROM departments')
    const mappedDepartments = departments[0].map(x => x.department_name)

    let department = await inquirer.prompt([{
        type: 'list',
        name: 'department',
        message: `Which department would you like to delete?`,
        choices: mappedDepartments
    }])

    await db.promise().query(`DELETE FROM departments WHERE department_name = ?`, department.department)

    let newDepartmentList = await db.promise().query('SELECT department_name FROM departments')
    console.table(newDepartmentList[0])

    setTimeout(() => {
        begin()
    }, 10);
}

async function deleteRole(){
    const roles = await db.promise().query('SELECT role_name FROM roles')
    const mappedRoles = roles[0].map(x => x.role_name)

    let role = await inquirer.prompt([{
        type: 'list',
        name: 'role',
        message: `Which role would you like to delete?`,
        choices: mappedRoles
    }])

    await db.promise().query(`DELETE FROM roles WHERE role_name = ?`, role.role)
    let newRoleList = await db.promise().query('SELECT role_name as New_Role_list FROM roles')
    console.table(newRoleList[0])

    setTimeout(() => {
        begin()
    }, 10);
}

async function deleteEmployee(){
    let employees = await db.promise().query(`SELECT e.employee_id as ID, concat(e.first_name, ' ', e.last_name) as name, r.role_name AS Position
    FROM employees e
    LEFT JOIN roles r
    ON e.role = r.role_id`)

    let mappedEmployees = employees[0].map(x => 'ID: ' + x.ID + ' ' + x.name + ' ' + x.Position)

    let answer = await inquirer.prompt([{
        type: 'list',
        name: 'employeeToDelete',
        message: `Who's role would you like to update?`,
        choices: mappedEmployees
    }])

    let splitName = await answer.employeeToDelete.split(' ')

    await db.promise().query(`DELETE FROM employees WHERE employee_id = ?`, splitName[1])
    let newEmployeeList = await db.promise().query(`SELECT employee_id, concat(first_name, ' ', last_name) AS New_employee_list FROM employees`)
    console.table(newEmployeeList[0])

    setTimeout(() => {
        begin()
    }, 10);

}
// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
async function viewDepartmentBudget(){
    const departments = await db.promise().query('SELECT department_name FROM departments')
    const mappedDepartments = departments[0].map(x => x.department_name)

    for (let i = 0; i < mappedDepartments.length; i++) {
        const element = mappedDepartments[i];
        let budgets = await db.promise().query(`SELECT SUM(r.salary) AS '${element}_Budget' FROM employees e LEFT JOIN roles r ON e.role = r.role_id LEFT JOIN departments d ON r.department_id = d.department_id WHERE d.department_name = ?`, element)
        console.table(budgets[0])
    }
    setTimeout(() => {
        begin()
    }, 10);

}
begin()