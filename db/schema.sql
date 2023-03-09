DROP DATABASE IF EXISTS employee_management_db;
CREATE DATABASE employee_management_db;

USE employee_management_db;

CREATE TABLE departments(
    department_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR(100)
);

CREATE TABLE roles(
    role_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    role_name VARCHAR(100),
    department_id int,
    salary INT,
    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
);

CREATE TABLE employees(
    employee_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role INT,
    manager INT,
    is_manager BOOLEAN,
    FOREIGN KEY (role) REFERENCES roles(role_id),
    FOREIGN KEY (manager) REFERENCES employees(employee_id)
);
