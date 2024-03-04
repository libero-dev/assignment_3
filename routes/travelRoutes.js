const express = require('express');
const router = express.Router();


router.route('/')
  .get((req, res) => {
    res.sendFile(__dirname + '/../views/travelagency.html');
  })
  .post((req, res) => {
    const result = calculateTour(req.body);
    res.send(result);
  });


function calculateTour(data) {
 
  const tourResult = {
    cost: 500,
    weather: 'Sunny',
    message: 'Enjoy your tour to a beautiful destination!',
  };
  return tourResult;
}

module.exports = {router, calculateTour};
