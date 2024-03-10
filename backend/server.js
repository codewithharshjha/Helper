
const { connectodatabase } = require("./config/db")
const app=require("./app")
const cloudinary=require("cloudinary")
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

connectodatabase()
app.listen(process.env.PORT,()=>{
console.log(`server is running${process.env.PORT}`)
})
