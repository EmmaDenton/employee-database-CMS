const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeeCMS_db'
  }
);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the employeeCMS_db database.');
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
  const query = 'SELECT * FROM employee';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving Employees:', err);
      return;
    }

    console.log('All Employees:');
    for (const employee of results) {
      console.log(`ID: ${employee.id}, First Name: ${employee.first_name}, Last Name: ${employee.last_name}`);
    }
    init();
  });
}

function viewAllDepartments() {
  const query = 'SELECT * FROM department';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving Departments:', err);
      return;
    }

    console.log('All Departments:');
    for (const department of results) {
      console.log(`ID: ${department.id}, Department Name: ${department.department_name}`);
    }
    init();
  });
}

function addEmployee() {
  const rolesQuery = 'SELECT id, title FROM role';
  const employeesQuery = 'SELECT first_name, id FROM employee';

  db.query(rolesQuery, (err, roles, employees) => {
    if (err) {
      console.error('Error retrieving roles:', err);
      return;
    }

    const roleChoices = roles.map((role) => ({ name: role.title, value: role.id }));
    const managerChoices = employees.map((employee) => ({ name: employee.first_name, value: employee.id }));

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
          choices: roleChoices,
        },
        {
          type: 'list',
          name: 'employeeManager',
          message: "What is this employee's manager?",
          choices: managerChoices,
        },
      ])
      .then((answer) => {
        const firstName = answer.employeeFirstname;
        const lastName = answer.employeeLastname;
        const roleId = answer.employeeRole;
        const managerId = answer.employeeManager;


        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

        db.query(query, [firstName, lastName, roleId, managerId], (err, result) => {
          if (err) {
            console.error('Error adding employee:', err);
            return;
          }

          console.log(`Employee "${firstName} ${lastName}" added successfully.`);
          init();
        });
      });
  });
}

function updateEmployeeRole() {
  const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
  db.query(employeesQuery, (err, employees) => {
    if (err) {
      console.error('Error retrieving employees:', err);
      return;
    }

    const rolesQuery = 'SELECT id, title FROM role';
    db.query(rolesQuery, (err, roles) => {
      if (err) {
        console.error('Error retrieving roles:', err);
        return;
      }

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeName',
            message: "Which employee's role do you want to update?",
            choices: employees.map((employee) => employee.name),
          },
          {
            type: 'list',
            name: 'newRoleId',
            message: "Which role do you want to assign to the selected employee?",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          const selectedEmployeeName = answer.employeeName;
          const selectedEmployee = employees.find((employee) => employee.name === selectedEmployeeName);
          const newRoleId = answer.newRoleId;

          const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';

          db.query(updateQuery, [newRoleId, selectedEmployee.id], (err, result) => {
            if (err) {
              console.error('Error updating employee role:', err);
              return;
            }

            console.log(`Role updated successfully for ${selectedEmployeeName}`);
            init();
          });
        });
    });
  });
}

function viewAllRoles() {
  const query = 'SELECT * FROM role';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving roles:', err);
      return;
    }

    console.log('All Roles:');
    for (const role of results) {
      console.log(`ID: ${role.id}, Title: ${role.title}, Salary: ${role.salary}, Department ID: ${role.department_id}`);
    }
    init();
  });
}

function addRole() {
  const departmentQuery = 'SELECT id, department_name FROM department';

  db.query(departmentQuery, (err, department) => {
    if (err) {
      console.error('Error retrieving department:', err);
      return;
    }

    const departmentChoices = department.map((department) => ({ name: department.department_name, value: department.id }));

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
  
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'What department is this role in?',
        choices: departmentChoices,
      },
    ])
    .then((answer) => {
      const roleName = answer.roleName;
      const roleSalary = parseFloat(answer.roleSalary);
  
  
      const query = 'INSERT INTO role (title, salary) VALUES (?, ?)';
  
      db.query(query, [roleName, roleSalary], (err, result) => {
        if (err) {
          console.error('Error adding role:', err);
          return;
        }
  
        console.log(`Role "${roleName}" added successfully with a salary of ${roleSalary}.`);
        init();
        });
      });
  });
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
      const departmentName = answer.departmentName;
      const query = 'INSERT INTO department (department_name) VALUES (?)';

      db.query(query, [departmentName], (err, result) => {
        if (err) {
          console.error('Error adding department:', err);
          return;
        }

        console.log(`Department "${departmentName}" added successfully.`);
        init();
      });
    });
}

init();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
