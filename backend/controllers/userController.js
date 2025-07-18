import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import asyncHandler from '../middlewares/asyncHandler.js';
import createToken from '../utils/createToken.js';

const createUser = asyncHandler(async (req, res) => {

    const {username, email, password} = req.body;
    // console.log(username);
    // console.log(email);
    // console.log(password);

    if(!username || !email || !password){
        throw new Error('Please do fill all the fields')
    } 
    const userExists = await User.findOne({email});
    // if (userExists) res.status(400).send("User already exists, please login");
    if (userExists) {
        res.status(400);
        throw new Error("User already exists, please login");
    }
    

    // to hash the user pswrd 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User ({ username, email, password: hashedPassword})

    try{
        await newUser.save()
        createToken(res, newUser._id)
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    }
    catch (error) {
        res.status(400)
        throw new Error ("Invalid user data")
    }

});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password}=req.body;
    // console.log(email);
    // console.log(password);

    const existingUser=await User.findOne({email});
    console.log(existingUser);

    if(existingUser)
    {
        const isPasswordCorrect =await bcrypt.compare(password, existingUser.password)

        if(isPasswordCorrect)
        {
            createToken(res, existingUser._id)

            res.status(201).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
            })
        }
        else
        {
            res.status(400).json({message :"Wrong password"})
        }
    }
    else
    {
        res.status(400).json({message:"User not found"})
        // res.status(400).send("User not found")
    }
 })

 const logoutCurrentUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message:"User logged out successfully"})
 })

 const getAllUsers = asyncHandler(async(req, res)=>{
    const users = await User.find({})
    res.json(users);

 })
 const getCurrentUserProfile = asyncHandler(async(req, res) =>{
    const user = await User.findById(req.user._id)
    // console.log(user);
    if (user){
        res.json({
            _id: user._id,
            username : user.username,
            email: user.email
        })
    }
    else{
        res.status(404)
        throw new Error("User not found")
    }
 }
) ;

const updateCurrentUserProfile = asyncHandler(async(req, res) =>{

    const user = await User.findById(req.user._id)
    if (user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedpassword;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }
    else{
        res.status(404)
        throw new Error("User not found")
    }
    
})
export {createUser, loginUser, logoutCurrentUser,getAllUsers, getCurrentUserProfile, updateCurrentUserProfile};