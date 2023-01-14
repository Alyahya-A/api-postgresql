CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(7, 2) NOT NULL,
    category_id INTEGER
);

ALTER TABLE
    product
ADD
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE
SET
    NULL ON UPDATE CASCADE;