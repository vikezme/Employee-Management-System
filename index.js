var inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dollors899#",
  database: "employee_tracker",
});

// Formats a name so that it is one field, used for employees and managers
function formatName(first_name, last_name) {
  return last_name + ", " + first_name;
}

// I am presented with the following options: view all departments, view all roles, view all employees,
// add a department, add a role, add an employee, and update an employee role
inquirer
  .prompt([
    {
      type: "list",
      name: "selectedOption",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        // BONUS
        "update an employee manager",
      ],
    },
  ])
  .then((answers) => {
    if (answers.selectedOption == "view all departments") {
      // WHEN I choose to view all departments
      // THEN I am presented with a formatted table showing department names and department ids
      connection.connect((err) => {
        if (err) throw err;
        connection.query("SELECT * FROM department", function (err, results) {
          console.table(results);
          connection.end();
        });
      });
    }
    if (answers.selectedOption == "view all roles") {
      // WHEN I choose to view all roles
      // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
      connection.connect((err) => {
        if (err) throw err;
        connection.query(
          "SELECT r.title job_title, r.id role_id, d.name department FROM role r, department d WHERE r.department_id=d.id",
          function (err, results) {
            console.table(results);
            connection.end();
          }
        );
      });
    }
    if (answers.selectedOption == "view all employees") {
      // WHEN I choose to view all employees
      // THEN I am presented with a formatted table showing employee data, including employee ids,
      // first names, last names, job titles, departments, salaries, and managers that the employees report to

      connection.connect((err) => {
        if (err) throw err;
        connection.query(
          "SELECT e.id, e.first_name, e.last_name, r.title job_title, d.name department_name, r.salary, " +
            "manager.first_name manager_first_name, manager.id manager_id, manager.last_name manager_last_name " +
            "FROM employee e " +
            "LEFT JOIN employee manager ON e.manager_id=manager.id " +
            "JOIN role r ON e.role_id=r.id " +
            "JOIN department d ON r.department_id=d.id",
          function (err, results) {
            if (err) throw err;

            // Transform the manager information into a single name column
            results.forEach((r) => {
              r.manager = r.manager_id
                ? formatName(r.manager_first_name, r.manager_last_name)
                : "No Manager";
              delete r.manager_first_name;
              delete r.manager_last_name;
              delete r.manager_id;
            });
            console.table(results);
            connection.end();
          }
        );
      });
    }
    if (answers.selectedOption == "add a department") {
      // WHEN I choose to add a department
      // THEN I am prompted to enter the name of the department and that department is added to the database
      connection.connect((err) => {
        if (err) throw err;
        inquirer
          .prompt([{ type: "input", name: "name", message: "Name" }])
          .then((answers) => {
            connection.query(
              "INSERT INTO department (name) VALUES (?)",
              [answers.name],
              function (err, results) {
                connection.end();
              }
            );
          });
      });
    }
    if (answers.selectedOption == "add a role") {
      // WHEN I choose to add a role
      // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
      connection.connect((err) => {
        if (err) throw err;
        connection.query("SELECT * FROM department", function (err, results) {
          if (err) throw err;
          inquirer
            .prompt([
              { type: "input", name: "title", message: "Title" },
              { type: "number", name: "salary", message: "Salary" },
              {
                type: "list",
                name: "department_id",
                message: "Which department?",
                choices: results.map(function (r) {
                  return { name: r.name, value: r.id };
                }),
              },
            ])
            .then((answers) => {
              connection.query(
                "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
                [answers.title, answers.salary, answers.department_id],
                function (err, results) {
                  connection.end();
                }
              );
            });
        });
      });
    }
    if (answers.selectedOption == "add an employee") {
      // WHEN I choose to add an employee
      // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
      connection.connect((err) => {
        if (err) throw err;
        connection.query("SELECT * FROM role", function (err, results) {
          if (err) throw err;
          connection.query("SELECT * FROM employee", function (
            err,
            resultsEmployee
          ) {
            var allManagerChoices = resultsEmployee.map(function (r) {
              return { name: formatName(first_name, last_name), value: r.id };
            });
            allManagerChoices.push({ name: "No Manager", value: null });
            inquirer
              .prompt([
                { type: "input", name: "first_name", message: "First Name" },
                { type: "input", name: "last_name", message: "Last Name" },
                {
                  type: "list",
                  name: "role_id",
                  message: "Which role?",
                  choices: results.map(function (r) {
                    return { name: r.title, value: r.id };
                  }),
                },
                {
                  type: "list",
                  name: "manager_id",
                  message: "Which manager?",
                  choices: allManagerChoices,
                },
              ])
              .then((answers) => {
                connection.query(
                  "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
                  [
                    answers.first_name,
                    answers.last_name,
                    answers.role_id,
                    answers.manager_id,
                  ],
                  function (err, results) {
                    if (err) throw err;
                    connection.end();
                  }
                );
              });
          });
        });
      });
    }
    if (answers.selectedOption == "update an employee role") {
      // WHEN I choose to update an employee role
      // THEN I am prompted to select an employee to update and their new role and this information is updated in the database

      connection.query("SELECT * FROM employee", function (err, results) {
        connection.query("SELECT * FROM role", function (err, resultsRoles) {
          inquirer
            .prompt([
              {
                type: "list",
                name: "id",
                message: "Which employee?",
                choices: results.map(function (r) {
                  return {
                    name: formatName(r.first_name, r.last_name),
                    value: r.id,
                  };
                }),
              },
              {
                type: "list",
                name: "role_id",
                message: "Which manager?",
                choices: resultsRoles.map(function (r) {
                  return { name: r.title, value: r.id };
                }),
              },
            ])
            .then((answers) => {
              connection.query(
                "UPDATE employee SET role_id=? WHERE id=?",
                [answers.role_id, answers.id],
                function (err, results) {
                  if (err) throw err;
                  connection.end();
                }
              );
            });
        });
      });
    }
    if (answers.selectedOption == "update an employee manager") {
      // WHEN I choose to update an employee role
      // THEN I am prompted to select an employee to update and their new role and this information is updated in the database

      connection.query("SELECT * FROM employee", function (err, results) {
        var allManagerChoices = results.map(function (r) {
          return { name: formatName(r.first_name, r.last_name), value: r.id };
        });
        allManagerChoices.push({ name: "No Manager", value: null });

        // We need two separate prompts because the employee should not be its own manager.
        inquirer
          .prompt([
            {
              type: "list",
              name: "id",
              message: "Which employee?",
              choices: results.map(function (r) {
                return {
                  name: formatName(r.first_name, r.last_name),
                  value: r.id,
                };
              }),
            },
          ])
          .then((answers) => {
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "manager_id",
                  message: "Which manager?",
                  choices: allManagerChoices.filter(
                    (choice) => choice.value != answers.id
                  ),
                },
              ])
              .then((answers2) => {
                connection.query(
                  "UPDATE employee SET manager_id=? WHERE id=?",
                  [answers2.manager_id, answers.id],
                  function (err, results) {
                    if (err) throw err;
                    connection.end();
                  }
                );
              });
          });
      });
    }
  });
