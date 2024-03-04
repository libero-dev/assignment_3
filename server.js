require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt')
const moment = require('moment');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3000; 



mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

const userSchema = new mongoose.Schema({
  email: String,
  username: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  age: Number,
  country: String,
  gender: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const itemSchema = new mongoose.Schema({
  username: String,
  picture1: String,
  picture2: String,
  picture3: String,
  names: String,
  descriptions: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  deletedAt: { type: Date, default: null }
});

const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register', { message: '' }); 
});

app.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.render('register', { message: 'User already exists. Choose a different username.' });
    }

    const { email, username, password, firstName, lastName, age, country, gender } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword, firstName, lastName, age, country, gender });
    await user.save();


    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

app.get('/login', (req, res) => {
  res.render('login', { message: '' }); 
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('login', { message: 'Incorrect username or password. Please try again.' });
  }

  req.session.userId = username; 

  return res.redirect('/index');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});




const tourHistory = [];

const getTourHistory = () => {
  return tourHistory;
};

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.route('/travelagency')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'travelagency.html'));
  })
  .post(async (req, res) => {
    const result = await calculateTour(req.body);
    tourHistory.push({
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      tourResult: result,
    });
    res.send(result);
  });

app.get('/history', (req, res) => {
  console.log('Fetching tour history from server');
  const history = getTourHistory();
  res.json(history);
});

async function calculateTour(data) {
  try {
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/3.5/weather', {
      params: {
        q: `${data.city},${data.country}`,
        appid: process.env.OPENWEATHER_API_KEY,
      },
    });

    const additionalInfo = await fetchRandomInfo(data.city);
    const cost = 500;

    const tourResult = {
      cost: cost,
      weather: weatherResponse.data.weather ? weatherResponse.data.weather[0].description : 'Not available',
      additionalInfo: additionalInfo,
      message: 'Enjoy your tour to a beautiful destination!',
    };

    displayTourResult(tourResult);
    return tourResult;

  } catch (error) {
    console.error('Error in calculateTour:', error);
    return { error: 'An error occurred during tour calculation.' };
  }
}

async function fetchRandomInfo(city) {
  const infoSources = [
    'https://api.example1.com/info',
    'https://api.example2.com/info',
  ];

  const randomSource = infoSources[Math.floor(Math.random() * infoSources.length)];

  try {
    const response = await axios.get(randomSource, {
      params: {
        city: city,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching random information:', error);
    return null;
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});