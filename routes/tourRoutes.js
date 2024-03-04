const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

router.post('/tours', tourController.createTour); 
router.get('/tours', tourController.getAllTours); 
router.get('/tours/:id', tourController.getTour); 
router.put('/tours/:id', tourController.updateTour); 
router.delete('/tours/:id', tourController.deleteTour); 
router.delete('/tours', tourController.deleteAllTours); 

module.exports = router;
