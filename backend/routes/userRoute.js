import express from 'express'
import { registerUser ,loginUser, getProfile } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'

const userRouter = express.Router()

// to register the user
userRouter.post('/register', registerUser)

// to log the user
userRouter.post('/login', loginUser)

// get user profile details 
userRouter.get('/get-profile',authUser,getProfile)

export default userRouter