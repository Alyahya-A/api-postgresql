CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    status_id INTEGER
);
-- Add user_id FK 
ALTER TABLE orders
ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE;
-- Add status_id FK 
ALTER TABLE orders
ADD CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES lk_status (id) ON DELETE
SET NULL ON UPDATE CASCADE