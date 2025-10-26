import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

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
            date:Date.now(),
            slots_booked: {} // not sure nessaasry
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

// API for admin login
const loginAdmin = async (req, res) =>{
    try {
        if (!req.body) {
            return res.status(400).json({ success:false, message:'Request body is missing. Set Content-Type and include email and password.' })
        }
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({ success:false, message:'email and password are required' })
        }
        
        if((email === process.env.ADMIN_EMAIL) && (password === process.env.ADMIN_PASSWORD)){
            // const payload = { 
            //     id: "admin_user_01", 
            //     role: "admin" 
            //             };

            // const token = jwt.sign(payload, process.env.JWT_SECRET) , more applicable way
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true , token})
            
        }else{
            res.json({success:false, message:"Invalid Credentials"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// API to get all doctors list for admin panel
const allDoctors = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select('-password') // get data without password
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req,res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API to cancel the appointment by doctor
// API for get user appointments for frontend my-appointments page
const listAppointment = async (req,res)=>{
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// API to cancel appointments - copied by user-cancel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        
        //find Appointment 
        const appointmentData = await appointmentModel.findById(appointmentId);

        // appointmentData null check
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Convert mongoose doc to plain object to avoid unexpected getters
        const appt = appointmentData && appointmentData.toObject ? appointmentData.toObject() : appointmentData;

        // cancel the appointment (mark cancelled)
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // free the doctor slot if present
        const docId = appt.docId || appt.doc?._id || appt.docId;
        const slotDate = appt.slotDate;
        const slotTime = appt.slotTime;

        if (docId) {
            const doctorData = await doctorModel.findById(docId);
            const slots_booked = (doctorData && doctorData.slots_booked) ? { ...doctorData.slots_booked } : null;

            if (slots_booked && slotDate && Array.isArray(slots_booked[slotDate])) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
                await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            }
        }

        return res.json({ success: true, message: "Appointment Cancelled" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API to get the dashbord data for admin panel
const adminDashboard = async (req,res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appoinments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            // Keep the misspelled key for backward compatibility, but also provide the correct one
            appoinments: appoinments.length,
            appointments: appoinments.length,
            patients: users.length,
            // Return up to the latest 10 appointments instead of 5
            latestAppointments: appoinments.reverse().slice(0, 10)
        }
        res.json({success:true , dashData})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel,adminDashboard };




/* without using passowrd in jason web token , 
ආරක්ෂිත ක්‍රමය
const payload = { 
    id: "admin_user_01", 
    role: "admin" 
};
const token = jwt.sign(payload, process.env.JWT_SECRET);
*/