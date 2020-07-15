--This file should contain the SQL to create a new TYPE called grocery
--should be an ENUM that can be one of the following possible values: 
--MAIN, SNACK, LUNCH, BREAKFAST--
DROP TYPE IF EXISTS grocery;
CREATE TYPE grocery AS ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);

--and a new TABLE called shopping_list
--The table will contain 6 columns 
--and you will need to decide which SQL data types to use for each column: 
--ID, NAME, PRICE, DATE ADDED, CHECKED, CATEGORY--
CREATE TABLE IF NOT EXISTS shopping_list (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price decimal(10, 2) NOT NULL,
    date_added TIMESTAMP DEFAULT now() NOT NULL,
    checked BOOLEAN DEFAULT false,
    category grocery NOT NULL
);