const router = require("express").Router();

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    router.get("/register", (req, res) => {
        res.render("register.hbs");
    });

    router.post("/register", async(req, res) => {
        try{
            if(!req.body.email.match(emailPattern)) {
                throw new Error("Email is wrong!");
            }
            if(req.body.password.length < 4) {
                throw new Error("Password is too short!");
            }
            if(req.body.password != req.body.rePass) {
                throw new Error("Passwords must match!");
            }

            await req.auth.register(req.body.email, req.body.password, req.body.gender);
        res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("register.hbs", {errors: err.message.split("\n")});
        }
    });

    router.get("/login", (req, res) => {
        res.render("login.hbs");
    });

    router.post("/login", async(req, res) => {
        try {
            await req.auth.login(req.body.email, req.body.password);
            res.redirect("/");
        }catch(err) {
        res.render("login.hbs", {errors: err.message.split("\n")});
        }
    });

    router.get("/logout", (req, res) => {
        req.auth.logout();
        res.redirect("/");
    });


module.exports = router;