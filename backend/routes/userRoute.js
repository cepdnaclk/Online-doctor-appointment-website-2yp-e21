import express from 'express'
import { registerUser ,loginUser } from '../controllers/userController.js'

const userRouter = express.Router()

// to register the user
userRouter.post('/register', registerUser)

// to log the user
userRouter.post('/login', loginUser)

export default userRouter