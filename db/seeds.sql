-- Insert departments
INSERT INTO department_table (name) 
VALUES ('Engineering'), ('Product'), ('Design'), ('Marketing'), ('HR');

-- Insert roles
INSERT INTO role_table (title, department_id, salary) 
VALUES 
('Software Engineer', 1, 90000),
('Senior Software Engineer', 1, 120000),
('Product Manager', 2, 110000),
('UX Designer', 3, 80000),
('Marketing Specialist', 4, 70000),
('HR Coordinator', 5, 60000),
('Engineering Manager', 1, 150000),
('Department Manager', 5, 130000);

-- Insert managers
INSERT INTO employee_table (first_name, last_name, role_id, manager_id) 
VALUES 
('Michael', 'Green', 7, NULL),
('Emma', 'Johnson', 3, NULL),
('Carol', 'Brooks', 8, NULL),
('Martin', 'Jones', 6, NULL),
('Eve', 'Brown', 2, NULL),
('Jennifer', 'Sanchez', 1, 1),
('Samantha', 'Tucker', 1, 1),
('Ava', 'Johnson', 1, 1),
('Sophia', 'Fox', 1, 1);