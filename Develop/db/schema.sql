-- DROP DATABASE
DROP DATABASE IF EXISTS ecommerce_db;

-- CREATE DATABASE
CREATE DATABASE ecommerce_db;

-- USE ecommerce_db;



-- CREATE TABLE category_name (
--     id INT AUTO_INCREMENT NOT NULL,
--     name VARCHAR(30) NOT NULL,
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE product_name (
--     id INT AUTO_INCREMENT NOT NULL,
--     name VARCHAR(30) NOT NULL,
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE product_price (
--     id  INT AUTO_INCREMENT NOT NULL,
--     price DECIMAL(10,2),
--    product_price_id INT,
    
--     PRIMARY KEY(id),
    
--     -- CONSTRAINT fk_department_table
--     -- FOREIGN KEY (department_table_id)
--     -- REFERENCES department_table(id)
--     -- ON DELETE CASCADE

--     id INT AUTO_INCREMENT NOT NULL,
--     name VARCHAR(30) NOT NULL,
--     PRIMARY KEY(id)
-- );
-- );

-- CREATE TABLE tag_name (
--     id INT AUTO_INCREMENT NOT NULL,
--     name VARCHAR(30),
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE product_id (
--     id INT AUTO_INCREMENT NOT NULL,
--     name VARCHAR(30) NOT NULL,
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE tag_id (
--     id INT,
--     PRIMARY KEY(id)
-- );


-- CREATE TABLE employee_table (
--     id INT NOT NULL AUTO_INCREMENT,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     role_id INT,
--     manager_id INT,
--     PRIMARY KEY(id),

--     CONSTRAINT fk_role_table
--     FOREIGN KEY (role_id)
--     REFERENCES role_table(id)
--     ON DELETE CASCADE,

--     CONSTRAINT fk_employee_table
--     FOREIGN KEY (manager_id)
--     REFERENCES employee_table(id)
--     ON DELETE SET NULL
-- );
