import express from 'express'
import { registerUser ,loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, generatePayment, verifyPayment } from '../controllers/userController.js'
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

// user appointment 
userRouter.post('/book-appointment',authUser,bookAppointment)

// see the my appointments
userRouter.get('/appointments', authUser,listAppointment)

//cancel the appointment by user
userRouter.post('/cancel-appointment', authUser, cancelAppointment)

// generate payment
userRouter.post('/generate-payment', authUser, generatePayment)

// verify payment
userRouter.post('/verify-payment', verifyPayment)

export default userRouter

