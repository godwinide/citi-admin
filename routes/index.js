const router = require("express").Router();
const User = require("../model/User");
const Admin = require("../model/Admin")
const History = require("../model/History");
const { ensureAuthenticated } = require("../config/auth")
const bcrypt = require("bcryptjs");


router.get("/", ensureAuthenticated, async (req, res) => {
    try {
        const customers = await User.find({});
        const history = await History.find({});
        const total_bal = customers.reduce((prev, cur) => prev + Number(cur.balance), 0);
        return res.render("index", { pageTitle: "Welcome", customers, history, total_bal, req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/new-user/", ensureAuthenticated, async (req, res) => {
    try {
        return res.render("newUser", { pageTitle: "New User", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});


router.post("/new-user", ensureAuthenticated, async (req, res) => {
    try {
        const { balance, currency, firstname, lastname, email, password, phone } = req.body;
        if (!balance || !currency || !firstname || !lastname || !email || !password || !phone) {
            req.flash("error_msg", "Please fill all fields");
            return res.render("editUser", { pageTitle: "Welcome", req });
        }
        const newUser = {
            balance,
            accountNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
            currency,
            firstname,
            lastname,
            username: "@" + firstname,
            email,
            phone,
            password
        }
        const newU = new User(newUser);
        await newU.save();
        req.flash("success_msg", "account created successfully");
        return res.redirect("/new-user/");
    }
    catch (err) {
        console.log(err)
        return res.redirect("/");
    }
});



router.get("/edit-user/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await User.findOne({ _id: id });
        return res.render("editUser", { pageTitle: "Welcome", customer, req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.post("/edit-user/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { balance, currency, firstname, lastname, email, password, phone, accountNumber } = req.body;
        const customer = await User.findOne({ _id: id })
        if (!balance || !currency || !firstname || !lastname || !email || !password || !phone) {
            req.flash("error_msg", "Please fill all fields");
            return res.render("editUser", { pageTitle: "Welcome", customer, req });
        }
        await User.updateOne({ _id: id }, {
            balance,
            currency,
            firstname,
            lastname,
            email,
            password,
            phone,
            accountNumber
        });
        req.flash("success_msg", "account updated");
        return res.redirect("/edit-user/" + id);
    }
    catch (err) {
        console.log(err)
        return res.redirect("/");
    }
});

router.get("/delete-account/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.redirect("/");
        }
        await User.deleteOne({ _id: id });
        return res.redirect("/");
    } catch (err) {
        return res.redirect("/")
    }
});

router.get("/deposit", ensureAuthenticated, async (req, res) => {
    try {
        const customers = await User.find({});
        return res.render("deposit", { pageTitle: "Deposit", customers, req });
    } catch (err) {
        return res.redirect("/")
    }
});

router.post("/deposit", ensureAuthenticated, async (req, res) => {
    try {
        const { amount, userID, debt } = req.body;
        if (!amount || !userID || !debt) {
            req.flash("error_msg", "Please provide all fields");
            return res.redirect("/deposit");
        }
        const customer = await User.findOne({ _id: userID });
        const newHistData = {
            type: "Credit",
            userID,
            amount,
            account: customer.email
        }
        const newHist = new History(newHistData);
        await newHist.save();

        await User.updateOne({ _id: userID }, {
            balance: Number(customer.balance) + Number(amount),
            active_deposit: amount,
            last_balance: amount,
            debt,
            total_deposit: Number(customer.total_deposit) + Number(amount)
        });

        req.flash("success_msg", "Deposit successful");
        return res.redirect("/deposit");

    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
})



router.get("/change-password", ensureAuthenticated, async (req, res) => {
    try {
        return res.render("changePassword", { layout: "layout", pageTitle: "Change Password", req });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
})

router.post("/change-password", ensureAuthenticated, async (req, res) => {
    try {
        const { password, password2 } = req.body;
        if (!password || !password2) {
            req.flash("error_msg", "Please provide fill all fields");
            return res.redirect("/change-password");
        }
        else if (password !== password2) {
            req.flash("error_msg", "Both passwords must be same");
            return res.redirect("/change-password");
        }
        else if (password.length < 6) {
            req.flash("error_msg", "Password too short")
            return res.redirect("/change-password");
        } else {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password2, salt);
            await Admin.updateOne({ _id: req.user.id }, {
                password: hash
            });
            req.flash("success_msg", "password updated successfully");
            return res.redirect("/change-password");
        }

    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});


module.exports = router;