CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL
);
-- Add status_id FK 
ALTER TABLE order_item
ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders (id) ON UPDATE CASCADE;
-- Add status_id FK 
ALTER TABLE order_item
ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product (id) ON UPDATE CASCADE;