import express from 'express'
import { registerUser ,loginUser, getProfile, updateProfile } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

// to register the user
userRouter.post('/register', registerUser)

// to log the user
userRouter.post('/login', loginUser)

// get user profile details 
userRouter.get('/get-profile',authUser,getProfile)

// update user profile
userRouter.post('/update-profile', upload.single('image'),authUser,updateProfile)

export default userRouter