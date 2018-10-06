const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const authRouter =  new express.Router();
const publicRouter = new express.Router();
const jwt = require('jsonwebtoken');
const secrets = require('./secrets');
const db = require('./db')

const allowCORS = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}
  
const signup = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    db.addNewUser(email, password)
        .then(data => {
            let token = jwt.sign(
                {
                email: email,
                id: data.id
                },
                secrets.SIGNATURE,
                {expiresIn: '30d'});
        res.send({
        token: token, 
        email: email, 
        id: data.id
        });
    })
        .catch((error) => {
            res.send({error: "Error signing up. Please try again"})
        })
}
  
  const login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    db.getUserInfo(email, password)
      .then(data =>  { 
            let token = jwt.sign(
                {
                email: email,
                id: data.id
                },
                secrets.SIGNATURE,
                {expiresIn: '7d'});
        res.send({
          token: token,
          email: email, 
          id: data.id
        });
    })
      .catch( ()=> res.send({error: "Error logging in. Please try again"}))
  }

const addPlant = (req, res) => {
    let user_id = req.body.user_id;
    let name= req.body.name;
    let light = req.body.light;
    let last_watered = req.body.lastWatered;
    let water_frequency = req.body.days;
    let location = req.body.location;
    let notes = req.body.notes;
    console.log('adding a plant');
    db.addPlant(user_id, name, location, light, water_frequency, last_watered, notes)
    .then((response) => {res.end(JSON.stringify(response))})
    .catch(err => console.log(err));
}

app.use(bodyParser.json());

app.use(allowCORS);
app.use(publicRouter);
publicRouter.post('/signup', signup);
publicRouter.post('/login', login);
authRouter.post('/add-plant', addPlant)
app.use('/api', authRouter);

app.listen(5000);
  