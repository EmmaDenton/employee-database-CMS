
INSERT INTO department (id, department_name) VALUES
  (1, 'Legal'),
  (2, 'Finance'),
  (3, 'HR');


INSERT INTO role (id, title, salary, department_id) VALUES
  (1, 'Lawyer', 120000, 1),
    (2, 'Paralegal', 90000, 1),
  (3, 'Accountant', 100000, 2),
    (4, 'Accountant', 90000, 2),
  (5, 'Recruiter', 90000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Grace', 'Green', 3, NULL),
  ('Michael', 'Freddrick', 4, 2),
  ('Bob', 'Johnson', 5, NULL);