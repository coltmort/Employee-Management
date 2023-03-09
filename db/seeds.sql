INSERT INTO departments (department_name)
VALUES('Customer Service'),
    ('Finance'),
    ('Operations'),
    ('Sales'),
    ('Legal'),
    ('Human Resources')
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
    ('HR Coordinator', 6, '65000'),
    ('HR Specialist', 6, '50000')
;


INSERT INTO employees (first_name, last_name, role, manager, is_manager)
VALUES('Bob', 'Bilby', 7, null, true),
    ('Sam', 'Fisher', 9, null, true),
    ('Frank', 'Fiddle', 10, 2, false)
;