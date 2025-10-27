import express from 'express'
<<<<<<< HEAD
import { registerUser ,loginUser, getProfile } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
=======
import { registerUser ,loginUser } from '../controllers/userController.js'
>>>>>>> origin/main

const userRouter = express.Router()

// to register the user
userRouter.post('/register', registerUser)

// to log the user
userRouter.post('/login', loginUser)

<<<<<<< HEAD
// get user profile details 
userRouter.get('/get-profile',authUser,getProfile)

=======
>>>>>>> origin/main
export default userRouter