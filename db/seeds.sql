INSERT INTO departments (department_name)
VALUES('Customer Service'),
    ('Finance'),
    ('Operations'),
    ('Sales'),
    ('Legal'),
    ('Human Resources'),
    ('Recieving'),
    ('Marketing')
;

INSERT INTO roles (role_name, department_id, salary)
VALUES('Customer support', 1, '30000'),
    ('Junior Accountant', 2, '40000'),
    ('Senior Accountant', 2, '80000'),
    ('Technician', 3, '50000'),
    ('Salesperson', 4, '70000'),
    ('Controller', 2, '50000'),
    ('Attourney', 5, '80000'),
    ('Paralegal', 5, '40000'),
    ('Designer', 8, '40000'),
    ('HR Coordinator', 6, '65000'),
    ('Service Coordinator', 1, '30000'),
    ('Recieving Specialist', 6, '50000'),
    ('HR Specialist', 6, '50000')
;


INSERT INTO employees (first_name, last_name, role, manager, is_manager)
VALUES('Bob', 'Bilby', 7, null, 1),
    ('Sam', 'Fisher', 9, null, 1),
    ('Frank', 'Fiddle', 10, 2, 1),
    ('Sammy', 'Smith', 13, 2, 0),
    ('MacKenzie', 'May', 11, 1, 0),
    ('Melissa', 'Fiddle', 5, 2, 0),
    ('Steve', 'Wilson', 4, 2, 0),
    ('Karen', 'Crood', 8, 1, 0),
    ('Lindsey', 'Lot', 11, 3, 0),
    ('Lucas', 'Scott', 12, 2, 0),
    ('Scott', 'Cawley', 1, 2, 0)

;