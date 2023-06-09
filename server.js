require('dotenv').config();
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Maki2013',
    database: 'employee_db'
  },
  () => console.log(`Connected to the ${db.database} database.`)
);

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Update employee manager',
          'View employees by manager',
          'View employees by department',
          'Delete department',
          'Delete role',
          'Delete employee',
          'View total utilized budget of a department',
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });

      if (answers.action === 'Exit') {
        console.log('Goodbye!');
        db.end();
        return;
      }

      // Perform the appropriate action based on the user's selection
      switch (answers.action) {
        case 'View all departments':
          db.query('SELECT id, name FROM department_table;', (err, results) => {
            if (err) {
              console.error('Error retrieving departments:', err);
            } else {
              console.table(results);
            }
            db.end();
            mainMenu();
          });
          break;
        case 'View all roles':
          db.query('SELECT role_table.id, role_table.title, role_table.salary, department_table.name AS department FROM role_table INNER JOIN department_table ON role_table.department_id = department_table.id;', (err, results) => {
            if (err) {
              console.error('Error retrieving roles:', err);
            } else {
              console.table(results);
            }
            db.end();
            mainMenu();
          });
          break;
        case 'View all employees':
          db.query('SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.name AS department, role_table.salary, CONCAT(manager.first_name, \' \', manager.last_name) AS manager_name FROM employee_table INNER JOIN role_table ON employee_table.role_id = role_table.id INNER JOIN department_table ON role_table.department_id = department_table.id LEFT JOIN employee_table AS manager ON employee_table.manager_id = manager.id;', (err, results) => {
            if (err) {
              console.error('Error retrieving employees:', err);
            } else {
              console.table(results);
            }
            db.end();
            mainMenu();
          });
          break;
        case 'Add a department':
          inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: 'Enter the name of the department:'
            }
          ]).then((answers) => {
            db.query('INSERT INTO department_table (name) VALUES (?);', [answers.name], (err, results) => {
              if (err) {
                console.error('Error adding department:', err);
              } else {
                console.log('Department added successfully.');
              }
              db.end();
              mainMenu();
            });
          });
          break;
        case 'Add a role':
          inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: 'Enter the title of the role:'
            },
            {
              type: 'input',
              name: 'salary',
              message: 'Enter the salary for the role:'
            },
            {
              type: 'input',
              name: 'department_id',
              message: 'Enter the department id for the role:'
            }
          ]).then((answers) => {
            db.query('INSERT INTO role_table (title, department_id, salary) VALUES (?, ?, ?);', [answers.title, answers.department_id, answers.salary], (err, results) => {
              if (err) {
                console.error('Error adding role:', err);
              } else {
                console.log('Role added         successfully.');
              }
              db.end();
              mainMenu();
            });
          });
          break;
        case 'Add an employee':
          inquirer.prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'Enter the first name of the employee:'
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'Enter the last name of the employee:'
            },
            {
              type: 'input',
              name: 'role_id',
              message: 'Enter the role id for the employee:'
            },
            {
              type: 'input',
              name: 'manager_id',
              message: 'Enter the manager id for the employee:'
            }
          ]).then((answers) => {
            db.query('INSERT INTO employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, results) => {
              if (err) {
                console.error('Error adding employee:', err);
              } else {
                console.log('Employee added successfully.');
              }
              db.end();
              mainMenu();
            });
          });
          break;
        case 'Update an employee role':
          db.query('SELECT id, first_name, last_name FROM employee_table;', (err, results) => {
            if (err) {
              console.error('Error retrieving employees:', err);
              db.end();
            } else {
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'employee_id',
                  message: 'Select an employee to update:',
                  choices: results.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                  }))
                },
                {
                  type: 'input',
                  name: 'role_id',
                  message: 'Enter the new role id for the employee:'
                }
              ]).then((answers) => {
                db.query('UPDATE employee_table SET role_id = ? WHERE id = ?;', [answers.role_id, answers.employee_id], (err, results) => {
                  if (err) {
                    console.error('Error updating employee role:', err);
                  } else {
                    console.log('Employee role updated successfully.');
                  }
                  db.end();
                  mainMenu();
                });
              });
            }
          });
          break;
        default:
          console.error('Invalid action:', answers.action);
          db.end();
          mainMenu();
          break;
        case 'Update employee manager':
          db.query('SELECT id, first_name, last_name FROM employee_table;', (err, results) => {
            if (err) {
              console.error('Error retrieving employees:', err);
              db.end();
            } else {
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'employee_id',
                  message: 'Select an employee to update:',
                  choices: results.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                  }))
                },
                {
                  type: 'input',
                  name: 'manager_id',
                  message: 'Enter the new manager id for the employee:'
                }
              ]).then((answers) => {
                db.query('UPDATE employee_table SET manager_id = ? WHERE id = ?;', [answers.manager_id, answers.employee_id], (err, results) => {
                  if (err) {
                    console.error('Error updating employee manager:', err);
                  } else {
                    console.log('Employee manager updated successfully.');
                  }
                  db.end();
                  mainMenu();
                });
              });
            }
          });
          break;
        case 'View employees by manager':
          db.query('SELECT manager.id AS manager_id, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name, employee.id AS employee_id, employee.first_name AS employee_first_name, employee.last_name AS employee_last_name FROM employee_table employee INNER JOIN employee_table manager ON manager.id = employee.manager_id ORDER BY manager_last_name, manager_first_name, employee_last_name, employee_first_name;', (err, results) => {
            if (err) {
              console.error('Error retrieving employees by manager:', err);
            } else {
              console.table(results);
            }
            db.end();
            mainMenu();
          });
          break;
        case 'View employees by department':
          db.query('SELECT department.id AS department_id, department.name AS department_name, employee.id AS employee_id, employee.first_name AS employee_first_name, employee.last_name AS employee_last_name, role.title AS employee_title FROM employee_table employee INNER JOIN role_table role ON employee.role_id = role.id INNER JOIN department_table department ON role.department_id = department.id ORDER BY department_name, employee_last_name, employee_first_name;', (err, results) => {
            if (err) {
              console.error('Error retrieving employees by department:', err);
            } else {
              console.table(results);
            }
            db.end();
            mainMenu();
          });
          break;
        case 'Delete department':
          inquirer.prompt([
            {
              type: 'input',
              name: 'department_id',
              message: 'Enter the id of the department to delete:'
            }
          ]).then((answers) => {
            db.query('DELETE FROM department_table WHERE id = ?;', [answers.department_id], (err, results) => {
              if (err) {
                console.error('Error deleting department:', err);
              } else {
                console.log('Department deleted successfully.');
              }
              db.end();
              mainMenu();
            });
          });
          break;
        case 'Delete role':
          inquirer.prompt([
            {
              type: 'input',
              name: 'role_id',
              message: 'Enter the id of the role to delete:'
            }
          ]).then((answers) => {
            db.query('DELETE FROM role_table WHERE id = ?;', [answers.role_id], (err, results) => {
              if (err) {
                console.error('Error deleting role:', err);
              } else {
                console.log('Role deleted successfully.');
              }
              db.end();
              mainMenu();
            });
          });
          break;
        case 'View total utilized budget of a department':
          db.query('SELECT department_table.name AS department, SUM(role_table.salary) AS total_budget FROM employee_table INNER JOIN role_table ON employee_table.role_id = role_table.id INNER JOIN department_table ON role_table.department_id = department_table.id GROUP BY department_table.id;', (err, results) => {
            if (err) {
              console.error('Error retrieving department budgets:', err);
            } else {
              console.table(results);
            }
            db.end();
            mainMenu();
          });
          break;
        case 'Delete employee':
          db.query('SELECT id, first_name, last_name FROM employee_table;', (err, results) => {
            if (err) {
              console.error('Error retrieving employees:', err);
              db.end();
            } else {
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'employee_id',
                  message: 'Select an employee to delete:',
                  choices: results.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                  }))
                },
                {
                  type: 'confirm',
                  name: 'confirmDelete',
                  message: 'Are you sure you want to delete this employee?'
                }
              ]).then((answers) => {
                if (answers.confirmDelete) {
                  db.query('DELETE FROM employee_table WHERE id = ?;', [answers.employee_id], (err, results) => {
                    if (err) {
                      console.error('Error deleting employee:', err);
                    } else {
                      console.log('Employee deleted successfully.');
                    }
                    db.end();
                    mainMenu();
                  });
                } else {
                  db.end();
                  mainMenu();
                }
              });
            }
          });
          break;
      }
    })
};

// Call mainMenu to start the application
mainMenu();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
