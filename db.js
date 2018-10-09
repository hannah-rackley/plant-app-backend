const pgp = require('pg-promise')();
const { DATABASE_URL } = require('./secrets');
const dbConfig = DATABASE_URL;
const db = pgp(dbConfig);

let addNewUser = (email, password) => {
  return db.one('INSERT INTO users(email, password) \
    VALUES($1, $2) RETURNING id',
    [email, password])
}

let getUserInfo = (email, password) => {
  return db.one('SELECT * from users \
    WHERE email = $1 AND password = $2', 
    [email, password]);
}

let addPlant = (user_id, name, location, light, water_frequency, last_watered, notes) => {
  return db.query(`
    INSERT INTO plants (user_id, name, location, light, water_frequency, last_watered, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        returning id ;`, [user_id, name, location, light, water_frequency, last_watered, notes])
}

let getUserPlants = (user_id) => {
  return db.query(`
  SELECT * from plants \
  WHERE user_id = $1`, 
  [user_id]);
}

module.exports = {
  addNewUser: addNewUser,
  getUserInfo: getUserInfo,
  addPlant: addPlant,
  getUserPlants: getUserPlants
};