CREATE DATABASE login_db;

USE login_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,  -- Added email column
    password VARCHAR(255) NOT NULL,
    roles VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE       -- Added verified column for email verification
);

-- Insert a test user (password: 'password123', hashed using bcrypt)
INSERT INTO users (username, email, password, roles, verified) 
VALUES ('testuser', 'testuser@example.com', '$2a$10$EIXb/9eeK8yWJztKn.GCa.KXWytvZhVjBIdXHdKlbj6jT1lb2yZzO', 'User', FALSE);
