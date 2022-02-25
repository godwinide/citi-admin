const router = require("express").Router();
const User = require("../../model/User");

router.post("/login", async (req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({success: false, msg: "Invalid credentials"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, msg: "Invalid credentials"});
        }
        if(user.password !== password){
            return res.json({success: false, msg: "Invalid credentials"});
        }
        else{
            return res.json({success: true, msg: "Login success", user});
        }
    }catch(err){
        return res.json({success: false, msg:"Something went wrong"});
    }
})

module.exports = router;