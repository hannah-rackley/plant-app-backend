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
  
let signup = (req, res) => {
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
  
  let login = (req, res) => {
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

app.use(bodyParser.json());

app.use(allowCORS);
app.use(publicRouter);
publicRouter.post('/signup', signup);
publicRouter.post('/login', login);
app.use('/api', authRouter);

app.listen(5000);
  