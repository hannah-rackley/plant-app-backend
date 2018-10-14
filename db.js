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

let addPlant = (user_id, name, location, light, water_frequency, last_watered, notes, image) => {
  return db.query(`
    INSERT INTO plants (user_id, name, location, light, water_frequency, last_watered, notes, selected_image_url, image_array)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning id ;`, [user_id, name, location, light, water_frequency, last_watered, notes, image, image])
}

let getUserPlants = (user_id) => {
  return db.query(`
  SELECT * from plants \
  WHERE user_id = $1`, 
  [user_id]);
}

let updateLastWatered = (plant_id, last_watered) => {
  return db.query(`UPDATE plants SET last_watered = $1 WHERE id = $2`, [last_watered, plant_id])
}

let deletePlant = (plant_id) => {
  return db.query(`DELETE FROM plants WHERE id = $1`, [plant_id])
}

module.exports = {
  addNewUser: addNewUser,
  getUserInfo: getUserInfo,
  addPlant: addPlant,
  getUserPlants: getUserPlants,
  updateLastWatered: updateLastWatered,
  deletePlant: deletePlant
};