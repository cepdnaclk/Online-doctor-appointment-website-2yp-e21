import express from 'express'
import { addDoctor,loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

// to add doctors
adminRouter.post('/add-doctor',authAdmin ,upload.single('image'), addDoctor)

// to register
adminRouter.post('/login', loginAdmin)

export default adminRouter