const Tour = require('../models/Tour');


exports.createTour = async (req, res) => {
    console.log(req.body); 
    try {
        const newTour = await Tour.create(req.body);
        console.log(newTour); 
        res.status(201).send(newTour);
    } catch (error) {
        console.error(error); 
        res.status(400).send(error);
    }
};

exports.deleteAllTours = async (req, res) => {
    try {
        await Tour.deleteMany({});
        res.status(200).send({ message: "All tours have been deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).send(tours);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).send({ message: "Tour not found" });
        }
        res.status(200).send(tour);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) {
            return res.status(404).send({ message: "Tour not found" });
        }
        res.status(200).send({ message: "Tour deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error deleting tour" });
    }
};



exports.updateTour = async (req, res) => {
    const { id } = req.params;
    try {
        const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!tour) {
            return res.status(404).send({ message: "Tour not found" });
        }
        res.status(200).send(tour);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
};


