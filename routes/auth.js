const router = require('express').Router();
const  User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../routes/validation')





//REGISTER 
router.post('/register', async (req,res) => {

    //LETS VALIDATE DATA BEFORE WE MAKE A USER
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.send('Email already exists')

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Create a new user
    const user = new User({
        name: req.body.name,
        email : req.body.email,
        password : hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req,res) => {

    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email:req.body.email});
    if(!user) return res.send('Email is not found');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is not valid');

    //Create and assign a token
     const token = jwt.sign({_id: user._id},process.env.SECRET_TOKEN);
     res.header('auth-token', token).send(token);

    res.send('Logged in');



});


module.exports = router;