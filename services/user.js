const User = require("../models/User");

async function createUser(email, hashedPassword, gender) {
    const newUser = new User({
        email,
        hashedPassword,
        gender
    });
    await newUser.save();
    return newUser;
};

async function getUserByEmail(email) {
    let userRegEx = new RegExp(`^${email}$`, "i");
    const currUser = await User.findOne({email:{$regex: userRegEx}});
    return currUser;
};

async function addTrip(id, tripId) {
    let currentUser = await User.findById(id);
    currentUser.trips.push(tripId);
    currentUser.save();
};

async function getUserById(id) {
    let currUser = await User.findById(id).populate("trips").lean();
    return currUser;
};

module.exports = {
    createUser,
    getUserByEmail,
    addTrip,
    getUserById
};