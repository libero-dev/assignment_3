// models/Tour.js
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    country: String,
    city: String,
    hotelRating: Number,
    arrivalDate: Date,
    departureDate: Date,
    adults: Number,
    children: Number,
});

module.exports = mongoose.model('Tour', tourSchema);
