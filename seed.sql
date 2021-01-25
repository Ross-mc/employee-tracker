USE employee_DB;

INSERT INTO department (department_name)
VALUES ("accounts"), ("marketing"), ("production"), ("testing");

INSERT INTO position (title, salary, department_id)
VALUES ("Accountant", 50000, 1), ("Financial Director", 100000, 1), /* accounts */
("SEO Advisor", 40000, 2), ("Marketing Executive", 80000, 2), /* marketing */
("Software Engineer", 30000, 3), ("Technical Lead", 60000, 3), /* production */
("Junior Tester", 20000, 4), ("Test Lead", 20000, 4); /* testing */

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mike", "Connolly", 2), /* accounts */
("David", "Jones", 4), /* marketing */
 ("Sarah", "Galetti", 6), /* production */
("Alice", "Foster", 8); /* testing */

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, 1), /* accounts */
("Conrad", "Portland", 3, 2), /* marketing */
("Ted", "Thompson", 5, 3), /* production */
("Adrian", "Phillips", 7, 4); /* testing */