const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL Username
    user: 'root',
    // TODO: Add MySQL Password
    password: '',
    database: 'books_db'
  }
);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the books_db database.');
});


const starterQuestion = [
  {
    type: 'list',
    name: 'init',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
  },
];

function init() {
  inquirer.prompt(starterQuestion).then((answer) => {
    switch (answer.init) {
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Quit':
        db.end();
        break;
    }
  });
}

function viewAllEmployees() {

}

function addEmployee() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'employeeFirstname',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'employeeLastname',
      message: "What is the employee's last name?",
    },
    {
      type: 'list',
      name: 'employeeRole',
      message: "What is this employee's role?",
      choices: ['Role'],
    },
    {
      type: 'list',
      name: 'employeeManager',
      message: "Who is this employee's manager?",
      choices: ['Manager'],
    },
  ])
  .then((answer) => {
  
    console.log('Employee added successfully.');
    init();
  });
}

function updateEmployeeRole() {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'employeeName',
      message: "Which employee's role do you want to update?",
      choices: ['Employee'],
    },
    {
      type: 'list',
      name: 'newRole',
      message: "Which role do you want to assign to the selected employee?",
      choices: ['Role']
    },
  ])
  .then((answer) => {
    const employeeName = answer.employeeName;
    const newRole = answer.newRole;

    console.log(`Role updated successfully for ${employeeName}`);
    init();
  });
}

function viewAllRoles() {

}

function addRole() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'roleName',
      message: 'What is the name of the role?',
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'What is the salary of the role?',
    },
  ])
  .then((answer) => {

    console.log(`Role "${answer.roleName}" added successfully.`);
    init();
  });
}

function viewAllDepartments() {

}

function addDepartment() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'What is the name of the department?',
    },
  ])
  .then((answer) => {
 
    console.log(`Department "${answer.departmentName}" added successfully.`);
    init();
  });
}

init();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
