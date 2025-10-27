import express from 'express'
import { addDoctor,allDoctors,loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

// to add doctors
adminRouter.post('/add-doctor',authAdmin ,upload.single('image'), addDoctor)

// to register
adminRouter.post('/login', loginAdmin)

//to get all doctors
adminRouter.post('/all-doctors', authAdmin,allDoctors)

// update the availability of the doctors
adminRouter.post('/change-availability',authAdmin, changeAvailability)

export default adminRouter