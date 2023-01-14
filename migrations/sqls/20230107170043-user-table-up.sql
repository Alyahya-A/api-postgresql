CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_encrypt VARCHAR(150) NOT NULL
);