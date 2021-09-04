var inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dollors899#',
  database: 'employee_tracker',
});
/*
connection.connect((err) => {
  if (err) throw err;
});*/



// I am presented with the following options: view all departments, view all roles, view all employees,
// add a department, add a role, add an employee, and update an employee role
inquirer.prompt([{
  type: 'list',
    name: 'selectedOption',
    message: "What would you like to do?",
    choices: ['view all departments', 'view all roles', 'view all employees',
    'add a department', 'add a role', 'add an employee', 'update an employee role']
  }])
  .then(answers => {
    if(answers.selectedOption == 'view all departments') {
      // WHEN I choose to view all departments
      // THEN I am presented with a formatted table showing department names and department ids
      connection.connect((err) => {
        if (err) throw err;
        connection.query('SELECT * FROM department', function(err, results) {
          console.table(results);
          connection.end();
        });
      });
    }
    if(answers.selectedOption == 'view all roles') {
      // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
      connection.connect((err) => {
        if (err) throw err;
        connection.query('SELECT r.title, r.id, d.name FROM role r, department d WHERE r.department_id=d.id', function(err, results) {
          console.table(results);
          connection.end();
        });
      });
    }
    if(answers.selectedOption == 'add a department') {
      // WHEN I choose to view all departments
      // THEN I am presented with a formatted table showing department names and department ids
      connection.connect((err) => {
        if (err) throw err;
        inquirer.prompt([
          {type: 'input',
          name: 'name',
          message: 'Name'}])
        .then(answers => {
          connection.query('INSERT INTO department (name) VALUES (?)', [answers.name], function(err, results) {
            connection.end();
          });
        });
      });
    }
    if(answers.selectedOption == 'add a role') {
      connection.connect((err) => {
        if (err) throw err;
        connection.query('SELECT * FROM department', function(err, results) {

      inquirer.prompt([
        {type: 'input',
        name: 'title',
        message: 'Title'},
        {type: 'number',
        name: 'salary',
        message: 'Salary'},
        {
        type: 'list',
          name: 'department_id',
          message: "Which department?",
          choices: results.map(function(r) { return {name: r.name, value: r.id}})
        }])
        .then(answers => {
          console.log(answers);
          connection.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answers.title, answers.salary, answers.department_id], function(err, results) {
            connection.end();
          });
        });
        });
      });
    }
    if(answers.selectedOption == 'add an employee') {
      connection.connect((err) => {
        if (err) throw err;
        connection.query('SELECT * FROM role', function(err, results) {
          connection.query('SELECT * FROM employee', function(err, resultsEmployee) {
            console.log(results);
            console.log(resultsEmployee);

// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// role comes from the employee table
// manager comes from the employee table

      inquirer.prompt([
        {type: 'input',
        name: 'first_name',
        message: 'First Name'},
        {type: 'input',
        name: 'last',
        message: 'Last Name'},
        {
        type: 'list',
          name: 'role_id',
          message: "Which role?",
          choices: results.map(function(r) { return {name: r.title, value: r.id}})
        },
        {
        type: 'list',
          name: 'manager_id',
          message: "Which manager?",
          choices: resultsEmployee.map(function(r) { return {name: r.first_name + ' ' + r.last_name, value: r.id}})
        }
      ])
        .then(answers => {
          console.log(answers);
          // // TODO:
          //connection.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answers.title, answers.salary, answers.department_id], function(err, results) {
            connection.end();
          //});
        });
        });
      });
    });
    }    //console.log(answers);
  });
