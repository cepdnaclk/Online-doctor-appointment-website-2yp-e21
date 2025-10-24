import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import crypto from 'crypto'




// API to register a user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // validating the details
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong email" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid Credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: message.error })
    }

}


// API to get user profile data
const getProfile = async (req,res) => {
    try {
        const{userId} = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true , userData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API to update the user profile
const updateProfile = async (req,res) =>{
    try {
        const {userId, name, phone , address, dob , gender} = req.body
        const imageFile =  req.file
        
        if(!name || !phone || !dob || !gender){
            return res.json({success:false, message:"Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address), dob,gender})
        if(imageFile){
            //upload image to cloudinary 
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message:"Profile Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API for book an appointment
const bookAppointment = async (req,res) => {
    try {
        const{userId, docId, slotDate, slotTime} = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData){
            return res.json({success:false,message:'Doctor not found'})
        }

        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'})
        }

        const slots_booked = docData.slots_booked || {}

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slot not available'})
            }
            slots_booked[slotDate].push(slotTime)
        }else{
            slots_booked[slotDate] = [slotTime]
        }

        const userData = await userModel.findById(userId).select('-password')

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        const cleanDocData = docData.toObject()
        delete cleanDocData.slots_booked // exclude booked slots when embedding doctor data in appointment record

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: cleanDocData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const  newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()
        res.json({success:true, message:'Appointment Booked'})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message })
    }
}

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

// API to cancel appoinments
const cancelAppointment = async (req,res)=>{
    try {
        const {userId, appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if(appointmentData.userId !== userId){
            return res.json({success:false,message:"Unauthorized action"})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        // releasing doctor slot
        const {docId,slotDate,slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e!==slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true, message:"Appointment Cancelled"})
        

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// to change
// API to make payment of appointment using payhere
// const generatePayment = async (req, res) => {
//     try {
//         const { appointmentId } = req.body;
//         const appointment = await appointmentModel.findById(appointmentId);

//         if (!appointment) {
//             return res.json({ success: false, message: "Appointment not found" });
//         }

//     const merchant_id = process.env.PAYHERE_MERCHANT_ID;
//     const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;
//         const order_id = appointment._id;
//     const amount = Number(appointment.amount || 0);
//         const currency = "LKR";
//     // PayHere requires amount formatted to exactly 2 decimal places as a string for hashing
//     const amountFormatted = amount.toFixed(2);
//         const
//             first_name = appointment.userData.name.split(' ')[0],
//             last_name = appointment.userData.name.split(' ')[1] || '',
//             email = appointment.userData.email,
//             phone = appointment.userData.phone || '0771234567',
//             address = appointment.userData.address ? appointment.userData.address.line1 : 'No Address',
//             city = appointment.userData.address ? appointment.userData.address.city : 'Colombo',
//             country = 'Sri Lanka';

//         // Signature spec: MD5( merchant_id + order_id + amount + currency + MD5(merchant_secret) ) uppercased
//         const merchantSecretMd5 = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
//         const hash = crypto
//             .createHash('md5')
//             .update(`${merchant_id}${order_id}${amountFormatted}${currency}${merchantSecretMd5}`)
//             .digest('hex')
//             .toUpperCase();

//         const notifyUrl = process.env.PAYHERE_NOTIFY_URL || `${process.env.BACKEND_URL}/api/user/verify-payment`;

//         const payment = {
//             sandbox: true,
//             merchant_id,
//             return_url: `${process.env.FRONTEND_URL}/my-appointments`,
//             cancel_url: `${process.env.FRONTEND_URL}/my-appointments`,
//             notify_url: notifyUrl,
//             order_id,
//             items: `Appointment with ${appointment.docData.name}`,
//             amount: amountFormatted,
//             currency,
//             first_name,
//             last_name,
//             email,
//             phone,
//             address,
//             city,
//             country,
//             hash
//         };

//         res.json({ success: true, payment });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// userController.js

// const generatePayment = async (req, res) => {
//     try {
//         const { appointmentId } = req.body;
//         const appointment = await appointmentModel.findById(appointmentId);

//         if (!appointment) {
//             return res.json({ success: false, message: "Appointment not found" });
//         }

//         const merchant_id = process.env.PAYHERE_MERCHANT_ID;
//         const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;
        
//         // --- 1. changed here ---
//         const order_id = appointment._id.toString(); // Convert ObjectId to string
        
//         const amount = Number(appointment.amount || 0);
//         const currency = "LKR";
//         const amountFormatted = amount.toFixed(2).toString(); // This is correct
        
//         const {
//             first_name = appointment.userData.name.split(' ')[0],
//             last_name = appointment.userData.name.split(' ')[1] || '',
//             email = appointment.userData.email,
//             phone = appointment.userData.phone || '0771234567',
//             address = appointment.userData.address ? appointment.userData.address.line1 : 'No Address',
//             city = appointment.userData.address ? appointment.userData.address.city : 'Colombo',
//             country = 'Sri Lanka'
//         } = appointment.userData;


//         const merchantSecretMd5 = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
        
//         // --- 2. changed this ---
//         const hash = crypto
//             .createHash('md5')
//             .update(merchant_id + order_id + amountFormatted + currency + merchantSecretMd5) // Use + instead of ${}
//             .digest('hex')
//             .toUpperCase();

//         const notifyUrl = process.env.PAYHERE_NOTIFY_URL || `${process.env.BACKEND_URL}/api/user/verify-payment`;

//         const payment = {
//             sandbox: true,
//             merchant_id,
//             return_url: `${process.env.FRONTEND_URL}/my-appointments`,
//             cancel_url: `${process.env.FRONTEND_URL}/my-appointments`,
//             notify_url: notifyUrl,
//             order_id,
//             items: `Appointment with ${appointment.docData.name}`,
//             amount: amountFormatted,
//             currency,
//             first_name,
//             last_name,
//             email,
//             phone,
//             address,
//             city,
//             country,
//             hash
//         };

//         res.json({ success: true, payment });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// // API to verify payment and update database
// const verifyPayment = async (req, res) => {
//     try {
//         const { order_id, payment_id, amount, currency, status_code } = req.body;

//         if (status_code == 2) { // Payment success
//             const appointment = await appointmentModel.findById(order_id);
//             if (appointment) {
//                 await appointmentModel.findByIdAndUpdate(order_id, { payment: true });
//                 const doctor = await doctorModel.findById(appointment.docId);
//                 if (doctor) {
//                     const newEarnings = (doctor.earnings || 0) + appointment.amount;
//                     await doctorModel.findByIdAndUpdate(appointment.docId, { earnings: newEarnings });
//                 }
//             }
//         }
//         res.status(200).send(); // Respond to PayHere
//     } catch (error) {
//         console.log(error);
//         res.status(500).send();
//     }
// }

// Mock Payment Gateway

// API to generate a mock payment session
const generateMockPayment = (req, res) => {
    try {
        const { appointmentId } = req.body;
        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment ID is required" });
        }
        // Simulate a payment session creation
        const paymentSession = {
            sessionId: `mock_session_${appointmentId}_${Date.now()}`,
            appointmentId,
            redirectUrl: `${process.env.FRONTEND_URL}/mock-payment/${appointmentId}`
        };
        res.json({ success: true, payment: paymentSession });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to generate mock payment session" });
    }
}

// API to verify mock payment and update database
const verifyMockPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment ID is required" });
        }
        const appointment = await appointmentModel.findById(appointmentId);
        if (appointment) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            const doctor = await doctorModel.findById(appointment.docId);
            if (doctor) {
                const newEarnings = (doctor.earnings || 0) + appointment.amount;
                await doctorModel.findByIdAndUpdate(appointment.docId, { earnings: newEarnings });
            }
        }
        res.json({ success: true, message: "Payment successful and appointment updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Payment verification failed" });
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, generateMockPayment, verifyMockPayment }
