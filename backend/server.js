import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectBD from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port = process.env.PORT || 4000

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
connectBD()
connectCloudinary()

//api endpoints
//--- to access the admin
app.use('/api/admin', adminRouter) // localhost:4000/api/admin

//---to access the doctors
app.use('/api/doctor',doctorRouter)


//---to access the users
app.use('/api/user', userRouter)


app.get('/' , (req,res)=>{
    res.send('API working hi heloo')
})

app.listen(port,()=>console.log("server started", port)) 