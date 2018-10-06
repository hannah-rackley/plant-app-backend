CREATE TABLE users(
    id serial PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL 
);

-- No support for images yet
CREATE TABLE plants(
   id serial PRIMARY KEY NOT NULL,
   user_id integer,
   name VARCHAR(255),
   location VARCHAR(255),
   light VARCHAR(255),
   water_frequency VARCHAR(255),
   last_watered VARCHAR(255),
   notes VARCHAR(255)
);
