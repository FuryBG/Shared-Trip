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
    const current = await Trip.findOne({_id: id}).populate("buddies").lean();
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

async function addBuddie(id, userId) {
    let currItem = await Trip.findById(id);
    currItem.buddies.push(userId);
    currItem.seats -= 1;
    await currItem.save();
};



module.exports = {
    getAll,
    createTrip,
    getById,
    editTrip,
    deleteTrip,
    addBuddie
};