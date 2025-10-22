import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'

// API for adding doctor 

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        //     console.log({name,email,password,speciality, degree, experience, about, fees,address},imageFile)

        //checking are their all datas in the  doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        // validating the email
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        // validating the password
        if(password.length < 8){
            return res.json({success:false,message:"Please enter a stong password"})
        }

        // check duplicate email
        const existing = await doctorModel.findOne({ email })
        if (existing) {
            return res.status(409).json({ success:false, message: 'A doctor with this email already exists' })
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        // coerce fees to number
        const feesNum = Number(fees)
        
        // safe parse address (when sent as JSON string via multipart/form-data)
        let addressObj = address
        if (typeof address === 'string') {
            try {
                addressObj = JSON.parse(address)
            } catch (e) {
                return res.status(400).json({success:false, message:'address must be valid JSON'})
            }
        }

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees: feesNum,
            address: addressObj,
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Doctor Added"})
    }

    catch (error) {
        console.log(error)
        // handle duplicate key error from Mongo
        if (error && error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ success:false, message:'Email already in use' })
        }
        res.status(500).json({success:false, message:error.message})
    }
}



export { addDoctor }