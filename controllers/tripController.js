const { isUser } = require("../middlewares/guards");

const router = require("express").Router();


router.get("/", async(req, res) => {
    res.render("home.hbs");
});

router.get("/all", async(req, res) => {
    const allTrips = await req.storage.getAll();
    res.render("shared-trips.hbs", {allTrips});
});

router.get("/edit/:id", isUser(), async(req, res) => {
    let currItem = await req.storage.getById(req.params.id);
    res.render("trip-edit.hbs", currItem);
});

router.post("/edit/:id", isUser(), async(req, res) => {
    try{
        if(req.body.date == "" || req.body.time == "") {
            throw new Error("All fields are required!");
        }
        if(req.body.startPoint.length < 4) {
            throw new Error("Invalid start point!");
        }
        if(req.body.endPoint.length < 4) {
            throw new Error("Invalid end point!");
        }
        if(req.body.seats < 1 || req.body.seats > 4) {
            throw new Error("Seats must be between 1 and 4");
        }
        if(req.body.description.length < 10) {
            throw new Error("Description is too short");
        }
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
            throw new Error("Invalid image");
        }
        if(req.body.price < 1 && req.body.price > 50) {
            throw new Error("Price must be between 1 and 50");
        }

        req.body.owner = req.user._id;
        await req.storage.edit(req.params.id, req.body);
        res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        console.log(req.body);
        res.render("trip-edit.hbs", {errors: err.message.split("\n")});
    }
});

router.get("/join/:id", isUser(), async(req, res) => {
    await req.storage.addBuddie(req.params.id, req.user._id);
    await req.auth.addTrip(req.user._id, req.params.id);
    res.redirect(`/details/${req.params.id}`);
});

router.get("/details/:id", async(req, res) => {
    const currItem = await req.storage.getById(req.params.id);
    const isJoined = currItem.buddies.find(x => x._id == req.user._id);
    if(currItem.buddies.length > 0) {
        currItem.isBuddies = true;
        currItem.allBuddies = currItem.buddies.map(x => x.email);
        currItem.allBuddies = currItem.allBuddies.join(", ");
    };

    if(currItem.owner == req.user._id) {
        currItem.isOwner = true;
    }
    if(currItem.seats > 0) {
        currItem.isSeats = true;
    }
    if(isJoined) {
        currItem.isJoined = true;
    }
    res.render("trip-details.hbs", currItem);
});

router.get("/create", isUser(), (req, res) => {
    res.render("trip-create.hbs");
});

router.post("/create", isUser(), async(req, res) => {
    try{
        if(req.body.date == "" || req.body.time == "") {
            throw new Error("All fields are required!");
        }
        if(req.body.startPoint.length < 4) {
            throw new Error("Invalid start point!");
        }
        if(req.body.endPoint.length < 4) {
            throw new Error("Invalid end point!");
        }
        if(req.body.seats < 1 || req.body.seats > 4) {
            throw new Error("Seats must be between 1 and 4");
        }
        if(req.body.description.length < 10) {
            throw new Error("Description is too short");
        }
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
            throw new Error("Invalid image");
        }
        if(req.body.price < 1 && req.body.price > 50) {
            throw new Error("Price must be between 1 and 50");
        }

        req.body.owner = req.user._id;
        await req.storage.create(req.body);
        res.redirect("/");
    }catch(err) {
        console.log(req.body);
        res.render("trip-create.hbs", {errors: err.message.split("\n")});
    }
});

router.all("*", (req, res) => {
    res.render("404.hbs");
});






module.exports = router;