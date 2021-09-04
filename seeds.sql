DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

-- WHEN I choose to view all roles
-- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
-- SELECT * FROM role r, department d WHERE r.department_id=d.id
--THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
--later
-- WHEN I choose to add a department
-- THEN I am prompted to enter the name of the department and that department is added to the database
-- -- INSERT INTO department
-- WHEN I choose to add a role
-- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
-- -- INSERT INTO role
--
-- WHEN I choose to add an employee
-- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
-- -- INSERT INTO employee
--
-- WHEN I choose to update an employee role
-- THEN I am prompted to select an employee to update and their new role and this information is updated in the database
-- UPDATE employee

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- to hold department name
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- to hold role title
  title VARCHAR(30) NOT NULL,
  -- to hold role salary
  salary DECIMAL NOT NULL,
  -- to hold reference to department role belongs to
  department_id INT NOT NULL
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- to hold employee first name
  first_name VARCHAR(30) NOT NULL,
  -- to hold employee last name
  last_name VARCHAR(30) NOT NULL,
  -- to hold reference to employee role
  role_id INT NOT NULL,
  -- to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)
  manager_id INT
);
