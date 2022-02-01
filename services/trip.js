const Trip = require("../models/Trip");


async function getAll() {
    const allTrips = await Trip.find({}).lean();
    return allTrips;
};

async function createTrip(data) {
    let newTrip = new Trip(data);
    await newTrip.save();
    return newTrip;
};

async function getById(id) {
    const current = await Trip.findOne({_id: id}).populate("buddies");
    return current;
};

async function editTrip(id, data) {
    let oldTrip = await Trip.findById(id);
    let newTrip = Object.assign(oldTrip, data);
    await newTrip.save();
    return newTrip;
};

async function deleteTrip(id) {
    await Trip.deleteOne({_id: id});
};



module.exports = {
    getAll,
    createTrip,
    getById,
    editTrip,
    deleteTrip,
};