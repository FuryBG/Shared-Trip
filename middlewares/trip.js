const tripService = require("../services/trip");

module.exports = () => {
    return (req, res, next) => {
        req.storage = {
            create: tripService.createTrip,
            getAll: tripService.getAll,
            getById: tripService.getById,
            addBuddie: tripService.addBuddie,
            edit: tripService.editTrip
        };

        next();
    };
}