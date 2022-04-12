const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const JWT_SECRET="RawatRock@0012"
var fetchuser=require("../middleware/fetchuser");
let success=false;
//Route 1:create a user using: POST "/api/auth/createUser". Dosen't require Auth
router.post(
  "/createUser",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be of atleast 8 charcters").isLength({
      min: 8,
    }),
    body("name", "enter a valid name").isLength({ min: 4 }),
  ],
  async (req, res) => {
    //if there is error in validation,send bad request
     success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    // check whether a user with this email already exits;
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success=false;
        return res.status(400).json({success, error: "sorry a user with this email already exits" });
      }
      const salt=await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password,salt);
      //creating a news error
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      //use when  not using async function
      //   .then(user => res.json(user))
      //   .catch(err=> {console.log(err)
      // res.json({error:'please enter a unique value for email',message:err.message})});

      /* console.log(req.body);
    const user=User(req.body);
    user.save();
    res.send(req.body);*/
    const data={
     user:{
       id:user.id
     }
    }
    const authToken=jwt.sign(data,JWT_SECRET);  
     success=true;   
    res.json({success,authToken});



    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);


//Route 2:authenticate a user using: POST "/api/auth/createUser". Dosen't require Auth
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "p").isLength({
      min: 8,
    })
  ],
  async (req, res) => {
//if there is error in validation,send bad request
 success=false;
const errors = validationResult(req);
if (!errors.isEmpty()) {
  
  return res.status(400).json({ errors: errors.array() });
}
const {email,password}=req.body;
try {
  let user=await User.findOne({email});
  if(!user)
  {
    success=false;
    return res.status(400).json({success,error:"please login with correct credentials"});
  }
  const passwordCompare=await bcrypt.compare(password,user.password);
  if(!passwordCompare)
  {
    success=false;
    return res.status(400).json({success,error:"please login with correct credentials"});
  }
  const data={
    user:{
      id:user.id
    }
   }
   const authToken=jwt.sign(data,JWT_SECRET);  
       success=true;
  res.json({success,authToken});
} 
catch (error) {
  console.error(error.message);
      res.status(500).send("some error occured");
}

  })

//Route 3:get loogged in user details: POST "/api/auth/getUser".  require Auth
router.post(
  "/getUser",fetchuser, async (req, res) => {
    try {
      userId=req.user.id;
      const user=await User.findById(userId).select("-password");
      success=true;
      res.send({success,user});
    } 
    catch (error) {
      success=false;
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  })

module.exports = router;
