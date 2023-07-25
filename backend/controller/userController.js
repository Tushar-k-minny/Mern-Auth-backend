import User from '../models/userModel.js'
import generateToken from '../utils/generateTokens.js'
import { protect } from '../middleware/authMiddleware.js'


// @desc Auth user and get token
//@route POST/api/users/auth
//@access Public
import asyncHandler from 'express-async-handler'

export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,

        })
    }
    else {
        res.status(401)
        throw new Error('Invalid User email or Password')
    }

})



//@desc Register a new user
// @route POST api/users
//@access Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;



    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already Exists')
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,

        })

    }
    else {
        res.status(400)
        throw new Error('Invalid User')
    }

})




//@desc get user profile
// @route get /api/users/profile
//@access Private
export const getUserProfile = asyncHandler(async (req, res) => {
    if (req.user) {

        res.json({
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email
        })

    }
    else {
        res.status(401)
        throw new Error("User not Found")
    }

    res.send()
})



//@desc Update a user
//@route put /api/users/profile
//@access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,

        })

    }

    else {
        res.status(401)
        throw new Error("user not found")
    }
})



//@des Logout user/clear cache
//@route Post /api/users/logout
//@access Public
export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "logout Successful" })
})