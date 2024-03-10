const { urlencoded } = require("body-parser")
const express=require("express")

const user=require("../backend/route/userroute")
const cookieParser = require("cookie-parser")


if(process.env.NODE_ENV!=="production"){
    
    require("dotenv").config({path:"backend/config/config.env"})
}
const app=express()


app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({ limit:"100mb" ,extended:true}))
app.use(cookieParser())

app.use("/api/v1/",user)

module.exports=app