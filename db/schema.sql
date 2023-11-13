USE books_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name varchar(30) NOT NULL,
  last_name VARCHAR(30)
  role_id INT,
  manager_id INT
);


CREATE TABLE favorite_books (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  book_name VARCHAR(30) NOT NULL,
  in_stock BOOLEAN,
  book_price INT,
  FOREIGN KEY (book_price)
  REFERENCES book_prices(id)
  ON DELETE SET NULL
);
