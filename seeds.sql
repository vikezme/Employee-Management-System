DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

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
