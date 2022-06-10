const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { findOne } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = "minimyname@3.";

//  Route1: create a user using :POST '/auth/creatuser'.No login required
router.post('/creatuser',[
    body('name','Enter valid name').isLength({ min: 3 }),
    body('email','Enter valid email').isEmail(),
    body('password','password must be atleast 5 character').isLength({ min: 5 }) ],
     async (req, res) => {
         let success = false;
    console.log(req.body);
    // const user = User(req.body);
    // user.save();

    //if there are errors return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
try{
    //check whether the user with the same email exists already
    let user = await User.findOne({email:req.body.email})
    if (user){
      return res.status(400).json({success, errors: "Sorry a user with same email already exists" });  
    }
//create a new user
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt)
     user = await User.create({
     name: req.body.name,
     email:req.body.email,
      password:secPass ,
    })
    const data = {
        user:{id:user.id}
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authToken});
    //res.json(user);

} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error"); 
}
//     .then(user => res.json(user)
//     ).catch(err=>{console.log(err)
//     res.json({error:"Please enter a unique value for email",message:err.message})});
//    // res.send(req.body);
 })

// Route2: Authenticate a user using :POST '/auth/login'.No login required
router.post('/login',[
    body('email','Enter valid email').isEmail(),
    body('password','password cannot be blank').exists() ],
     async (req, res) => {
        let success = false;
    //if there are errors return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email,password } = req.body;
    try {
        let user = await User.findOne({email});
        if (!user){
             success = false;
         return res.status(400).json({success, errors: "Please try to login user with correct credentials" });   
        }

        const passCompare = await bcrypt.compare(password,user.password);
        if (!passCompare){
            success=false;
            return res.status(400).json({success, errors: "Please try to login pass with correct credentials" });
        }
        
        const data = {
        user:{id:user.id}
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success,authToken});

    }catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error"); 
    }
 })


 //  Route3 : Get loggedIn user Details :POST '/auth/getuser'. Login required
  
router.post('/getuser', fetchUser,async (req, res) => {
try {
     userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user);
} 
catch (error) {
console.error(error.message)
    res.status(500).send("Internal server error"); 
    }    
 })

 module.exports = router;
