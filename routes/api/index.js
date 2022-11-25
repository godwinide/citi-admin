const router = require("express").Router();
const User = require("../../model/User");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, msg: "Invalid credentials" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, msg: "Invalid credentials" });
        }
        if (user.password !== password) {
            return res.json({ success: false, msg: "Invalid credentials" });
        }
        else {
            return res.json({ success: true, msg: "Login success", user });
        }
    } catch (err) {
        return res.json({ success: false, msg: "Something went wrong" });
    }
});


router.post("/change-password", async (req, res) => {
    try {
        const { password, password2, id } = req.body
        if (!password || !password2) {
            return res.json({
                success: false,
                msg: "Fill all required fields!"
            });
        }
        if (password !== password2) {
            return res.json({
                success: false,
                msg: "Both passwords are not thesame"
            });
        }
        if (password.length < 6) {
            return res.json({
                success: false,
                msg: "password is too short"
            })
        }
        const user = await User.findById(id);
        if (!user) {
            return res.json({
                success: false,
                msg: "Invalid credentials"
            });
        }
        await User.updateOne({ _id: id }, {
            password
        });
        return res.json({
            success: true,
            msg: "Password changed successfully"
        });
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            msg: "internal server error"
        })
    }
});

module.exports = router;