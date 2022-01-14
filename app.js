const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const cityList = require('./cityList.json');
const countryFlag = require('./countryFlag.json');
const randtoken = require('rand-token');
const bodyParser = require('body-parser');
const refreshTokens = {};
const urlencodedParser = bodyParser.urlencoded({extended: true});

app.get('/api/countryFlag', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.json({
        "err":err
      });
    } else {
      res.json({
        "status": true,
        "message": "success",
        "data": countryFlag,
      });
    }
  });
});

app.get('/api/cityList', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.json({
        "err":err
      });
    } else {
      res.json({
        "status": true,
        "message": "success",
        "data": cityList,
      });
    }
  });
});


app.post('/api/getToken',urlencodedParser, (req, res) => {
  // Mock user
  const user = { 
    username: 'vivian',
    role: 'basic'
  }
  const refreshToken = randtoken.uid(256);
  refreshTokens[refreshToken] = user.username;

  jwt.sign({user : user}, 'secretkey', { expiresIn: '12000s' },(err, token) => {
    res.json({
      token : token,
      refreshToken: refreshToken,
    });
  });
});

app.post('/api/refresh', function (req, res) {
  const user = { 
    username: 'vivian',
    role: 'basic'
  }
    const refreshToken = randtoken.uid(256);
    // const token = jwt.sign(user, 'secretkey', { expiresIn: '30s' });//600
    // res.json({jwt: token})
    jwt.sign({user : user}, 'secretkey', { expiresIn: '12000s' },(err, token) => {
      res.json({
        token : token,
        refreshToken: refreshToken,
      });
    });
  
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

app.listen(3000, () => console.log('Server started on port 3000'));
