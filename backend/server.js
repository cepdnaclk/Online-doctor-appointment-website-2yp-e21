import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectBD from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

//app config
const app = express()
const port = process.env.PORT || 4000

//middlewares
app.use(express.json())
app.use(cors())
connectBD()
connectCloudinary()

//api endpoints
app.get('/' , (req,res)=>{
    res.send('API working hi heloo')
})

app.listen(port,()=>console.log("server started", port)) 